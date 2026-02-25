import React from "react";
import { Modal, View, Alert, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { Cliente } from "../../types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { styles } from "../../styles/components/clientsActionModal.styles";

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
      <TouchableOpacity style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[styles.card, { backgroundColor: colores.fondoCard }]} activeOpacity={1}>
          <Text variant="titleMedium" style={[styles.title, { color: colores.textoPrincipal }]}>
            {client.nombre} {client.email}
          </Text>

          <Text style={[styles.line, { color: colores.textoSecundario }]}>📞 {client.telefono}</Text>
          <Text style={[styles.line, { color: colores.textoSecundario }]}>📧 {client.email || "-"}</Text>

          <View style={styles.row}>
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
