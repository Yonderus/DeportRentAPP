import React from "react";
import { Pressable, View, Text } from "react-native";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { PedidoListItem } from "../../services/pedidosService";
import { styles } from "../../styles/components/pedidosItem.styles";

type Props = {
  pedido: PedidoListItem;
  onPress: (pedido: PedidoListItem) => void;
};

export default function PedidosItem({ pedido, onPress }: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  const clienteLabel = pedido.clienteNombre
    ? pedido.clienteNombre
    : `Cliente #${pedido.clienteId}`;

  return (
    <Pressable
      onPress={() => onPress(pedido)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colores.fondoCard },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.codigo, { color: colores.textoPrincipal }]}>{pedido.codigo}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: colores.cardElevacion }]}>
          <Text style={[styles.estadoText, { color: colores.textoPrincipal }]}>{pedido.estado}</Text>
        </View>
      </View>
      <Text style={[styles.cliente, { color: colores.textoSecundario }]}>{clienteLabel}</Text>
      <Text style={[styles.fechas, { color: colores.textoTerciario }]}>
        {pedido.fechaInicio} → {pedido.fechaFin}
      </Text>
      {pedido.tipo ? (
        <Text style={[styles.tipo, { color: colores.textoTerciario }]}>Tipo: {pedido.tipo}</Text>
      ) : null}
    </Pressable>
  );
}
