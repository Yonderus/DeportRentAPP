import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, roles } from "../types/types";

type RoleName = "NORMAL" | "ADMIN";

type UsuarioState = {
  id: string | null;
  email: string | null;
  nombreVisible: string | null;
  rol: RoleName | null;
  isLoggedIn: boolean;

  login: (usuario: User) => Promise<void>;
  setNombreVisible: (nombre: string) => Promise<void>;
  setEmail: (email: string) => Promise<void>;
  updatePerfil: (data: { nombreVisible?: string; email?: string }) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
};

export const useUsuarioStore = create<UsuarioState>()((set, get) => ({
  id: null,
  email: null,
  nombreVisible: null,
  rol: null,
  isLoggedIn: false,

  login: async (usuario: User) => {
    const role = roles.find((r) => r.id === usuario.roleId);
    const newState = {
      id: usuario.id.toString(),
      email: usuario.email,
      nombreVisible: usuario.name,
      rol: role?.name ?? "NORMAL" as RoleName,
      isLoggedIn: true,
    };
    
    set(newState);
    await AsyncStorage.setItem("usuario-data", JSON.stringify(newState));
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
    const updatedState = {
      ...currentState,
      ...(data.nombreVisible !== undefined ? { nombreVisible: data.nombreVisible } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
    };
    set(updatedState);
    await AsyncStorage.setItem("usuario-data", JSON.stringify(updatedState));
  },

  logout: async () => {
    set({
      id: null,
      email: null,
      nombreVisible: null,
      rol: null,
      isLoggedIn: false,
    });
    await AsyncStorage.removeItem("usuario-data");
  },

  loadFromStorage: async () => {
    try {
      const stored = await AsyncStorage.getItem("usuario-data");
      if (stored) {
        const data = JSON.parse(stored);
        set(data);
      }
    } catch (error) {
      console.error("Error loading from storage:", error);
    }
  },
}));
