import React, { useMemo, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet, FlatList } from "react-native";
import { FAB } from "react-native-paper";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Cliente } from "../../types/types";
import { getClients, addClient, updateClient } from "../../services/clientsService";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../theme";

import ClienteItem from "./clientsItem";
import ClienteDialog, { ClientForm } from "./clientsDialog";

const crearClienteVacio = (): ClientForm => ({
  nombre: "",
  telefono: "",
  email: "",
  nifCif: "",
  notas: "",
  activo: true,
});

export default function ClientsCard() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  // Cliente de cache de React Query.
  // Permite invalidar y actualizar datos sin recargar toda la app.
  const queryClient = useQueryClient();

  // modal formulario (crear)
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ClientForm>(crearClienteVacio());

  // Query principal de clientes.
  // `queryKey` identifica el cache; `queryFn` obtiene datos de Supabase.
  const {
    data: clients = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["clientes"],
    queryFn: getClients,
  });

  // Mutación crear con optimismo.
  // Se inserta temporalmente en UI para que el usuario vea el cambio al instante.
  const createMutation = useMutation({
    mutationFn: addClient,
    onMutate: async (newClient) => {
      await queryClient.cancelQueries({ queryKey: ["clientes"] });
      const previous = queryClient.getQueryData<Cliente[]>(["clientes"]) ?? [];
      const optimistic: Cliente = {
        id: -Date.now(),
        ...newClient,
      } as Cliente;
      queryClient.setQueryData<Cliente[]>(["clientes"], [optimistic, ...previous]);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["clientes"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["clientes"] }),
  });

  // Mutación editar con optimismo.
  // Actualiza el cache local inmediatamente y luego sincroniza con Supabase.
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Cliente, "id">> }) =>
      updateClient(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["clientes"] });
      const previous = queryClient.getQueryData<Cliente[]>(["clientes"]) ?? [];
      queryClient.setQueryData<Cliente[]>(["clientes"],
        previous.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["clientes"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["clientes"] }),
  });

  const abrirCrear = () => {
    setEditingId(null);
    setForm(crearClienteVacio());
    setFormVisible(true);
  };

  const abrirEditar = (client: Cliente) => {
    setEditingId(client.id);
    setForm({
      nombre: client.nombre,
      telefono: client.telefono,
      email: client.email,
      nifCif: client.nifCif,
      notas: client.notas,
      activo: client.activo,
    });
    setFormVisible(true);
  };

  const guardar = async (data: ClientForm) => {
    if (editingId === null) await createMutation.mutateAsync(data);
    else await updateMutation.mutateAsync({ id: editingId, data });

    setFormVisible(false);
  };

  // Mensajes de estado.
  // Se usan para feedback visual (loading, error, vacío).
  const statusMessage = useMemo(() => {
    if (isLoading) return "";
    if (isError) return (error as Error)?.message ?? "Error al cargar clientes";
    if (clients.length === 0) return "No hay clientes aún";
    return null;
  }, [isLoading, isError, error, clients.length]);

  return (
    <View style={[s.page, { backgroundColor: colores.fondoPrincipal }]}>
      <View style={s.header}>
        <Text style={[s.title, { color: colores.textoPrincipal }]}>Clientes</Text>
        <Text style={[s.subtitle, { color: colores.textoSecundario }]}>Pulsa un cliente para ver detalles</Text>
      </View>

      {isLoading ? (
        <View style={s.loadingState}>
          <ActivityIndicator size="large" color={colores.btnPrimario} />
          <Text style={[s.emptyText, { color: colores.textoSecundario }]}>Cargando clientes...</Text>
        </View>
      ) : statusMessage ? (
        <View style={s.emptyState}>
          <Text style={[s.emptyText, { color: colores.textoSecundario }]}>{statusMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={s.list}
          renderItem={({ item }) => (
            <ClienteItem
              client={item}
              onPress={() => router.push(`/(tabs)/clientes/${item.id}`)}
            />
          )}
        />
      )}

      <FAB
        icon="plus"
        style={[s.fab, { backgroundColor: colores.fabColor }]}
        onPress={abrirCrear}
        disabled={createMutation.isPending || updateMutation.isPending}
      />

      <ClienteDialog
        visible={formVisible}
        title={editingId === null ? "Nuevo cliente" : "Editar cliente"}
        value={form}
        onChange={setForm}
        onCancel={() => setFormVisible(false)}
        onSave={guardar}
        saving={createMutation.isPending || updateMutation.isPending}
      />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 15, marginTop: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  loadingState: { paddingHorizontal: 16, paddingVertical: 24, alignItems: "center", gap: 12 },
  emptyState: { paddingHorizontal: 16, paddingVertical: 24 },
  emptyText: { fontSize: 14 },
  fab: { position: "absolute", right: 16, bottom: 16 },
});
