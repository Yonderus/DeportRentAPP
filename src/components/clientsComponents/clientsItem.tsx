import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { Cliente } from "../../app/types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../theme";

type Props = {
  client: Cliente;
  onPress: (client: Cliente) => void;
};

export default function ClienteItem({ client, onPress }: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  
  const iniciales = client.nombre?.charAt(0) ?? "";

  return (
    <Pressable
      onPress={() => onPress(client)}
      style={({ pressed }) => [s.card, { backgroundColor: colores.fondoCard }, pressed && s.pressed]}
    >
      <Avatar.Text
        size={44}
        label={iniciales.toUpperCase()}
        style={[s.avatar, { backgroundColor: colores.btnPrimario }]}
        labelStyle={s.avatarText}
      />

      <View style={s.info}>
        <Text style={[s.name, { color: colores.textoPrincipal }]}>
          {client.nombre}
        </Text>

        <Text style={[s.secondary, { color: colores.textoSecundario }]}>{client.telefono}</Text>

        {client.email ? (
          <Text style={[s.secondary, { color: colores.textoSecundario }]} numberOfLines={1}>
            {client.email}
          </Text>
        ) : null}
      </View>

      <Text style={[s.chevron, { color: colores.textoTerciario }]}>›</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  pressed: { opacity: 0.85 },
  avatar: { marginRight: 12 },
  avatarText: { fontWeight: "800", color: "white" },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "800" },
  secondary: { fontSize: 13, marginTop: 2 },
  chevron: { fontSize: 28, fontWeight: "900", marginLeft: 8 },
});
