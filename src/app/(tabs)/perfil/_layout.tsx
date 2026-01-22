import React from "react";
import { Stack } from "expo-router";
import { useTemaStore } from "../preferencias/index";
import { obtenerColores } from "../../../theme";

export default function PerfilLayout() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.fondoCard },
        headerTintColor: colores.textoPrincipal,
        headerTitleStyle: { color: colores.textoPrincipal, fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Perfil",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="preferencias"
        options={{
          title: "Preferencias",
        }}
      />
    </Stack>
  );
}
