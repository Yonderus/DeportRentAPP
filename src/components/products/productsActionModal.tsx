import React from "react";
import { Modal, View, Alert, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { Producto } from "../../types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { styles } from "../../styles/components/productsActionModal.styles";

type Props = {
  visible: boolean;
  producto: Producto | null;
  onClose: () => void;
  onEdit: (producto: Producto) => void;
  onSizes: (producto: Producto) => void;
  onDelete: (id: number) => void;
};

export default function ProductsActionModal({
  visible,
  producto,
  onClose,
  onEdit,
  onSizes,
  onDelete,
}: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  if (!producto) return null;

  const confirmarBorrado = () => {
    Alert.alert("Eliminar producto", "¿Seguro que quieres eliminarlo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          onDelete(producto.id);
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.4)" }]} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[styles.card, { backgroundColor: colores.fondoCard }]} activeOpacity={1}>
          <Text variant="titleMedium" style={[styles.title, { color: colores.textoPrincipal }]}>
            {producto.nombre}
          </Text>

          <Text style={[styles.line, { color: colores.textoSecundario }]}>Precio dia: {producto.precioDia} EUR</Text>
          {producto.precioVenta ? (
            <Text style={[styles.line, { color: colores.textoSecundario }]}>Precio venta: {producto.precioVenta} EUR</Text>
          ) : null}

          <View style={styles.row}>
            <Button mode="text" onPress={confirmarBorrado}>
              Eliminar
            </Button>
            <Button mode="contained" onPress={() => onEdit(producto)}>
              Editar
            </Button>
          </View>

          <Button mode="contained-tonal" onPress={() => onSizes(producto)} style={{ marginTop: 10 }}>
            Tallas
          </Button>

          <Button mode="contained-tonal" onPress={onClose} style={{ marginTop: 12 }}>
            Cerrar
          </Button>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

