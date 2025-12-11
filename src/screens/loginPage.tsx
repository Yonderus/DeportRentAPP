import React from "react";
import {
  Box,
  Button,
  ButtonText,
  Text,
  Pressable,
  Center,
} from "@gluestack-ui/themed";
import TextFieldLogin from "../components/textFieldLogin";
import {StyleSheet} from 'react-native';
import { Avatar } from "react-native-paper";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function LoginPage(){
  
  return (
    
    <Center>
      
       <Box style={styles.card}>

       <Avatar.Icon 
          size={80}
          icon="lock"
          color="#5c5cff"
          style={styles.avatar}
        />

      <Text style={styles.textoCentro}>
        <h1>Bienvenido</h1>
        <p>Introduce tus credenciales para continuar</p>
        </Text>

        <Text>Correo Electrónico</Text>
        <TextFieldLogin 
        placeholder="nombre@ejemplo.com"
        icon={<Feather name="mail" size={20} color="#4B5563" />}

        />

      <Text justifyContent="space-between">
        Contraseña
      <Pressable>
            <Text style={styles.forgot}>
              ¿Olvidaste tu contraseña?
            </Text>
      </Pressable>
      </Text>
    
      <TextFieldLogin
      placeholder="********"
      secure
      icon={<Feather name="lock" size={20} color="#4B5563" />}
      />

      <Button style={styles.inicioS}>
        <ButtonText style={styles.inicioStext}>Iniciar Sesión</ButtonText>
      </Button>

      <Text style={styles.textoCentro}>
        O continúa con
      </Text>

      <Button style={styles.google}>
        <MaterialCommunityIcons 
            name="google" 
            size={20} 
            color="black" 
            style={{ marginRight: 10 }} 
          />
        <ButtonText style={styles.googletext}>Google</ButtonText>
      </Button>

      <Text style={styles.textoCentro}>
        ¿No tienes una cuenta?
      <Pressable>
            <Text style={styles.now}>
              Regístrate ahora
            </Text>
      </Pressable>
      </Text>
      </Box>
    </Center>
   
  );
}


const styles = StyleSheet.create({

  card: {
    backgroundColor: "white",
    paddingHorizontal: 40,
    paddingVertical: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  avatar: {
    backgroundColor:"#dad8ffff",
    alignSelf: "center"
  },

    inicioS: {
      backgroundColor: "#4F46E5",
      borderRadius: 10,
      paddingVertical: 12,
      marginTop: 25,
    },

    inicioStext: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },

     googletext: {
      fontWeight: "bold",
      textAlign: "center",
      color: "black"
    },

    textoCentro: {
      textAlign: 'center',
      paddingTop: 20
    },
    

   forgot: {
    textAlign: "right",
    color: "#4F46E5",
    marginTop: 8,
    paddingLeft: 100
  },

  now: {
    textAlign: "center",
    color: "#4F46E5",
    marginTop: 8,
  },

  google: {
    textAlign: "right",
    backgroundColor: 'whitesmoke',
    marginTop: 8,
    borderBlockColor: 'silver',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
  },
})
