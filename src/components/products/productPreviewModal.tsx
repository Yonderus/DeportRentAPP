import React from "react";
import { Modal, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import { Producto } from "../../types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { styles } from "../../styles/components/productPreviewModal.styles";

type Props = {
  visible: boolean;
  producto: Producto | null;
  imageUrl?: string | null;
  onClose: () => void;
  onAddToCart: (producto: Producto) => void;
};

export default function ProductPreviewModal({
  visible,
  producto,
  imageUrl,
  onClose,
  onAddToCart,
}: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  if (!producto) return null;

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
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text variant="titleMedium" style={[styles.title, { color: colores.textoPrincipal }]}>
              {producto.nombre}
            </Text>

            <View style={[styles.imageWrapper, { borderColor: colores.borde, backgroundColor: colores.fondoSecundario }]}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: colores.cardElevacion }]}> 
                  <Text style={[styles.placeholderText, { color: colores.textoTerciario }]}>Sin imagen</Text>
                </View>
              )}
            </View>

            <Text style={[styles.descriptionTitle, { color: colores.textoPrincipal }]}>Descripción</Text>
            <View style={[styles.descriptionBox, { borderColor: colores.borde, backgroundColor: colores.fondoSecundario }]}>
              <Text style={[styles.description, { color: colores.textoSecundario }]}>
                {producto.descripcion?.trim() ? producto.descripcion : "Este producto no tiene descripción"}
              </Text>
            </View>

            <Text style={[styles.priceTitle, { color: colores.textoPrincipal }]}>Precio</Text>
            <View style={[styles.priceBox, { borderColor: colores.borde, backgroundColor: colores.fondoSecundario }]}>
              <Text style={[styles.priceLine, { color: colores.btnPrimario }]}>
                {producto.precioDia} EUR/día
              </Text>
              {producto.precioVenta ? (
                <Text style={[styles.priceLineSecondary, { color: colores.textoSecundario }]}>
                  Venta: {producto.precioVenta} EUR
                </Text>
              ) : null}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={() => onAddToCart(producto)}
              buttonColor={colores.btnPrimario}
              textColor={colores.textoInverso}
              style={styles.actionButton}
            >
              Añadir al carrito
            </Button>
            <Button mode="contained-tonal" onPress={onClose} style={styles.actionButton}>
              Cerrar
            </Button>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
