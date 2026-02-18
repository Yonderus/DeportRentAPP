import React from "react";
import { Stack } from "expo-router";
import { useTemaStore } from "../preferencias";
import { obtenerColores } from "../../../theme";

export default function Layout() {
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
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}
