import { create } from "zustand";

export type Rol = "ADMIN" | "GESTOR" | "CLIENTE";

type UsuarioState = {
  id: string;
  email: string;
  nombreVisible: string;
  rol: Rol;

  setNombreVisible: (nombre: string) => void;
};

export const useUsuarioStore = create<UsuarioState>((set) => ({
  id: "1",
  email: "admin@demo.com",
  nombreVisible: "Admin",
  rol: "ADMIN",

  setNombreVisible: (nombre) => set({ nombreVisible: nombre }),
}));
