import React from "react";
import { Modal, View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { Cliente } from "../../app/types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../theme";

type Props = {
  visible: boolean;
  client: Cliente | null;
  onClose: () => void;
  onEdit: (client: Cliente) => void;
  onDelete: (id: number) => void;
};

export default function ClienteActionsModal({
  visible,
  client,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

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
      <TouchableOpacity style={[s.backdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[s.card, { backgroundColor: colores.fondoCard }]} activeOpacity={1}>
          <Text variant="titleMedium" style={[s.title, { color: colores.textoPrincipal }]}>
            {client.nombre} {client.email}
          </Text>

          <Text style={[s.line, { color: colores.textoSecundario }]}>📞 {client.telefono}</Text>
          <Text style={[s.line, { color: colores.textoSecundario }]}>📧 {client.email || "-"}</Text>

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
    justifyContent: "center",
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontWeight: "800",
    marginBottom: 10,
  },
  line: {
    marginTop: 6,
  },
  row: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
