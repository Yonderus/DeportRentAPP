import React from "react";
import { View } from "react-native";
import ClientesCard from "../../components/clientsComponents/clientsCard";

export default function ClientesScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ClientesCard />
    </View>
  );
}
