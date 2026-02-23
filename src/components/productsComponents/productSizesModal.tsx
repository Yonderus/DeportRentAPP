import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity, Alert, Pressable, Text } from "react-native";
import { Button } from "react-native-paper";
import { Producto, TallaProducto } from "../../types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../theme";

type Props = {
  visible: boolean;
  producto: Producto | null;
  tallas: TallaProducto[];
  onClose: () => void;
  onAdd: () => void;
  onEdit: (talla: TallaProducto) => void;
  onDelete: (id: number) => void;
};

export default function ProductSizesModal({
  visible,
  producto,
  tallas,
  onClose,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  if (!producto) return null;

  const confirmarBorrado = (tallaId: number) => {
    Alert.alert("Eliminar talla", "¿Seguro que quieres eliminarla?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => onDelete(tallaId),
      },
    ]);
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={[s.backdrop, { backgroundColor: "rgba(0,0,0,0.4)" }]} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[s.card, { backgroundColor: colores.fondoCard }]} activeOpacity={1}>
          <Text style={[s.title, { color: colores.textoPrincipal }]}>
            Tallas de {producto.nombre}
          </Text>

          <Button mode="contained" onPress={onAdd} style={s.addBtn}>
            Nueva talla
          </Button>

          {tallas.length === 0 ? (
            <Text style={[s.empty, { color: colores.textoSecundario }]}>No hay tallas</Text>
          ) : (
            <View style={s.list}>
              {tallas.map((talla) => (
                <Pressable
                  key={talla.id}
                  onPress={() => onEdit(talla)}
                  style={({ pressed }) => [
                    s.row,
                    { borderColor: colores.borde },
                    pressed && s.pressed,
                  ]}
                >
                  <View style={s.rowInfo}>
                    <Text style={[s.code, { color: colores.textoPrincipal }]}>{talla.codigoTalla}</Text>
                    {talla.descripcion ? (
                      <Text style={[s.desc, { color: colores.textoSecundario }]}>{talla.descripcion}</Text>
                    ) : null}
                  </View>
                  <Pressable onPress={() => confirmarBorrado(talla.id)}>
                    <Text style={[s.delete, { color: colores.enlaces }]}>Eliminar</Text>
                  </Pressable>
                </Pressable>
              ))}
            </View>
          )}

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
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  addBtn: {
    marginBottom: 10,
  },
  empty: {
    marginTop: 6,
    fontSize: 13,
  },
  list: {
    gap: 8,
  },
  row: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pressed: { opacity: 0.85 },
  rowInfo: { flex: 1, paddingRight: 8 },
  code: { fontSize: 14, fontWeight: "700" },
  desc: { fontSize: 12, marginTop: 2 },
  delete: { fontSize: 12, fontWeight: "600" },
});
