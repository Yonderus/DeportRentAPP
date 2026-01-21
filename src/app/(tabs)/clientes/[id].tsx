import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Client } from "../../../data/clients";
import { getClientById, updateClient, deleteClient } from "../../../services/clientsService";
import ClienteDialog, { ClientForm } from "../../../components/clientsComponents/clientsDialog";

const toForm = (c: Client): ClientForm => ({
  name: c.name,
  surname: c.surname,
  email: c.email,
  phone: c.phone,
  pedidos: c.pedidos ?? [],
});

export default function ClienteDetallado() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Number(id);

  const [cliente, setCliente] = useState<Client | null>(null);
  const [cargando, setCargando] = useState(true);
  const [editarVisible, setEditarVisible] = useState(false);

  // ✅ estado del formulario (para que los inputs puedan cambiar)
  const [form, setForm] = useState<ClientForm>({
    name: "",
    surname: "",
    email: "",
    phone: "",
    pedidos: [],
  });

  const cargar = () => {
    setCargando(true);
    const c = getClientById(clientId);
    setCliente(c ?? null);
    if (c) setForm(toForm(c)); // ✅ rellena el form con el cliente actual
    setCargando(false);
  };

  useEffect(() => {
    cargar();
  }, [clientId]);

  const guardar = (data: ClientForm) => {
    updateClient(clientId, data);
    cargar();
    setEditarVisible(false);
  };

  if (cargando) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" />
        <Text style={s.loadingText}>Cargando cliente...</Text>
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={s.center}>
        <Text style={s.error}>Cliente no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Stack.Screen
        options={{
          title: `Cliente ${cliente.id}`,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 12 }}>
              <Feather name="chevron-left" size={25} color="#000000" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={s.header}>
        <Feather name="user" size={32} color="#3b82f6" />
        <Text style={s.name}>
          {cliente.name} {cliente.surname}
        </Text>
      </View>

      <View style={s.card}>
        <View style={s.row}>
          <Feather name="mail" size={18} color="#6B7280" />
          <Text style={s.value}>{cliente.email || "-"}</Text>
        </View>

        <View style={s.row}>
          <Feather name="phone" size={18} color="#6B7280" />
          <Text style={s.value}>{cliente.phone}</Text>
        </View>
      </View>

      <Text style={s.sectionTitle}>Pedidos</Text>

      <View style={s.card}>
        {cliente.pedidos.length === 0 ? (
          <Text style={s.empty}>Este cliente no tiene pedidos</Text>
        ) : (
          cliente.pedidos.map((p, i) => (
            <View key={i} style={s.pedido}>
              <Feather name="shopping-bag" size={16} color="#3b82f6" />
              <Text style={s.pedidoText}>{p}</Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        style={s.editButton}
        onPress={() => {
          setForm(toForm(cliente)); // ✅ asegura que abres con datos actuales
          setEditarVisible(true);
        }}
      >
        <Text style={s.editText}>Editar Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.deleteButton}
        onPress={() => {
          Alert.alert("Eliminar Cliente", "Seguro que quieres eliminarlo", [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Eliminar",
              style: "destructive",
              onPress: () => {
                deleteClient(cliente.id);
                router.back();
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
        onChange={setForm} // ✅ ahora los inputs funcionan
        onCancel={() => setEditarVisible(false)}
        onSave={guardar}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f6f7fb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#6B7280" },
  error: { color: "red", fontSize: 16 },

  header: { alignItems: "center", marginBottom: 24, gap: 8 },
  name: { fontSize: 22, fontWeight: "700", color: "#111827" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },

  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  value: { fontSize: 15, color: "#374151" },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
  pedido: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  pedidoText: { fontSize: 14, color: "#374151" },
  empty: { fontSize: 14, color: "#6B7280", textAlign: "center" },

  editButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  editText: { color: "#ffffff", fontWeight: "800", fontSize: 16 },

  deleteButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  deleteText: { color: "#ffffff", fontWeight: "800", fontSize: 16 },
});
