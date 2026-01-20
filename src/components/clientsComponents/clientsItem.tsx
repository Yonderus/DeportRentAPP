import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { Client } from "../../data/clients";

type Props = {
  client: Client;
  onEdit: (c: Client) => void;
  onDelete: (id: number) => void;
};

export default function ClienteItem({ client, onEdit, onDelete }: Props) {
  return (
    <View style={s.row}>
      <View style={{ flex: 1 }}>
        <Text style={s.name}>
          {client.name} {client.surname}
        </Text>
        <Text style={s.text}>{client.phone}</Text>
        {client.email ? <Text style={s.text}>{client.email}</Text> : null}
      </View>

      <IconButton icon="pencil" onPress={() => onEdit(client)} />
      <IconButton icon="delete" onPress={() => onDelete(client.id)} />
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    color: "#606060ff",
    fontWeight: "600",
  },
});
