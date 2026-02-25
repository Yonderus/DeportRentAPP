import React, { useState } from "react";
import {
  View,
  Text,
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
import ClienteDialog, { ClientForm } from "../../../components/clients/clientsDialog";
import { useTemaStore } from "../preferencias";
import { obtenerColores } from "../../../styles/theme";
import { styles } from "../../../styles/app/clienteDetalle.styles";

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
  // Cliente de cache de React Query
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

  // Query detalle de cliente
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

  // Mutación editar con optimismo (detalle + listado)
  const updateMutation = useMutation({
    mutationFn: (data: ClientForm) => updateClient(clientId, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["clientes", clientId] });
      await queryClient.cancelQueries({ queryKey: ["clientes"] });

      const previousDetail = queryClient.getQueryData<Cliente | null>([
        "clientes",
        clientId,
      ]);
      const previousList = queryClient.getQueryData<Cliente[]>(["clientes"]);

      if (previousDetail) {
        queryClient.setQueryData<Cliente | null>(["clientes", clientId], {
          ...previousDetail,
          ...data,
        });
      }

      if (previousList) {
        queryClient.setQueryData<Cliente[]>(
          ["clientes"],
          previousList.map((c) => (c.id === clientId ? { ...c, ...data } : c))
        );
      }

      return { previousDetail, previousList };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(["clientes", clientId], context.previousDetail);
      }
      if (context?.previousList) {
        queryClient.setQueryData(["clientes"], context.previousList);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["clientes", clientId] });
    },
  });

  // Mutación eliminar con optimismo
  const deleteMutation = useMutation({
    mutationFn: () => deleteClient(clientId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["clientes"] });
      const previousList = queryClient.getQueryData<Cliente[]>(["clientes"]);
      if (previousList) {
        queryClient.setQueryData<Cliente[]>(
          ["clientes"],
          previousList.filter((c) => c.id !== clientId)
        );
      }
      return { previousList };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(["clientes"], context.previousList);
      }
    },
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
      <View style={[styles.center, { backgroundColor: colores.fondoPrincipal }]}>
        <ActivityIndicator size="large" />
        <Text style={[styles.loadingText, { color: colores.textoSecundario }]}>Cargando cliente...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.center, { backgroundColor: colores.fondoPrincipal }]}>
        <Text style={[styles.error, { color: colores.enlaces }]}>
          {(error as Error)?.message ?? "Error al cargar cliente"}
        </Text>
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={[styles.center, { backgroundColor: colores.fondoPrincipal }]}>
        <Text style={[styles.error, { color: colores.enlaces }]}>Cliente no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colores.fondoPrincipal }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Botón de atrás */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Feather name="chevron-left" size={28} color={colores.textoPrincipal} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Feather name="user" size={32} color={colores.btnPrimario} />
        <Text style={[styles.name, { color: colores.textoPrincipal }]}>
          {cliente.nombre}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colores.fondoCard }]}>
        <View style={styles.row}>
          <Feather name="mail" size={18} color={colores.iconoColorGris} />
          <Text style={[styles.value, { color: colores.textoSecundario }]}>{cliente.email || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Feather name="phone" size={18} color={colores.iconoColorGris} />
          <Text style={[styles.value, { color: colores.textoSecundario }]}>{cliente.telefono || "-"}</Text>
        </View>

        {cliente.nifCif && (
          <View style={styles.row}>
            <Feather name="layers" size={18} color={colores.iconoColorGris} />
            <Text style={[styles.value, { color: colores.textoSecundario }]}>{cliente.nifCif}</Text>
          </View>
        )}

        {cliente.notas && (
          <View style={styles.row}>
            <Feather name="file-text" size={18} color={colores.iconoColorGris} />
            <Text style={[styles.value, { color: colores.textoSecundario }]}>{cliente.notas}</Text>
          </View>
        )}
      </View>

      <View style={styles.sectionTitleContainer}>
        <Text style={[styles.sectionTitle, { color: colores.textoPrincipal }]}>Estado</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colores.fondoCard }]}>
        <Text style={[styles.value, { color: colores.textoSecundario }]}>
          {cliente.activo ? "✓ Cliente activo" : "✗ Cliente inactivo"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: colores.btnPrimario }]}
        onPress={() => {
          setForm(toForm(cliente));
          setEditarVisible(true);
        }}
      >
        <Text style={styles.editText}>Editar Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
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
        <Text style={styles.deleteText}>Eliminar Cliente</Text>
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
