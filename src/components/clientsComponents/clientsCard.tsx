import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
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
  const queryClient = useQueryClient();

  // modal formulario (crear)
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ClientForm>(crearClienteVacio());

  const {
    data: clients = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["clientes"],
    queryFn: getClients,
  });

  const createMutation = useMutation({
    mutationFn: addClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clientes"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Cliente, "id">> }) =>
      updateClient(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clientes"] }),
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

  const statusMessage = useMemo(() => {
    if (isLoading) return "Cargando clientes...";
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

      {statusMessage ? (
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
  emptyState: { paddingHorizontal: 16, paddingVertical: 24 },
  emptyText: { fontSize: 14 },
  fab: { position: "absolute", right: 16, bottom: 16 },
});
