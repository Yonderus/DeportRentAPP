import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { FAB } from "react-native-paper";

import { Client } from "../../data/clients";
import { getClients, addClient, updateClient, deleteClient } from "../../services/clientsService";
import ClienteItem from "./clientsItem";
import ClienteDialog, { ClientForm } from "./clientsDialog";

const crearClienteVacio = (): ClientForm => ({
  name: "",
  surname: "",
  email: "",
  phone: "",
  pedidos: [],
});

export default function clientsCard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [visible, setVisible] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ClientForm>(crearClienteVacio());

  const cargar = () => setClients(getClients());

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setEditingId(null);
    setForm(crearClienteVacio());
    setVisible(true);
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
    setVisible(true);
  };

  const cancelar = () => setVisible(false);

  const guardar = (data: ClientForm) => {
    if (editingId === null) {
      addClient(data);
    } else {
      updateClient(editingId, data);
    }

    setVisible(false);
    cargar();
  };

  const borrar = (id: number) => {
    Alert.alert("Eliminar cliente", "Seguro que quieres eliminarlo", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          deleteClient(id);
          cargar();
        },
      },
    ]);
  };

  return (
    <View style={s.page}>
  <View style={s.header}>
    <Text>Clientes</Text>
    <Text>Crea, edita y elimina clientes</Text>
  </View>

  <FlatList
    data={clients}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={s.list}
    renderItem={({ item }) => (
      <ClienteItem client={item} onEdit={abrirEditar} onDelete={borrar} />
    )}
  />

  <FAB icon="plus" style={s.fab} onPress={abrirCrear} />

  <ClienteDialog
    visible={visible}
    title={editingId === null ? "Nuevo cliente" : "Editar cliente"}
    value={form}
    onChange={setForm}
    onCancel={cancelar}
    onSave={guardar}
  />
</View>

  );
}

const s = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 100, // espacio para el FAB
  },

  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});

