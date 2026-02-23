import React from "react";
import { Modal, View, TouchableOpacity, Alert } from "react-native";
import { Button, Text } from "react-native-paper";
import { PedidoListItem } from "../../services/pedidosService";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { styles } from "../../styles/components/pedidosActionModal.styles";

type Props = {
  visible: boolean;
  pedido: PedidoListItem | null;
  onClose: () => void;
  onEdit: (pedido: PedidoListItem) => void;
  onDelete: (id: number) => void;
};

export default function PedidosActionModal({
  visible,
  pedido,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  if (!pedido) return null;

  const isFinalizado = pedido.estado === "FINALIZADO";

  const confirmarBorrado = () => {
    Alert.alert("Eliminar pedido", "¿Seguro que quieres eliminarlo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          onDelete(pedido.id);
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity
        style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colores.fondoCard }]}
          activeOpacity={1}
        >
          <Text variant="titleMedium" style={[styles.title, { color: colores.textoPrincipal }]}> 
            {pedido.codigo}
          </Text>

          <Text style={[styles.line, { color: colores.textoSecundario }]}>
            Estado: {pedido.estado}
          </Text>

          {isFinalizado ? (
            <Text style={[styles.helper, { color: colores.textoTerciario }]}> 
              Pedido finalizado: solo puedes cambiar el estado.
            </Text>
          ) : null}

          <View style={styles.row}>
            <Button mode="contained" onPress={() => onEdit(pedido)} disabled={isFinalizado}>
              Editar
            </Button>
          </View>

          <Button
            mode="outlined"
            onPress={confirmarBorrado}
            disabled={isFinalizado}
            style={styles.deleteButton}
          >
            Eliminar
          </Button>

          <View style={styles.buttonSpacer} />

          <Button mode="contained-tonal" onPress={onClose} style={styles.closeButton}>
            Cerrar
          </Button>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
