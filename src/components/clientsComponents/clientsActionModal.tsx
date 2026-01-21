import React from "react";
import { Modal, View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { Client } from "../../data/clients";

type Props = {
  visible: boolean;
  client: Client | null;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
};

export default function ClienteActionsModal({
  visible,
  client,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  if (!client) return null;

  const confirmarBorrado = () => {
    Alert.alert("Eliminar cliente", "¿Seguro que quieres eliminarlo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          onDelete(client.id);
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={s.card} activeOpacity={1}>
          <Text variant="titleMedium" style={s.title}>
            {client.name} {client.surname}
          </Text>

          <Text style={s.line}>📞 {client.phone}</Text>
          <Text style={s.line}>📧 {client.email || "-"}</Text>

          <View style={s.row}>
            <Button mode="text" onPress={confirmarBorrado}>
              Eliminar
            </Button>
            <Button mode="contained" onPress={() => onEdit(client)}>
              Editar
            </Button>
          </View>

          <Button
            mode="contained-tonal"
            onPress={onClose}
            style={{ marginTop: 12 }}
          >
            Cerrar
          </Button>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontWeight: "800",
    marginBottom: 10,
  },
  line: {
    marginTop: 6,
    color: "#374151",
  },
  row: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
