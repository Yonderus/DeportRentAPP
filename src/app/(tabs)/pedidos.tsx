import { StyleSheet, View, Text } from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { PaperProvider } from "react-native-paper";
import { config } from "@gluestack-ui/config";
import { useTemaStore } from "./preferencias";
import { obtenerColores } from "../../theme";

export default function PedidosScreen() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  return (
    <View style={[styles.container, { backgroundColor: colores.fondoPrincipal }]}>
      <Text style={{ color: colores.textoPrincipal }}>Pedidos Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
