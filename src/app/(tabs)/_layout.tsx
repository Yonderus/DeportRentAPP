import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useTemaStore } from "./preferencias/index";
import { obtenerColores } from "../../theme";

export default function TabLayout() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  return (
    <PaperProvider>
      <Tabs screenOptions={{ 
        tabBarActiveTintColor: colores.btnPrimario,
        tabBarInactiveTintColor: colores.textoSecundario,
        tabBarStyle: { backgroundColor: colores.fondoCard, borderTopColor: colores.borde },
        headerStyle: { backgroundColor: colores.fondoCard, borderBottomColor: colores.borde },
        headerTintColor: colores.textoPrincipal,
        headerTitleStyle: { color: colores.textoPrincipal },
      }}>
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
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="preferencias"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
