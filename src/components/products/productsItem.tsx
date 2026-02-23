import React from "react";
import { Pressable, View, Text } from "react-native";
import { Producto } from "../../types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { styles } from "../../styles/components/productsItem.styles";

type Props = {
  producto: Producto;
  onPress?: (producto: Producto) => void;
};

export default function ProductsItem({ producto, onPress }: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  return (
    <Pressable
      onPress={onPress ? () => onPress(producto) : undefined}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colores.fondoCard, borderColor: colores.borde },
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.name, { color: colores.textoPrincipal }]}>{producto.nombre}</Text>
        {producto.descripcion ? (
          <Text style={[styles.secondary, { color: colores.textoSecundario }]} numberOfLines={2}>
            {producto.descripcion}
          </Text>
        ) : null}
      </View>

      <View style={styles.priceBox}>
        <Text style={[styles.price, { color: colores.btnPrimario }]}>{producto.precioDia} EUR/dia</Text>
        {producto.precioVenta ? (
          <Text style={[styles.secondary, { color: colores.textoTerciario }]}>Venta {producto.precioVenta} EUR</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
