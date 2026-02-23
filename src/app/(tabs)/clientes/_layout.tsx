import React from "react";
import { Stack, useRouter } from "expo-router";
import { useTemaStore } from "../preferencias";
import { obtenerColores } from "../../../theme";
import { useUsuarioStore } from "../../../stores/useUsuarioStore";

export default function Layout() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const rol = useUsuarioStore((s) => s.rol);
  const router = useRouter();

  React.useEffect(() => {
    if (rol && rol !== "ADMIN") {
      router.replace("/(tabs)");
    }
  }, [rol, router]);

  if (rol && rol !== "ADMIN") {
    return null;
  }

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
