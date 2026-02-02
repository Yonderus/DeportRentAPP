import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import { PaperProvider } from "react-native-paper";
import * as React from "react";
import { useTemaStore } from "./preferencias/index";
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import { useAuth } from "../../context/AuthContext";
import { obtenerColores } from "../../theme";
import { StatusBar } from "react-native";
import type { StatusBarStyle } from "react-native";

const STYLES = ['default', 'dark-content', 'light-content'] as const;

export default function TabLayout() {
  const tema = useTemaStore((s) => s.tema);
  const isLoggedIn = useUsuarioStore((s) => s.isLoggedIn);
  const { isLoading } = useAuth();
  const router = useRouter();
  const colores = obtenerColores(tema);
  const [statusBarStyle, setStatusBarStyle] = React.useState<StatusBarStyle>(
    STYLES[0],
  );


  React.useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/Auth/loginPage");
    }
  }, [isLoggedIn, isLoading]);

  if (isLoading || !isLoggedIn) {
    return null;
  }

  return (
    <PaperProvider>
      <StatusBar
          animated={true}
          backgroundColor="#61dafb"
          barStyle={statusBarStyle}
        />
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
          name="inicio/index"
          options={{
            href: null,
          }}
        />

        {/* <Tabs.Screen
          name="inicio"
          options={{
            href: null,
          }}
        /> */}

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
