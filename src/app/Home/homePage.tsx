import React from "react"; 
import { View, StyleSheet } from "react-native"; 
import { Button, Card, Text } from "react-native-paper"; 

export default function HomeScreen({ navigation }: any) { 
    return (
    <View style={styles.container}> 
     
     <Text variant="headlineSmall" style={styles.titulo}> Hola Usuario </Text> 
         
    </View> ); } 
     
     const styles = StyleSheet.create({ 
        container: { 
            flex: 1, 
            padding: 16,
            backgroundColor: "#bcbcbcff" 
        },
        
        titulo: { 
            color: "black", 
            marginBottom: 16 
        },  
    });