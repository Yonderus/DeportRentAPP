import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TemaApp = "claro" | "oscuro";

type PreferenciasState = {
  tema: TemaApp;
  setTema: (t: TemaApp) => void;
};

export const usePreferenciasStore = create<PreferenciasState>()(
  persist(
    (set) => ({
      tema: "claro",
      setTema: (t) => set({ tema: t }),
    }),
    {
      name: "PreferenciasStore",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
