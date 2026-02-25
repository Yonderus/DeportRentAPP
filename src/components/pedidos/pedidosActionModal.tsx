import React from "react";
import { Modal, TouchableOpacity, Alert } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
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
  const paperTheme = useTheme();

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

          <Button
            mode="contained"
            onPress={() => onEdit(pedido)}
            disabled={isFinalizado}
            buttonColor={colores.btnPrimario}
            textColor={colores.textoInverso}
            style={styles.actionButton}
            contentStyle={styles.actionContent}
            labelStyle={styles.actionLabel}
          >
            Editar
          </Button>

          <Button
            mode="contained"
            onPress={confirmarBorrado}
            disabled={isFinalizado}
            buttonColor={paperTheme.colors.error}
            textColor={colores.textoInverso}
            style={[styles.actionButton, styles.deleteButton]}
            contentStyle={styles.actionContent}
            labelStyle={styles.actionLabel}
          >
            Eliminar
          </Button>

          <Button mode="contained-tonal" onPress={onClose} style={styles.closeButton}>
            Cerrar
          </Button>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
