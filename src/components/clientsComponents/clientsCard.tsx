import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { FAB } from "react-native-paper";
import { router, useFocusEffect } from "expo-router";

import { Client } from "../../data/clients";
import { getClients, addClient, updateClient } from "../../services/clientsService";

import ClienteItem from "./clientsItem";
import ClienteDialog, { ClientForm } from "./clientsDialog";

const crearClienteVacio = (): ClientForm => ({
  name: "",
  surname: "",
  email: "",
  phone: "",
  pedidos: [],
});

export default function ClientsCard() {
  const [clients, setClients] = useState<Client[]>([]);

  // modal formulario (crear)
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ClientForm>(crearClienteVacio());

  const cargar = () => setClients(getClients());

  // se ejecuta cada vez que esta pantalla vuelve a estar activa
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const abrirCrear = () => {
    setEditingId(null);
    setForm(crearClienteVacio());
    setFormVisible(true);
  };

  const abrirEditar = (client: Client) => {
    setEditingId(client.id);
    setForm({
      name: client.name,
      surname: client.surname,
      email: client.email,
      phone: client.phone,
      pedidos: client.pedidos ?? [],
    });
    setFormVisible(true);
  };

  const guardar = (data: ClientForm) => {
    if (editingId === null) addClient(data);
    else updateClient(editingId, data);

    setFormVisible(false);
    cargar();
  };

  return (
    <View style={s.page}>
      <View style={s.header}>
        <Text style={s.title}>Clientes</Text>
        <Text style={s.subtitle}>Pulsa un cliente para ver detalles</Text>
      </View>

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

      <FAB icon="plus" style={s.fab} onPress={abrirCrear} />

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
  page: { flex: 1, backgroundColor: "#f6f7fb" },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  fab: { position: "absolute", right: 16, bottom: 16, backgroundColor: "#3b82f6" },
});
