import React from "react";
import { Pressable, View, Text } from "react-native";
import { Avatar } from "react-native-paper";
import { Cliente } from "../../types/types";
import { useTemaStore } from "../../app/(tabs)/preferencias";
import { obtenerColores } from "../../styles/theme";
import { styles } from "../../styles/components/clientsItem.styles";

type Props = {
  client: Cliente;
  onPress: (client: Cliente) => void;
};

export default function ClienteItem({ client, onPress }: Props) {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  
  const iniciales = client.nombre?.charAt(0) ?? "";

  return (
    <Pressable
      onPress={() => onPress(client)}
      style={({ pressed }) => [styles.card, { backgroundColor: colores.fondoCard }, pressed && styles.pressed]}
    >
      <Avatar.Text
        size={44}
        label={iniciales.toUpperCase()}
        style={[styles.avatar, { backgroundColor: colores.btnPrimario }]}
        labelStyle={styles.avatarText}
      />

      <View style={styles.info}>
        <Text style={[styles.name, { color: colores.textoPrincipal }]}>
          {client.nombre}
        </Text>

        <Text style={[styles.secondary, { color: colores.textoSecundario }]}>{client.telefono}</Text>

        {client.email ? (
          <Text style={[styles.secondary, { color: colores.textoSecundario }]} numberOfLines={1}>
            {client.email}
          </Text>
        ) : null}
      </View>

      <Text style={[styles.chevron, { color: colores.textoTerciario }]}>›</Text>
    </Pressable>
  );
}
