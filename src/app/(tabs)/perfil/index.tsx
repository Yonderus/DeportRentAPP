import React, { useMemo, useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";
import { router } from "expo-router";
import { useUsuarioStore } from "../../../stores/useUsuarioStore";
import { useTemaStore } from "../preferencias/index";
import { obtenerColores } from "../../../theme";


export default function PerfilScreen() {
  const { email, rol, nombreVisible, isLoggedIn, logout, setNombreVisible } = useUsuarioStore();
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const [nombreEditado, setNombreEditado] = useState(nombreVisible || "");
  const [editando, setEditando] = useState(false);

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("Auth/loginPage");
    }
  }, [isLoggedIn]);

  const handleGuardar = async () => {
    await setNombreVisible(nombreEditado);
    setEditando(false);
  };

  const handleCancelar = () => {
    setNombreEditado(nombreVisible || "");
    setEditando(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("Auth/loginPage");
  };

  // Si no está logueado, no mostrar nada (mientras redirige)
  if (!isLoggedIn) {
    return null;
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: colores.fondoPrincipal }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text variant="headlineSmall" style={{ fontWeight: "700", color: colores.textoPrincipal }}>
          Perfil
        </Text>

        <IconButton
          icon="cog"
          size={26}
          onPress={() => router.push("/perfil/preferencias")}
          accessibilityLabel="Abrir preferencias"
          iconColor={colores.textoPrincipal}
        />
      </View>

      <Card style={{ backgroundColor: colores.fondoCard }}>
        <Card.Content style={{ gap: 12 }}>
          <Text variant="titleMedium" style={{ fontWeight: "700", color: colores.textoPrincipal }}>
            Información del usuario
          </Text>

          <View>
            <Text style={{ color: colores.textoSecundario, marginBottom: 4 }}>Email</Text>
            <Text style={{ color: colores.textoPrincipal, fontWeight: "500" }}>{email ?? "-"}</Text>
          </View>

          <View>
            <Text style={{ color: colores.textoSecundario, marginBottom: 4 }}>Rol</Text>
            <Text style={{ color: colores.textoPrincipal, fontWeight: "500" }}>{rol ?? "-"}</Text>
          </View>

          <View>
            <Text style={{ color: colores.textoSecundario, marginBottom: 8 }}>Nombre visible</Text>
            {editando ? (
              <>
                <TextInput
                  value={nombreEditado}
                  onChangeText={setNombreEditado}
                  placeholder="Ingrese su nombre"
                  mode="outlined"
                  style={{ marginBottom: 8 }}
                />
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Button
                    mode="contained"
                    onPress={handleGuardar}
                    style={{ flex: 1, backgroundColor: colores.btnPrimario }}
                  >
                    Guardar
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={handleCancelar}
                    style={{ flex: 1 }}
                  >
                    Cancelar
                  </Button>
                </View>
              </>
            ) : (
              <>
                <Text style={{ color: colores.textoPrincipal, fontWeight: "500", marginBottom: 8 }}>
                  {nombreVisible || "No especificado"}
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => setEditando(true)}
                  icon="pencil"
                >
                  Editar
                </Button>
              </>
            )}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={{ backgroundColor: colores.btnPrimario }}
        labelStyle={{ color: colores.textoPrincipal }}
        icon="door-open"
      >
        Cerrar sesión
      </Button>
    </View>
  );
}
