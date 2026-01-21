import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { Client } from "../../data/clients";

type Props = {
  client: Client;
  onPress: (client: Client) => void;
};

export default function ClienteItem({ client, onPress }: Props) {
  const iniciales =
    (client.name?.charAt(0) ?? "") + (client.surname?.charAt(0) ?? "");

  return (
    <Pressable
      onPress={() => onPress(client)}
      style={({ pressed }) => [s.card, pressed && s.pressed]}
    >
      <Avatar.Text
        size={44}
        label={iniciales.toUpperCase()}
        style={s.avatar}
        labelStyle={s.avatarText}
      />

      <View style={s.info}>
        <Text style={s.name}>
          {client.name} {client.surname}
        </Text>

        <Text style={s.secondary}>{client.phone}</Text>

        {client.email ? (
          <Text style={s.secondary} numberOfLines={1}>
            {client.email}
          </Text>
        ) : null}
      </View>

      <Text style={s.chevron}>›</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
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
  avatar: { backgroundColor: "#3b82f6", marginRight: 12 },
  avatarText: { fontWeight: "800", color: "white" },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "800", color: "#111827" },
  secondary: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  chevron: { fontSize: 28, fontWeight: "900", color: "#9CA3AF", marginLeft: 8 },
});
