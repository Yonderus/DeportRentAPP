import React from "react";
import { View } from "react-native";
import { Card, Switch, Text } from "react-native-paper";
import { useTemaStore, obtenerColores } from "../preferencias/index";
import { styles } from "../../../styles/app/preferencias.styles";

export default function PerfilPreferenciasScreen() {
  const tema = useTemaStore((s) => s.tema);
  const toggleTema = useTemaStore((s) => s.toggleTema);
  const colores = obtenerColores(tema);

  const esOscuro = tema === "oscuro";

  return (
    <View style={[styles.container, { backgroundColor: colores.fondoPrincipal }]}>
      <Card style={[styles.card, { backgroundColor: colores.fondoCard }]}>
        <Card.Content style={styles.cardContentRow}>
          <Text style={[styles.label, { color: colores.textoPrincipal }]}>Modo oscuro</Text>
          <Switch value={esOscuro} onValueChange={toggleTema} />
        </Card.Content>
      </Card>
    </View>
  );
}
