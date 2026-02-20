import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
// Servicios de auth/perfiles.
// Separar la lógica de Supabase en servicios mantiene el store simple.
import {
  updateUserProfile,
  logoutSession,
  getProfileByUserId,
  updateProfileFieldsForUser,
  updateAvatarPathForUser,
} from "../services/authService";

type RoleName = "NORMAL" | "ADMIN";

type UsuarioState = {
  id: string | null;
  email: string | null;
  nombreVisible: string | null;
  avatarPath: string | null;
  // Marca de tiempo para forzar refresh de la imagen en UI.
  avatarUpdatedAt: number | null;
  rol: RoleName | null;
  isLoggedIn: boolean;
  lastEmailChangeAt: number | null;

  setFromSession: (session: Session | null) => Promise<void>;
  clearUser: () => Promise<void>;
  setNombreVisible: (nombre: string) => Promise<void>;
  setEmail: (email: string) => Promise<void>;
  updatePerfil: (data: { nombreVisible?: string; email?: string }) => Promise<{ emailPending: boolean }>;
  updateAvatarPath: (avatarPath: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useUsuarioStore = create<UsuarioState>()((set, get) => ({
  id: null,
  email: null,
  nombreVisible: null,
  avatarPath: null,
  avatarUpdatedAt: null,
  rol: null,
  isLoggedIn: false,
  lastEmailChangeAt: null,

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

    // Avatar en Storage (ruta relativa dentro del bucket).
    const avatarPath =
      (profile?.avatar_path as string | undefined) ??
      (profile?.avatarPath as string | undefined) ??
      (profile?.avatar_url as string | undefined) ??
      (profile?.avatarUrl as string | undefined) ??
      (profile?.photo_url as string | undefined) ??
      (profile?.photoUrl as string | undefined) ??
      null;

    const newState = {
      id: user.id,
      email: user.email ?? null,
      nombreVisible,
      avatarPath,
      // Se resetea para evitar refrescos innecesarios al iniciar sesion.
      avatarUpdatedAt: null,
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
      avatarPath: null,
      avatarUpdatedAt: null,
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

    // Si solo cambia el nombre, actualizamos rápido (sin Auth).
    if (nameChanged && !emailChanged) {
      const updatedState = {
        ...currentState,
        nombreVisible: data.nombreVisible ?? currentState.nombreVisible,
      };
      set(updatedState);
      await AsyncStorage.setItem("usuario-data", JSON.stringify(updatedState));

      const userId = currentState.id;
      if (userId) {
        await updateProfileFieldsForUser(userId, { nombreVisible: data.nombreVisible });
      }

      return { emailPending: false };
    }

    // Si cambia el email, primero actualizamos Auth para saber si queda pendiente.
    let emailPending = false;
    if (emailChanged) {
      const now = Date.now();
      const lastAttempt = currentState.lastEmailChangeAt ?? 0;
      const minIntervalMs = 5 * 1000; // 5 segundos
      if (now - lastAttempt < minIntervalMs) {
        throw new Error("Has intentado cambiar el email demasiado rápido. Espera 5 segundos e inténtalo de nuevo.");
      }

      const authResult = await updateUserProfile({
        email: data.email,
        nombreVisible: nameChanged ? data.nombreVisible : undefined,
      });
      emailPending = authResult?.emailPending ?? false;

      set({ ...get(), lastEmailChangeAt: now });
    }

    // Actualizamos estado local:
    // - si el email queda pendiente, mantenemos el email anterior
    // - si no queda pendiente, aplicamos el nuevo email
    const updatedState = {
      ...currentState,
      ...(nameChanged ? { nombreVisible: data.nombreVisible } : {}),
      ...(emailChanged && !emailPending ? { email: data.email } : {}),
      ...(emailChanged ? { lastEmailChangeAt: Date.now() } : {}),
    };
    set(updatedState);
    await AsyncStorage.setItem("usuario-data", JSON.stringify(updatedState));

    // Actualiza tabla profiles (no tocar email si está pendiente).
    const userId = currentState.id;
    if (userId && (nameChanged || (emailChanged && !emailPending))) {
      await updateProfileFieldsForUser(userId, {
        nombreVisible: nameChanged ? data.nombreVisible : undefined,
        email: emailChanged && !emailPending ? data.email : undefined,
      });
    }

    return { emailPending };
  },

  // Logout de Supabase y limpieza local.
  // Deja el estado en modo anónimo.
  logout: async () => {
    await logoutSession();
    await get().clearUser();
  },

  // Actualiza el avatar en local y en profiles.
  updateAvatarPath: async (avatarPath) => {
    if (!avatarPath) return;

    const currentState = get();
    // Actualiza estado y dispara refresh de URL firmada en las pantallas.
    const updatedState = { ...currentState, avatarPath, avatarUpdatedAt: Date.now() };
    set(updatedState);
    await AsyncStorage.setItem("usuario-data", JSON.stringify(updatedState));

    const userId = currentState.id;
    if (userId) {
      await updateAvatarPathForUser(userId, avatarPath);
    }
  },
}));
