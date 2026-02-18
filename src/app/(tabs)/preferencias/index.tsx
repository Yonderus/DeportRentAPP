import React from "react";
import { View } from "react-native";
import { Card, Switch, Text } from "react-native-paper";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TemaApp, obtenerColores } from "../../../theme";

type PreferenciasState = {
  tema: TemaApp;
  toggleTema: () => void;
};

export const useTemaStore = create<PreferenciasState>()(
  persist(
    (set, get) => ({
      tema: "claro",
      toggleTema: () =>
        set({
          tema: get().tema === "claro" ? "oscuro" : "claro",
        }),
    }),
    {
      name: "TEMA_APP",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { obtenerColores };

export default function PreferenciasScreen() {
  const tema = useTemaStore((s) => s.tema);
  const toggleTema = useTemaStore((s) => s.toggleTema);
  const colores = obtenerColores(tema);

  const esOscuro = tema === "oscuro";

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: colores.fondoPrincipal }}>
      <Card style={{ backgroundColor: colores.fondoCard }}>
        <Card.Content
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: colores.textoPrincipal }}>Modo oscuro</Text>
          <Switch value={esOscuro} onValueChange={toggleTema} />
        </Card.Content>
      </Card>
    </View>
  );
}
