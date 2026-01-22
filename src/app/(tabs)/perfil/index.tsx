import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";
import { router } from "expo-router";
import { useUsuarioStore } from "../../../stores/useUsuarioStore";
import { useTemaStore } from "../preferencias/index";
import { obtenerColores } from "../../../theme";


export default function PerfilScreen() {
  const { email, rol, nombreVisible, setNombreVisible } = useUsuarioStore();
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: colores.fondoPrincipal }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text variant="headlineSmall" style={{ fontWeight: "700", color: colores.textoPrincipal }}>
          Perfil
        </Text>

        <IconButton
          icon="cog"
          size={26}
          onPress={() => router.push("/perfil/preferencias")}
          accessibilityLabel="Abrir preferencias"
          iconColor={colores.textoPrincipal}
        />
      </View>

      <Card style={{ backgroundColor: colores.fondoCard }}>
        <Card.Content style={{ gap: 8 }}>
          <Text variant="titleMedium" style={{ fontWeight: "700", color: colores.textoPrincipal }}>
            Información
          </Text>

          <Text style={{ color: colores.textoSecundario }}>Email: {email ?? "-"}</Text>
          <Text style={{ color: colores.textoSecundario }}>Rol: {rol ?? "-"}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}
