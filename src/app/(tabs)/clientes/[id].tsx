import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Cliente } from "../../../types/types";
import { getClientById, updateClient, deleteClient } from "../../../services/clientsService";
import ClienteDialog, { ClientForm } from "../../../components/clientsComponents/clientsDialog";
import { useTemaStore } from "../preferencias";
import { obtenerColores } from "../../../theme";

const toForm = (c: Cliente): ClientForm => ({
  nombre: c.nombre,
  nifCif: c.nifCif,
  email: c.email,
  telefono: c.telefono,
  notas: c.notas,
  activo: c.activo,
});

export default function ClienteDetallado() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Number(id);
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const queryClient = useQueryClient();

  const [editarVisible, setEditarVisible] = useState(false);

  const [form, setForm] = useState<ClientForm>({
    nombre: "",
    nifCif: "",
    email: "",
    telefono: "",
    notas: "",
    activo: true,
  });

  const {
    data: cliente,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["clientes", clientId],
    queryFn: () => getClientById(clientId),
    enabled: Number.isFinite(clientId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ClientForm) => updateClient(clientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["clientes", clientId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      router.back();
    },
  });

  const guardar = async (data: ClientForm) => {
    await updateMutation.mutateAsync(data);
    setEditarVisible(false);
  };


  if (isLoading) {
    return (
      <View style={[s.center, { backgroundColor: colores.fondoPrincipal }]}>
        <ActivityIndicator size="large" />
        <Text style={[s.loadingText, { color: colores.textoSecundario }]}>Cargando cliente...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[s.center, { backgroundColor: colores.fondoPrincipal }]}>
        <Text style={[s.error, { color: colores.enlaces }]}>
          {(error as Error)?.message ?? "Error al cargar cliente"}
        </Text>
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={[s.center, { backgroundColor: colores.fondoPrincipal }]}>
        <Text style={[s.error, { color: colores.enlaces }]}>Cliente no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[s.container, { backgroundColor: colores.fondoPrincipal }]}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* Botón de atrás */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={{ padding: 16, paddingBottom: 8 }}
      >
        <Feather name="chevron-left" size={28} color={colores.textoPrincipal} />
      </TouchableOpacity>

      <View style={s.header}>
        <Feather name="user" size={32} color={colores.btnPrimario} />
        <Text style={[s.name, { color: colores.textoPrincipal }]}>
          {cliente.nombre}
        </Text>
      </View>

      <View style={[s.card, { backgroundColor: colores.fondoCard }]}>
        <View style={s.row}>
          <Feather name="mail" size={18} color={colores.iconoColorGris} />
          <Text style={[s.value, { color: colores.textoSecundario }]}>{cliente.email || "-"}</Text>
        </View>

        <View style={s.row}>
          <Feather name="phone" size={18} color={colores.iconoColorGris} />
          <Text style={[s.value, { color: colores.textoSecundario }]}>{cliente.telefono || "-"}</Text>
        </View>

        {cliente.nifCif && (
          <View style={s.row}>
            <Feather name="layers" size={18} color={colores.iconoColorGris} />
            <Text style={[s.value, { color: colores.textoSecundario }]}>{cliente.nifCif}</Text>
          </View>
        )}

        {cliente.notas && (
          <View style={s.row}>
            <Feather name="file-text" size={18} color={colores.iconoColorGris} />
            <Text style={[s.value, { color: colores.textoSecundario }]}>{cliente.notas}</Text>
          </View>
        )}
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={[s.sectionTitle, { color: colores.textoPrincipal }]}>Estado</Text>
      </View>

      <View style={[s.card, { backgroundColor: colores.fondoCard }]}>
        <Text style={[s.value, { color: colores.textoSecundario }]}>
          {cliente.activo ? "✓ Cliente activo" : "✗ Cliente inactivo"}
        </Text>
      </View>

      <TouchableOpacity
        style={[s.editButton, { backgroundColor: colores.btnPrimario }]}
        onPress={() => {
          setForm(toForm(cliente));
          setEditarVisible(true);
        }}
      >
        <Text style={s.editText}>Editar Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.deleteButton, { backgroundColor: "#ef4444" }]}
        onPress={() => {
          Alert.alert("Eliminar Cliente", "Seguro que quieres eliminarlo", [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Eliminar",
              style: "destructive",
              onPress: () => {
                deleteMutation.mutate();
              },
            },
          ]);
        }}
      >
        <Text style={s.deleteText}>Eliminar Cliente</Text>
      </TouchableOpacity>

      <ClienteDialog
        visible={editarVisible}
        title="Editar cliente"
        value={form}
        onChange={setForm} 
        onCancel={() => setEditarVisible(false)}
        onSave={guardar}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingTop: 0 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12 },
  error: { fontSize: 16 },

  header: { alignItems: "center", marginBottom: 24, gap: 8, paddingHorizontal: 16 },
  name: { fontSize: 22, fontWeight: "700" },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 16,
    elevation: 3,
  },

  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  value: { fontSize: 15 },

  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  pedido: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  pedidoText: { fontSize: 14 },
  empty: { fontSize: 14, textAlign: "center" },

  editButton: {
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 16,
  },
  editText: { color: "#ffffff", fontWeight: "800", fontSize: 16 },

  deleteButton: {
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 16,
  },
  deleteText: { color: "#ffffff", fontWeight: "800", fontSize: 16 },
});
