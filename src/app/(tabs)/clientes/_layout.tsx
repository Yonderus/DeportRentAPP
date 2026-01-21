import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Clientes" }} />
      <Stack.Screen name="[id]" options={{ title: "Cliente" }} />
    </Stack>
  );
}
