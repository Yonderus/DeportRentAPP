import React from "react";
import { Modal, View, TouchableOpacity, Alert, Pressable, Text } from "react-native";
import { Button } from "react-native-paper";
import { Producto, TallaProducto } from "../../types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { styles } from "../../styles/components/productSizesModal.styles";

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
      <TouchableOpacity style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.4)" }]} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[styles.card, { backgroundColor: colores.fondoCard }]} activeOpacity={1}>
          <Text style={[styles.title, { color: colores.textoPrincipal }]}>
            Tallas de {producto.nombre}
          </Text>

          <Button mode="contained" onPress={onAdd} style={styles.addBtn}>
            Nueva talla
          </Button>

          {tallas.length === 0 ? (
            <Text style={[styles.empty, { color: colores.textoSecundario }]}>No hay tallas</Text>
          ) : (
            <View style={styles.list}>
              {tallas.map((talla) => (
                <Pressable
                  key={talla.id}
                  onPress={() => onEdit(talla)}
                  style={({ pressed }) => [
                    styles.row,
                    { borderColor: colores.borde },
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.rowInfo}>
                    <Text style={[styles.code, { color: colores.textoPrincipal }]}>{talla.codigoTalla}</Text>
                    {talla.descripcion ? (
                      <Text style={[styles.desc, { color: colores.textoSecundario }]}>{talla.descripcion}</Text>
                    ) : null}
                  </View>
                  <Pressable onPress={() => confirmarBorrado(talla.id)}>
                    <Text style={[styles.delete, { color: colores.enlaces }]}>Eliminar</Text>
                  </Pressable>
                </Pressable>
              ))}
            </View>
          )}

          <Button mode="contained-tonal" onPress={onClose} style={styles.closeBtn}>
            Cerrar
          </Button>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
