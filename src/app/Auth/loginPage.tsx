import React, { useState } from "react";
import { StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { Box, Button, ButtonText, Text, Pressable } from "@gluestack-ui/themed";
import { Avatar } from "react-native-paper";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import TextFieldLogin from "../../components/textFieldLogin";
import { useTemaStore } from "../(tabs)/preferencias";
import { obtenerColores } from "../../theme";
// React Query para manejar el login y estados de carga
import { useMutation } from "@tanstack/react-query";
import { loginWithPassword } from "../../services/authService";

export default function LoginPage() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Mutación de login contra Supabase
  const loginMutation = useMutation({
    mutationFn: () => loginWithPassword(email, password),
    onSuccess: (resultado) => {
      if (resultado.success) {
        router.replace("(tabs)");
      } else {
        Alert.alert("Error de inicio de sesión", resultado.message);
      }
    },
    onError: (error: any) => {
      Alert.alert("Error de inicio de sesión", error?.message ?? "Error desconocido");
    },
  });

  const handleLogin = async () => {
    loginMutation.mutate();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colores.fondoPrincipal }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box style={styles.innerContainer}>
          <Box style={[styles.card, { backgroundColor: colores.fondoCard, borderColor: colores.borde }]}>
          <Avatar.Icon 
            size={80} 
            icon="lock" 
            color={colores.avatarIcono} 
            style={[styles.avatar, { backgroundColor: colores.avatarFondo }]} 
          />

        <Box style={styles.header}>
          <Text style={[styles.title, { color: colores.textoPrincipal }]}>Bienvenido</Text>
          <Text style={[styles.subtitle, { color: colores.textoSecundario }]}>Introduce tus credenciales para continuar</Text>
        </Box>

        <Box style={styles.section}>
          <Text style={[styles.label, { color: colores.textoPrincipal }]}>Correo electrónico</Text>
          <TextFieldLogin
            placeholder="nombre@ejemplo.com"
            icon={<Feather name="mail" size={20} color={colores.iconoColorGris} />}
            value={email}
            onChangeText={setEmail}
          />
        </Box>

        <Box style={styles.section}>
          <Box style={styles.rowBetween}>
            <Text style={[styles.label, { color: colores.textoPrincipal }]}>Contraseña</Text>
            <Pressable>
              <Text style={[styles.link, { color: colores.enlaces }]}>Olvidaste tu contraseña</Text>
            </Pressable>
          </Box>

          <TextFieldLogin
            icon={<Feather name="lock" size={20} color={colores.iconoColorGris} />}
            placeholder="********"
            secure
            value={password}
            onChangeText={setPassword}
          />
        </Box>

        <Button 
          style={[styles.primaryBtn, { backgroundColor: colores.btnPrimario }]} 
          onPress={handleLogin}
          disabled={loginMutation.isPending}
        >
          <ButtonText style={styles.primaryText}>
            {loginMutation.isPending ? "Iniciando..." : "Iniciar sesión"}
          </ButtonText>
        </Button>

        <Text style={[styles.centerText, { color: colores.textoSecundario }]}>O continúa con</Text>

        <Button style={[styles.googleBtn, { backgroundColor: colores.btnGoogleFondo, borderColor: colores.borde }]}>
          <Box style={styles.googleRow}>
            <MaterialCommunityIcons name="google" size={20} color="black" />
            <ButtonText style={[styles.googleText, { color: colores.btnGoogleTexto }]}>Google</ButtonText>
          </Box>
        </Button>

        <Box style={styles.footer}>
          <Text style={[styles.centerText, { color: colores.textoSecundario }]}>No tienes una cuenta</Text>
          <Pressable>
            <Text style={[styles.linkCenter, { color: colores.enlaces }]}>Regístrate ahora</Text>
          </Pressable>
        </Box>
      </Box>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },

  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "white",
    paddingHorizontal: 18,
    paddingVertical: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  avatar: {
    backgroundColor: "#dad8ffff",
    alignSelf: "center",
    marginBottom: 14,
  },

  header: {
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  section: {
    marginTop: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  link: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 13,
  },

  primaryBtn: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 18,
  },

  primaryText: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
  },

  centerText: {
    textAlign: "center",
    marginTop: 16,
    color: "#6B7280",
    fontWeight: "700",
  },

  googleBtn: {
    backgroundColor: "#F3F4F6",
    marginTop: 20,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    height: 45,
  },

  googleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  googleText: {
    fontWeight: "800",
    color: "#111827",
  },

  footer: {
    marginTop: 16,
    alignItems: "center",
  },

  linkCenter: {
    marginTop: 6,
    color: "#4F46E5",
    fontWeight: "800",
  },
});
