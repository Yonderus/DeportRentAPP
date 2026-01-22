import React from "react"; 
import { View, StyleSheet } from "react-native"; 
import { Button, Card, Text } from "react-native-paper"; 
import { useTemaStore } from "../(tabs)/preferencias";
import { obtenerColores } from "../../theme";

export default function HomeScreen({ navigation }: any) { 
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  return (
    <View style={[styles.container, { backgroundColor: colores.fondoPrincipal }]}> 
     
      <Text variant="headlineSmall" style={[styles.titulo, { color: colores.textoPrincipal }]}> 
        Hola Usuario 
      </Text> 
         
    </View> 
  ); 
} 
     
const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    padding: 16,
  },
  
  titulo: { 
    marginBottom: 16 
  },  
});