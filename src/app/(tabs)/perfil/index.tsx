import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Button, Card, Divider, IconButton, List, Text, TextInput } from "react-native-paper";
import { router } from "expo-router";
import { useUsuarioStore } from "../../../stores/useUsuarioStore";
import { useTemaStore } from "../preferencias/index";
import { obtenerColores } from "../../../theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function PerfilScreen() {
  const { email, rol, nombreVisible, isLoggedIn, logout, updatePerfil } = useUsuarioStore();
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const [nombreEditado, setNombreEditado] = useState(nombreVisible || "");
  const [emailEditado, setEmailEditado] = useState(email || "");
  const [editando, setEditando] = useState(false);
  const [errorEmail, setErrorEmail] = useState<string | null>(null);

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("Auth/loginPage");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!editando) {
      setNombreEditado(nombreVisible || "");
      setEmailEditado(email || "");
    }
  }, [nombreVisible, email, editando]);

  const handleGuardar = async () => {
    const emailNormalizado = emailEditado.trim();
    if (!emailNormalizado) {
      setErrorEmail("El email es obligatorio");
      return;
    }

    setErrorEmail(null);
    await updatePerfil({
      nombreVisible: nombreEditado.trim(),
      email: emailNormalizado,
    });
    setEditando(false);
  };

  const handleCancelar = () => {
    setNombreEditado(nombreVisible || "");
    setEmailEditado(email || "");
    setErrorEmail(null);
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

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colores.fondoPrincipal }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
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
            {editando ? (
              <TextInput
                value={emailEditado}
                onChangeText={setEmailEditado}
                placeholder="Ingrese su email"
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errorEmail}
              />
            ) : (
              <Text style={{ color: colores.textoPrincipal, fontWeight: "500" }}>{email ?? "-"}</Text>
            )}
            {editando && errorEmail ? (
              <Text style={{ color: colores.textoSecundario, marginTop: 6 }}>{errorEmail}</Text>
            ) : null}
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

      <Card style={{ backgroundColor: colores.fondoCard }}>
        <Card.Content style={{ gap: 12 }}>
          <Text variant="titleMedium" style={{ fontWeight: "700", color: colores.textoPrincipal }}>
            Resumen
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Avatar.Text
              size={64}
              label={getInitials(nombreVisible)}
              style={{ backgroundColor: colores.avatarFondo }}
              color={colores.avatarIcono}
            />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ color: colores.textoPrincipal, fontWeight: "700", fontSize: 16 }}>
                {nombreVisible || "Usuario"}
              </Text>
              <Text style={{ color: colores.textoSecundario }}>{email || "Sin email"}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <MaterialCommunityIcons
                  name={rol === "ADMIN" ? "shield-crown" : "account"}
                  size={16}
                  color={colores.textoSecundario}
                />
                <Text style={{ color: colores.textoSecundario, fontWeight: "600" }}>
                  {rol || "NORMAL"}
                </Text>
              </View>
            </View>
          </View>
          <Divider />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: colores.textoTerciario, fontSize: 12 }}>Estado</Text>
              <Text style={{ color: colores.textoPrincipal, fontWeight: "700" }}>Activo</Text>
            </View>
            <View>
              <Text style={{ color: colores.textoTerciario, fontSize: 12 }}>Preferencias</Text>
              <Text style={{ color: colores.textoPrincipal, fontWeight: "700" }}>
                Tema {tema === "oscuro" ? "Oscuro" : "Claro"}
              </Text>
            </View>
            <View>
              <Text style={{ color: colores.textoTerciario, fontSize: 12 }}>Notificaciones</Text>
              <Text style={{ color: colores.textoPrincipal, fontWeight: "700" }}>Activas</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={{ backgroundColor: colores.fondoCard }}>
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: "700", color: colores.textoPrincipal, marginBottom: 6 }}>
            Acciones rápidas
          </Text>
          <List.Item
            title="Ver pedidos"
            description="Gestiona tus pedidos actuales"
            titleStyle={{ color: colores.textoPrincipal }}
            descriptionStyle={{ color: colores.textoSecundario }}
            left={(props) => <List.Icon {...props} icon="shopping" color={colores.btnPrimario} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" color={colores.textoSecundario} />}
            onPress={() => router.push("/pedidos")}
          />
          <List.Item
            title="Clientes"
            description="Consulta y edita clientes"
            titleStyle={{ color: colores.textoPrincipal }}
            descriptionStyle={{ color: colores.textoSecundario }}
            left={(props) => <List.Icon {...props} icon="account-group" color={colores.btnSecundario} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" color={colores.textoSecundario} />}
            onPress={() => router.push("/clientes")}
          />
          <List.Item
            title="Preferencias"
            description="Personaliza tu experiencia"
            titleStyle={{ color: colores.textoPrincipal }}
            descriptionStyle={{ color: colores.textoSecundario }}
            left={(props) => <List.Icon {...props} icon="cog" color={colores.iconoColorGris} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" color={colores.textoSecundario} />}
            onPress={() => router.push("/perfil/preferencias")}
          />
        </Card.Content>
      </Card>

      {editando ? (
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
      ) : null}

      <Button
        mode="contained"
        onPress={handleLogout}
        style={{ backgroundColor: colores.btnPrimario }}
        labelStyle={{ color: colores.textoPrincipal }}
        icon="door-open"
      >
        Cerrar sesión
      </Button>
    </ScrollView>
  );
}
