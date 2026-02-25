import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { getPedidos } from "../../services/pedidosService";
import PedidosItem from "./pedidosItem";
import { styles } from "../../styles/components/pedidosCard.styles";

export default function PedidosCard() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  const {
    data: pedidos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pedidos"],
    queryFn: getPedidos,
  });

  const statusMessage = useMemo(() => {
    if (isLoading) return "";
    if (isError) return (error as Error)?.message ?? "Error al cargar pedidos";
    if (pedidos.length === 0) return "No hay pedidos";
    return null;
  }, [isLoading, isError, error, pedidos.length]);

  return (
    <View style={[styles.page, { backgroundColor: colores.fondoPrincipal }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colores.textoPrincipal }]}>Pedidos</Text>
        <Text style={[styles.subtitle, { color: colores.textoSecundario }]}>
          Listado global de pedidos
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colores.btnPrimario} />
          <Text style={[styles.emptyText, { color: colores.textoSecundario }]}>Cargando pedidos...</Text>
        </View>
      ) : statusMessage ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colores.textoSecundario }]}>{statusMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <PedidosItem pedido={item} onPress={() => {}} />}
        />
      )}
    </View>
  );
}
