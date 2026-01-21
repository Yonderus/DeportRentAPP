import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function TabLayout() {
  return (
    <PaperProvider>
      <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-variant" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="pedidos"
          options={{
            title: "Pedidos",
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="shopping-cart" color={color} />,
          }}
        />

        {/* IMPORTANTE: en minúsculas y que coincida con la carpeta */}
        <Tabs.Screen
          name="clientes"
          options={{
            title: "Clientes",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-group" color={color} size={size} />
            ),
          }}
        />

        

        <Tabs.Screen
          name="inventario"
          options={{
            title: "Inventario",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="warehouse" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
