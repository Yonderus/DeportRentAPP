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
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { Client } from "../../../data/clients";
import { getClientById, updateClient, deleteClient } from "../../../services/clientsService";
import ClienteDialog, { ClientForm } from "../../../components/clientsComponents/clientsDialog";
import { useTemaStore } from "../preferencias";
import { obtenerColores } from "../../../theme";

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
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

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
      <View style={[s.center, { backgroundColor: colores.fondoPrincipal }]}>
        <ActivityIndicator size="large" />
        <Text style={[s.loadingText, { color: colores.textoSecundario }]}>Cargando cliente...</Text>
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
          {cliente.name} {cliente.surname}
        </Text>
      </View>

      <View style={[s.card, { backgroundColor: colores.fondoCard }]}>
        <View style={s.row}>
          <Feather name="mail" size={18} color={colores.iconoColorGris} />
          <Text style={[s.value, { color: colores.textoSecundario }]}>{cliente.email || "-"}</Text>
        </View>

        <View style={s.row}>
          <Feather name="phone" size={18} color={colores.iconoColorGris} />
          <Text style={[s.value, { color: colores.textoSecundario }]}>{cliente.phone}</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={[s.sectionTitle, { color: colores.textoPrincipal }]}>Pedidos</Text>
      </View>

      <View style={[s.card, { backgroundColor: colores.fondoCard }]}>
        {cliente.pedidos.length === 0 ? (
          <Text style={[s.empty, { color: colores.textoSecundario }]}>Este cliente no tiene pedidos</Text>
        ) : (
          cliente.pedidos.map((p, i) => (
            <View key={i} style={s.pedido}>
              <Feather name="shopping-bag" size={16} color={colores.btnPrimario} />
              <Text style={[s.pedidoText, { color: colores.textoSecundario }]}>{p}</Text>
            </View>
          ))
        )}
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
