import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View, Text, Alert } from "react-native";
import { FAB } from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTemaStore } from "./preferencias";
import { obtenerColores } from "../../styles/theme";
import { getClients } from "../../services/clientsService";
import {
  addPedido,
  deletePedido,
  getPedidos,
  updatePedido,
  PedidoListItem,
} from "../../services/pedidosService";
import { Cliente, EstadoPedido, Pedido } from "../../types/types";
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import PedidosItem from "../../components/pedidos/pedidosItem";
import PedidosDialog, { PedidoForm } from "../../components/pedidos/pedidosDialog";
import PedidosActionModal from "../../components/pedidos/pedidosActionModal";
import { styles } from "../../styles/app/pedidos.styles";

const DEFAULT_ESTADO: EstadoPedido = "PENDIENTE_REVISION";

const buildForm = (pedido?: PedidoListItem): PedidoForm => ({
  codigo: pedido?.codigo ?? "",
  tipo: pedido?.tipo ?? "",
  clienteId: pedido?.clienteId ?? null,
  fechaInicio: pedido?.fechaInicio ?? "",
  fechaFin: pedido?.fechaFin ?? "",
  estado: pedido?.estado ?? DEFAULT_ESTADO,
  notas: pedido?.notas ?? "",
});

export default function PedidosScreen() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const { id: userId, rol } = useUsuarioStore();
  const isAdmin = rol === "ADMIN";
  const queryClient = useQueryClient();

  const [formVisible, setFormVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusOnly, setStatusOnly] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoListItem | null>(null);
  const [form, setForm] = useState<PedidoForm>(buildForm());

  const {
    data: pedidos = [],
    isLoading: isLoadingPedidos,
    isError: isErrorPedidos,
    error: errorPedidos,
  } = useQuery({
    queryKey: ["pedidos"],
    queryFn: getPedidos,
  });

  const {
    data: clientes = [],
    isLoading: isLoadingClientes,
    isError: isErrorClientes,
    error: errorClientes,
  } = useQuery({
    queryKey: ["clientes"],
    queryFn: getClients,
  });

  const clientesActivos = useMemo(
    () => clientes.filter((cliente) => cliente.activo),
    [clientes]
  );

  const clientesPorId = useMemo(() => {
    const map = new Map<number, Cliente>();
    clientes.forEach((cliente) => map.set(cliente.id, cliente));
    return map;
  }, [clientes]);

  const pedidosConCliente = useMemo(
    () =>
      pedidos.map((pedido) => ({
        ...pedido,
        clienteNombre: clientesPorId.get(pedido.clienteId)?.nombre,
      })),
    [pedidos, clientesPorId]
  );

  const isLoading = isLoadingPedidos;
  const isError = isErrorPedidos;
  const errorMessage = (errorPedidos as Error | undefined)?.message ?? "Error al cargar pedidos";

  const createMutation = useMutation({
    mutationFn: addPedido,
    onMutate: async (nuevo) => {
      await queryClient.cancelQueries({ queryKey: ["pedidos"] });
      const previous = queryClient.getQueryData<PedidoListItem[]>(["pedidos"]) ?? [];
      const optimistic: PedidoListItem = {
        id: -Date.now(),
        codigo: nuevo.codigo,
        tipo: nuevo.tipo,
        clienteId: nuevo.clienteId,
        fechaInicio: nuevo.fechaInicio,
        fechaFin: nuevo.fechaFin,
        estado: nuevo.estado,
        clienteNombre: clientesPorId.get(nuevo.clienteId)?.nombre,
      };
      queryClient.setQueryData<PedidoListItem[]>(["pedidos"], [optimistic, ...previous]);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["pedidos"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["pedidos"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Pedido, "id">> }) =>
      updatePedido(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["pedidos"] });
      const previous = queryClient.getQueryData<PedidoListItem[]>(["pedidos"]) ?? [];
      queryClient.setQueryData<PedidoListItem[]>(
        ["pedidos"],
        previous.map((p) =>
          p.id === id
            ? {
                ...p,
                ...data,
                clienteNombre: data.clienteId
                  ? clientesPorId.get(data.clienteId)?.nombre
                  : p.clienteNombre,
              }
            : p
        )
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["pedidos"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["pedidos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePedido,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["pedidos"] });
      const previous = queryClient.getQueryData<PedidoListItem[]>(["pedidos"]) ?? [];
      queryClient.setQueryData<PedidoListItem[]>(
        ["pedidos"],
        previous.filter((p) => p.id !== id)
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["pedidos"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["pedidos"] }),
  });

  const abrirCrear = () => {
    setEditingId(null);
    setStatusOnly(false);
    setForm(buildForm());
    setFormVisible(true);
  };

  const abrirEditar = (pedido: PedidoListItem) => {
    setEditingId(pedido.id);
    setStatusOnly(false);
    setForm(buildForm(pedido));
    setFormVisible(true);
  };

  const abrirCambiarEstado = (pedido: PedidoListItem) => {
    setEditingId(pedido.id);
    setStatusOnly(true);
    setForm(buildForm(pedido));
    setFormVisible(true);
  };

  const guardar = async (data: PedidoForm) => {
    if (!data.clienteId) return;

    const payloadBase: Omit<Pedido, "id"> = {
      codigo: data.codigo.trim(),
      tipo: data.tipo.trim() ? data.tipo.trim() : undefined,
      clienteId: data.clienteId,
      fechaInicio: data.fechaInicio.trim(),
      fechaFin: data.fechaFin.trim(),
      estado: data.estado,
      notas: data.notas.trim() ? data.notas.trim() : undefined,
    };

    if (editingId === null) {
      await createMutation.mutateAsync({
        ...payloadBase,
        creadoPor: userId ?? undefined,
      });
    } else if (statusOnly) {
      await updateMutation.mutateAsync({ id: editingId, data: { estado: data.estado } });
    } else {
      await updateMutation.mutateAsync({ id: editingId, data: payloadBase });
    }

    setFormVisible(false);
  };

  const cancelarPedidoNormal = (pedido: PedidoListItem) => {
    if (pedido.estado !== "PENDIENTE_REVISION") return;

    Alert.alert(
      "Cancelar pedido",
      `¿Seguro que quieres cancelar el pedido ${pedido.codigo}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () => deleteMutation.mutate(pedido.id),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: PedidoListItem }) => (
    <PedidosItem
      pedido={item}
      onPress={
        isAdmin
          ? (pedido) => {
              setSelectedPedido(pedido);
              setActionsVisible(true);
            }
          : item.estado === "PENDIENTE_REVISION"
            ? cancelarPedidoNormal
            : undefined
      }
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colores.fondoPrincipal }]}>
      <Text style={[styles.title, { color: colores.textoPrincipal }]}>Pedidos</Text>
      <Text style={[styles.subtitle, { color: colores.textoSecundario }]}>Listado global de pedidos</Text>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colores.btnPrimario} />
          <Text style={[styles.stateText, { color: colores.textoSecundario }]}>Cargando pedidos...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerState}>
          <Text style={[styles.stateText, { color: colores.enlaces }]}>{errorMessage}</Text>
        </View>
      ) : pedidosConCliente.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={[styles.stateText, { color: colores.textoSecundario }]}>No hay pedidos</Text>
        </View>
      ) : (
        <FlatList
          data={pedidosConCliente}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {isAdmin ? (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: colores.fabColor }]}
          onPress={abrirCrear}
          disabled={createMutation.isPending || updateMutation.isPending}
        />
      ) : null}

      <PedidosDialog
        visible={formVisible}
        title={statusOnly ? "Cambiar estado" : editingId === null ? "Nuevo pedido" : "Editar pedido"}
        value={form}
        onChange={setForm}
        onCancel={() => setFormVisible(false)}
        onSave={guardar}
        saving={createMutation.isPending || updateMutation.isPending}
        clientes={clientesActivos}
        allowEdit={!statusOnly}
        allowStatusChange
      />

      <PedidosActionModal
        visible={actionsVisible}
        pedido={selectedPedido}
        onClose={() => setActionsVisible(false)}
        onEdit={(pedido) => {
          setActionsVisible(false);
          abrirCambiarEstado(pedido);
        }}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </View>
  );
}
