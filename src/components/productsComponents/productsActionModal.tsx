import React from "react";
import { Modal, View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { Producto } from "../../types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../theme";

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
      <TouchableOpacity style={[s.backdrop, { backgroundColor: "rgba(0,0,0,0.4)" }]} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[s.card, { backgroundColor: colores.fondoCard }]} activeOpacity={1}>
          <Text variant="titleMedium" style={[s.title, { color: colores.textoPrincipal }]}>
            {producto.nombre}
          </Text>

          <Text style={[s.line, { color: colores.textoSecundario }]}>Precio dia: {producto.precioDia} EUR</Text>
          {producto.precioVenta ? (
            <Text style={[s.line, { color: colores.textoSecundario }]}>Precio venta: {producto.precioVenta} EUR</Text>
          ) : null}

          <View style={s.row}>
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

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 14,
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
