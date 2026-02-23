import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Producto } from "../../types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../theme";

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
        s.row,
        { backgroundColor: colores.fondoCard, borderColor: colores.borde },
        pressed && onPress ? s.pressed : null,
      ]}
    >
      <View style={s.info}>
        <Text style={[s.name, { color: colores.textoPrincipal }]}>{producto.nombre}</Text>
        {producto.descripcion ? (
          <Text style={[s.secondary, { color: colores.textoSecundario }]} numberOfLines={2}>
            {producto.descripcion}
          </Text>
        ) : null}
      </View>

      <View style={s.priceBox}>
        <Text style={[s.price, { color: colores.btnPrimario }]}>{producto.precioDia} EUR/dia</Text>
        {producto.precioVenta ? (
          <Text style={[s.secondary, { color: colores.textoTerciario }]}>Venta {producto.precioVenta} EUR</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  pressed: { opacity: 0.85 },
  info: { flex: 1, paddingRight: 8 },
  name: { fontSize: 15, fontWeight: "700" },
  secondary: { fontSize: 12, marginTop: 3 },
  priceBox: { alignItems: "flex-end" },
  price: { fontSize: 13, fontWeight: "700" },
});
