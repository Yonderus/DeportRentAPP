import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useTemaStore } from "./preferencias/index";
import { obtenerColores } from "../../theme";

export default function InicioScreen() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  return (
    <View style={{ flex: 1, backgroundColor: colores.fondoPrincipal }}>
      <Text style={{ color: colores.textoPrincipal }}>
        Página de Inicio
      </Text>
    </View>
  );
}
