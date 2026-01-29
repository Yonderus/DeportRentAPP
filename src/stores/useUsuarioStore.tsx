import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
// Servicios de auth/perfiles.
// Separar la lógica de Supabase en servicios mantiene el store simple.
import { updateUserProfile, logoutSession, getProfileByUserId, updateProfileFieldsForUser } from "../services/authService";

type RoleName = "NORMAL" | "ADMIN";

type UsuarioState = {
  id: string | null;
  email: string | null;
  nombreVisible: string | null;
  rol: RoleName | null;
  isLoggedIn: boolean;

  setFromSession: (session: Session | null) => Promise<void>;
  clearUser: () => Promise<void>;
  setNombreVisible: (nombre: string) => Promise<void>;
  setEmail: (email: string) => Promise<void>;
  updatePerfil: (data: { nombreVisible?: string; email?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useUsuarioStore = create<UsuarioState>()((set, get) => ({
  id: null,
  email: null,
  nombreVisible: null,
  rol: null,
  isLoggedIn: false,

  // Sincroniza el store con la sesión actual de Supabase.
  // Se ejecuta al arrancar la app y en cada cambio de sesión.
  setFromSession: async (session) => {
    if (!session?.user) {
      await get().clearUser();
      return;
    }

    const user = session.user;
    // Cargar perfil desde tabla profiles (rol/nombre visible).
    // Si falla, se hace fallback a metadata y email.
    let profile: any = null;
    try {
      profile = await getProfileByUserId(user.id);
    } catch (error) {
      console.warn("No se pudo cargar el profile:", error);
    }

    // Resolver rol desde profile o metadata.
    // Se normaliza a mayúsculas para encajar con el tipo RoleName.
    const roleRaw =
      (profile?.role as string | undefined) ??
      (profile?.rol as string | undefined) ??
      (user.app_metadata?.role as string | undefined) ??
      (user.user_metadata?.role as string | undefined) ??
      (user.user_metadata?.rol as string | undefined);
    const role = (roleRaw?.toUpperCase() as RoleName | undefined) ?? "NORMAL";

    // Resolver nombre visible (prioridad: profile).
    // Se usan varias columnas posibles por compatibilidad.
    const nombreVisible =
      (profile?.nombre_visible as string | undefined) ??
      (profile?.nombreVisible as string | undefined) ??
      (profile?.nombre as string | undefined) ??
      (profile?.full_name as string | undefined) ??
      (profile?.name as string | undefined) ??
      (user.user_metadata?.nombreVisible as string | undefined) ??
      (user.user_metadata?.nombre as string | undefined) ??
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email ??
      null;

    const newState = {
      id: user.id,
      email: user.email ?? null,
      nombreVisible,
      rol: role,
      isLoggedIn: true,
    };

    set(newState);
    await AsyncStorage.setItem("usuario-data", JSON.stringify(newState));
  },

  // Limpia estado local y storage.
  // Se usa al cerrar sesión o si no hay usuario.
  clearUser: async () => {
    set({
      id: null,
      email: null,
      nombreVisible: null,
      rol: null,
      isLoggedIn: false,
    });
    await AsyncStorage.removeItem("usuario-data");
  },

  // Actualiza nombre visible localmente (solo UI/Storage).
  // No toca Supabase; para eso se usa updatePerfil.
  setNombreVisible: async (nombre) => {
    const currentState = get();
    const updatedState = { ...currentState, nombreVisible: nombre };
    set(updatedState);
    await AsyncStorage.setItem("usuario-data", JSON.stringify(updatedState));
  },

  // Actualiza email localmente (solo UI/Storage).
  setEmail: async (email) => {
    const currentState = get();
    const updatedState = { ...currentState, email };
    set(updatedState);
    await AsyncStorage.setItem("usuario-data", JSON.stringify(updatedState));
  },

  // Actualiza perfil remoto y sincroniza store.
  // Primero actualiza UI para feedback rápido y luego remoto.
  updatePerfil: async (data) => {
    const currentState = get();
    const emailChanged =
      data.email !== undefined && data.email !== currentState.email;
    const nameChanged =
      data.nombreVisible !== undefined &&
      data.nombreVisible !== currentState.nombreVisible;

    const updatedState = {
      ...currentState,
      ...(data.nombreVisible !== undefined ? { nombreVisible: data.nombreVisible } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
    };
    set(updatedState);
    await AsyncStorage.setItem("usuario-data", JSON.stringify(updatedState));

    // Actualiza tabla profiles si existe y hay cambios relevantes.
    const userId = currentState.id;
    if (userId && (nameChanged || emailChanged)) {
      await updateProfileFieldsForUser(userId, data);
    }

    // Actualiza Auth solo si el email cambia (esto puede tardar más
    // porque Supabase puede requerir confirmación por correo).
    if (emailChanged) {
      await updateUserProfile({ email: data.email });
    }
  },

  // Logout de Supabase y limpieza local.
  // Deja el estado en modo anónimo.
  logout: async () => {
    await logoutSession();
    await get().clearUser();
  },
}));
