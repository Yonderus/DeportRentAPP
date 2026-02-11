import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTemaStore } from "../preferencias/index";
import { obtenerColores } from "../../../theme";
import { useUsuarioStore } from "../../../stores/useUsuarioStore";
import { getSignedAvatarUrl } from "../../../services/authService";

interface MenuCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  rolesPermitidos?: ('NORMAL' | 'ADMIN')[];
}

const menuOptions: MenuCard[] = [
  {
    title: "Clientes",
    description: "Gestionar clientes y direcciones",
    icon: "account-group",
    route: "/clientes",
    color: "#4F46E5",
    rolesPermitidos: ['ADMIN', 'NORMAL'],
  },
  {
    title: "Pedidos",
    description: "Ver y gestionar pedidos",
    icon: "shopping",
    route: "/pedidos",
    color: "#10B981",
    rolesPermitidos: ['ADMIN', 'NORMAL'],
  },
  {
    title: "Perfil",
    description: "Editar tu información personal",
    icon: "account-edit",
    route: "/perfil",
    color: "#F59E0B",
    rolesPermitidos: ['ADMIN', 'NORMAL'],
  },
  {
    title: "Preferencias",
    description: "Configuración de la aplicación",
    icon: "cog",
    route: "/preferencias",
    color: "#6B7280",
    rolesPermitidos: ['ADMIN', 'NORMAL'],
  },
];

export default function InicioScreen() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const router = useRouter();
  const { nombreVisible, email, rol, avatarPath } = useUsuarioStore();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const opcionesDisponibles = menuOptions.filter(
    (option) => !option.rolesPermitidos || option.rolesPermitidos.includes(rol as 'NORMAL' | 'ADMIN')
  );

  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  useEffect(() => {
    let mounted = true;

    const loadAvatar = async () => {
      if (!avatarPath) {
        setAvatarUrl(null);
        return;
      }

      try {
        const signedUrl = await getSignedAvatarUrl(avatarPath);
        if (mounted) setAvatarUrl(signedUrl);
      } catch (error) {
        console.warn("No se pudo cargar el avatar en inicio:", error);
        if (mounted) setAvatarUrl(null);
      }
    };

    loadAvatar();

    return () => {
      mounted = false;
    };
  }, [avatarPath]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colores.fondoPrincipal }]}>
      {/* Header con información del usuario */}
      <View style={[styles.header, { backgroundColor: colores.btnPrimario }]}>
        <View style={styles.userInfo}>
          {avatarUrl ? (
            <Avatar.Image
              size={64}
              source={{ uri: avatarUrl }}
            />
          ) : (
            <Avatar.Text 
              size={64} 
              label={getInitials(nombreVisible)} 
              style={styles.avatar}
            />
          )}
          <View style={styles.userDetails}>
            <Text style={styles.welcomeText}>Bienvenido/a</Text>
            <Text style={styles.userName}>{nombreVisible || "Usuario"}</Text>
            <Text style={styles.userEmail}>{email || ""}</Text>
            <View style={styles.roleBadge}>
              <MaterialCommunityIcons 
                name={rol === 'ADMIN' ? "shield-crown" : "account"} 
                size={16} 
                color="white" 
              />
              <Text style={styles.roleText}>{rol || "NORMAL"}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Mensaje personalizado según rol */}
      <View style={[styles.roleInfoContainer, { backgroundColor: colores.fondoCard }]}>
        <MaterialCommunityIcons 
          name="information" 
          size={20} 
          color={colores.btnPrimario} 
        />
        <Text style={[styles.roleInfoText, { color: colores.textoPrincipal }]}>
          {rol === 'ADMIN' 
            ? "Tienes acceso completo a todas las funcionalidades de administración"
            : "Accede a las funciones disponibles para tu perfil"}
        </Text>
      </View>

      {/* Grid de opciones del menú */}
      <View style={styles.menuGrid}>
        <Text style={[styles.sectionTitle, { color: colores.textoPrincipal }]}>
          Acceso Rápido
        </Text>
        {opcionesDisponibles.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleNavigate(option.route)}
            activeOpacity={0.7}
          >
            <Card 
              style={[styles.menuCard, { backgroundColor: colores.fondoCard, borderColor: colores.borde }]}
            >
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                  <MaterialCommunityIcons 
                    name={option.icon as any} 
                    size={32} 
                    color={option.color} 
                  />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, { color: colores.textoPrincipal }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.cardDescription, { color: colores.textoSecundario }]}>
                    {option.description}
                  </Text>
                </View>
                <MaterialCommunityIcons 
                  name="chevron-right" 
                  size={24} 
                  color={colores.textoSecundario} 
                />
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Panel exclusivo para ADMIN */}
      {rol === 'ADMIN' && (
        <View style={[styles.adminPanel, { backgroundColor: colores.fondoCard, borderColor: colores.btnPrimario }]}>
          <View style={styles.adminHeader}>
            <MaterialCommunityIcons 
              name="shield-crown" 
              size={24} 
              color={colores.btnPrimario} 
            />
            <Text style={[styles.adminTitle, { color: colores.textoPrincipal }]}>
              Panel de Administrador
            </Text>
          </View>
          <Text style={[styles.adminText, { color: colores.textoSecundario }]}>
            Como administrador, tienes privilegios especiales para gestionar todos los aspectos de la aplicación.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#ffffff40",
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  welcomeText: {
    color: "#ffffffcc",
    fontSize: 14,
    fontWeight: "500",
  },
  userName: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 2,
  },
  userEmail: {
    color: "#ffffffcc",
    fontSize: 14,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff30",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start",
    gap: 6,
  },
  roleText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  roleInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  roleInfoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  menuGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },
  menuCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  adminPanel: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  adminHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  adminText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
