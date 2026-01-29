import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
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

  setFromSession: async (session) => {
    if (!session?.user) {
      await get().clearUser();
      return;
    }

    const user = session.user;
    let profile: any = null;
    try {
      profile = await getProfileByUserId(user.id);
    } catch (error) {
      console.warn("No se pudo cargar el profile:", error);
    }

    const roleRaw =
      (profile?.role as string | undefined) ??
      (profile?.rol as string | undefined) ??
      (user.app_metadata?.role as string | undefined) ??
      (user.user_metadata?.role as string | undefined) ??
      (user.user_metadata?.rol as string | undefined);
    const role = (roleRaw?.toUpperCase() as RoleName | undefined) ?? "NORMAL";

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

  setNombreVisible: async (nombre) => {
    const currentState = get();
    const updatedState = { ...currentState, nombreVisible: nombre };
    set(updatedState);
    await AsyncStorage.setItem("usuario-data", JSON.stringify(updatedState));
  },

  setEmail: async (email) => {
    const currentState = get();
    const updatedState = { ...currentState, email };
    set(updatedState);
    await AsyncStorage.setItem("usuario-data", JSON.stringify(updatedState));
  },

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

    const userId = currentState.id;
    if (userId && (nameChanged || emailChanged)) {
      await updateProfileFieldsForUser(userId, data);
    }

    if (emailChanged) {
      await updateUserProfile({ email: data.email });
    }
  },

  logout: async () => {
    await logoutSession();
    await get().clearUser();
  },
}));
