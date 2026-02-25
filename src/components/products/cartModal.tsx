import React from "react";
import { Modal, Pressable, View, Text, Image, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { useCarritoStore } from "../../stores/useCarritoStore";
import { styles } from "../../styles/components/cartModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function CartModal({ visible, onClose }: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const items = useCarritoStore((s) => s.items);
  const removeProducto = useCarritoStore((s) => s.removeProducto);
  const incrementarCantidad = useCarritoStore((s) => s.incrementarCantidad);
  const decrementarCantidad = useCarritoStore((s) => s.decrementarCantidad);
  const clearCarrito = useCarritoStore((s) => s.clearCarrito);

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const totalImporte = items.reduce(
    (sum, item) => sum + item.cantidad * (item.producto.precioDia ?? 0),
    0
  );

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
        <View style={[styles.card, { backgroundColor: colores.fondoCard }]}> 
          <Text style={[styles.title, { color: colores.textoPrincipal }]}>Carrito</Text>

          {items.length === 0 ? (
            <Text style={[styles.empty, { color: colores.textoSecundario }]}>No hay productos en el carrito</Text>
          ) : (
            <>
              <ScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                nestedScrollEnabled
                showsVerticalScrollIndicator
              >
                {items.map((item) => (
                  <View
                    key={item.producto.id}
                    style={[styles.row, { borderColor: colores.borde, backgroundColor: colores.fondoSecundario }]}
                  >
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
                    ) : (
                      <View style={[styles.thumb, { backgroundColor: colores.cardElevacion, alignItems: "center", justifyContent: "center" }]}> 
                        <Text style={[styles.thumbPlaceholder, { color: colores.textoTerciario }]}>IMG</Text>
                      </View>
                    )}

                    <View style={styles.info}>
                      <Text style={[styles.name, { color: colores.textoPrincipal }]}>{item.producto.nombre}</Text>
                      <Text style={[styles.meta, { color: colores.textoSecundario }]}>Precio: {item.producto.precioDia} EUR/día</Text>
                      <Text style={[styles.meta, { color: colores.textoSecundario }]}>Cantidad: {item.cantidad}</Text>
                    </View>

                    <View style={styles.actionsCol}>
                      <Button mode="text" compact onPress={() => decrementarCantidad(item.producto.id)}>
                        -
                      </Button>
                      <Button mode="text" compact onPress={() => incrementarCantidad(item.producto.id)}>
                        +
                      </Button>
                      <Button mode="text" compact onPress={() => removeProducto(item.producto.id)}>
                        Quitar
                      </Button>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={[styles.summary, { borderTopColor: colores.borde }]}> 
                <Text style={[styles.summaryText, { color: colores.textoPrincipal }]}>Items: {totalItems}</Text>
                <Text style={[styles.summaryText, { color: colores.btnPrimario }]}>Total/día: {totalImporte.toFixed(2)} EUR</Text>
              </View>

              <Button mode="outlined" onPress={clearCarrito} style={styles.clearBtn}>
                Vaciar carrito
              </Button>
            </>
          )}

          <Button mode="contained-tonal" onPress={onClose} style={styles.closeBtn}>
            Cerrar
          </Button>
        </View>
      </View>
    </Modal>
  );
}
