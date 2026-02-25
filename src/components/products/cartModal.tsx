import React from "react";
import { Modal, Pressable, View, Text, Image, ScrollView, Alert } from "react-native";
import { Button } from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { useCarritoStore } from "../../stores/useCarritoStore";
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import { getClients } from "../../services/clientsService";
import { addPedido } from "../../services/pedidosService";
import { Pedido } from "../../types/types";
import { styles } from "../../styles/components/cartModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function CartModal({ visible, onClose }: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const userId = useUsuarioStore((s) => s.id);
  const queryClient = useQueryClient();
  const items = useCarritoStore((s) => s.items);
  const removeProducto = useCarritoStore((s) => s.removeProducto);
  const incrementarCantidad = useCarritoStore((s) => s.incrementarCantidad);
  const decrementarCantidad = useCarritoStore((s) => s.decrementarCantidad);
  const clearCarrito = useCarritoStore((s) => s.clearCarrito);

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: getClients,
  });

  const confirmarMutation = useMutation({
    mutationFn: addPedido,
  });

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const totalImporte = items.reduce(
    (sum, item) =>
      sum + item.cantidad * (item.precioUnitario ?? item.producto.precioDia ?? 0),
    0
  );

  const confirmarCompra = () => {
    if (items.length === 0) return;

    const clienteActivo = clientes.find((cliente) => cliente.activo);
    if (!clienteActivo) {
      Alert.alert("No se puede confirmar", "No hay clientes activos para asociar el pedido");
      return;
    }

    const modalidadGroups = {
      ALQUILER: items.filter((item) => item.modalidad === "ALQUILER"),
      COMPRA: items.filter((item) => item.modalidad === "COMPRA"),
    };

    const pedidosAPersistir = [
      { tipo: "ALQUILER" as const, lineas: modalidadGroups.ALQUILER },
      { tipo: "COMPRA" as const, lineas: modalidadGroups.COMPRA },
    ].filter((group) => group.lineas.length > 0);

    const hoy = new Date();
    const fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(
      hoy.getDate()
    ).padStart(2, "0")}`;

    Alert.alert(
      "Confirmar compra",
      pedidosAPersistir.length > 1
        ? "Se crearán 2 pedidos (uno de alquiler y otro de compra). ¿Quieres continuar?"
        : "Se creará un pedido con los productos del carrito. ¿Quieres continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              for (const group of pedidosAPersistir) {
                const resumen = group.lineas
                  .map(
                    (item) =>
                      `${item.producto.nombre} [${item.talla?.codigoTalla ?? "Sin talla"}] x${item.cantidad} (${item.modalidad})`
                  )
                  .join(" | ");

                const subtotal = group.lineas.reduce(
                  (sum, item) =>
                    sum + item.cantidad * (item.precioUnitario ?? item.producto.precioDia ?? 0),
                  0
                );

                const payload: Omit<Pedido, "id"> = {
                  codigo: `WEB-${Date.now().toString().slice(-8)}-${group.tipo[0]}`,
                  tipo: group.tipo,
                  clienteId: clienteActivo.id,
                  fechaInicio: fecha,
                  fechaFin: fecha,
                  estado: "PENDIENTE_REVISION",
                  creadoPor: userId ?? undefined,
                  notas: `Pedido desde carrito. Total ${subtotal.toFixed(2)} EUR. ${resumen}`,
                };

                await confirmarMutation.mutateAsync(payload);
              }

              await queryClient.invalidateQueries({ queryKey: ["pedidos"] });
              clearCarrito();
              onClose();
              Alert.alert(
                "Pedido confirmado",
                pedidosAPersistir.length > 1
                  ? "Se han creado los pedidos de alquiler y compra"
                  : "Tu pedido ya aparece en la sección de pedidos"
              );
            } catch (error: any) {
              Alert.alert("No se pudo confirmar", error?.message ?? "Error al confirmar el pedido");
            }
          },
        },
      ]
    );
  };

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
                {items.map((item) => {
                  const tallaId = item.talla?.id ?? -1;
                  const tallaCodigo = item.talla?.codigoTalla ?? "Sin talla";

                  return (
                  <View
                    key={`${item.producto.id}-${tallaId}-${item.modalidad ?? "ALQUILER"}`}
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
                      <Text style={[styles.meta, { color: colores.textoSecundario }]}>Talla: {tallaCodigo}</Text>
                      <Text style={[styles.meta, { color: colores.textoSecundario }]}>Tipo: {item.modalidad === "COMPRA" ? "Compra" : "Alquiler"}</Text>
                      <Text style={[styles.meta, { color: colores.textoSecundario }]}>Precio: {item.precioUnitario} EUR</Text>
                      <Text style={[styles.meta, { color: colores.textoSecundario }]}>Cantidad: {item.cantidad}</Text>
                    </View>

                    <View style={styles.actionsCol}>
                      <Button mode="text" compact onPress={() => decrementarCantidad(item.producto.id, tallaId, item.modalidad ?? "ALQUILER")}>
                        -
                      </Button>
                      <Button mode="text" compact onPress={() => incrementarCantidad(item.producto.id, tallaId, item.modalidad ?? "ALQUILER")}>
                        +
                      </Button>
                      <Button mode="text" compact onPress={() => removeProducto(item.producto.id, tallaId, item.modalidad ?? "ALQUILER")}>
                        Quitar
                      </Button>
                    </View>
                  </View>
                );})}
              </ScrollView>

              <View style={[styles.summary, { borderTopColor: colores.borde }]}> 
                <Text style={[styles.summaryText, { color: colores.textoPrincipal }]}>Items: {totalItems}</Text>
                <Text style={[styles.summaryText, { color: colores.btnPrimario }]}>Total: {totalImporte.toFixed(2)} EUR</Text>
              </View>

              <Button mode="outlined" onPress={clearCarrito} style={styles.clearBtn}>
                Vaciar carrito
              </Button>

              <Button
                mode="contained"
                onPress={confirmarCompra}
                loading={confirmarMutation.isPending}
                disabled={confirmarMutation.isPending || items.length === 0}
                buttonColor={colores.btnPrimario}
                textColor={colores.textoInverso}
                style={styles.confirmBtn}
              >
                Confirmar compra
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
