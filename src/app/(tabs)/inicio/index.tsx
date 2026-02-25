import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { Text, Card, Avatar, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTemaStore } from "../preferencias/index";
import { obtenerColores } from "../../../styles/theme";
import { useUsuarioStore } from "../../../stores/useUsuarioStore";
import { getSignedAvatarUrl } from "../../../services/authService";
import { getProductos } from "../../../services/productosService";
import { getPedidos, PedidoListItem } from "../../../services/pedidosService";
import { useCarritoStore } from "../../../stores/useCarritoStore";
import { styles } from "../../../styles/app/inicio.styles";

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
    title: "Preferencias",
    description: "Ajusta tema y opciones de la aplicación",
    icon: "cog",
    route: "/perfil/preferencias",
    color: "#6B7280",
    rolesPermitidos: ['ADMIN', 'NORMAL'],
  },
];

const HOME_HERO_IMAGE_KEY = "HOME_HERO_IMAGE_URI";

export default function InicioScreen() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  const router = useRouter();
  const { nombreVisible, email, rol, avatarPath, avatarUpdatedAt } = useUsuarioStore();
  const isAdmin = rol === "ADMIN";
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [heroImageUri, setHeroImageUri] = useState<string | null>(null);
  const totalCarritoItems = useCarritoStore((s) =>
    s.items.reduce((sum, item) => sum + item.cantidad, 0)
  );

  const { data: productos = [] } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const { data: pedidos = [] } = useQuery({
    queryKey: ["pedidos"],
    queryFn: getPedidos,
  });

  const heroData =
    rol === "ADMIN"
      ? {
          title: "Centro de administración",
          subtitle: "Control total de DeportRent desde una sola pantalla.",
          description:
            "Gestiona productos, clientes y pedidos para mantener el catálogo al día y el flujo de alquiler y compra bajo control.",
          highlights: [
            "Alta y edición de productos con tallas",
            "Supervisión de pedidos y cambios de estado",
            "Acceso a gestión de clientes",
          ],
          primaryLabel: "Gestionar productos",
          primaryRoute: "/productos",
          secondaryLabel: "Ver pedidos",
          secondaryRoute: "/pedidos",
          icon: "shield-crown",
        }
      : {
          title: "Bienvenido a DeportRent",
          subtitle: "Tu espacio para alquilar o comprar equipamiento deportivo.",
          description:
            "Consulta productos disponibles, añade tallas al carrito y haz seguimiento de tus pedidos de forma sencilla.",
          highlights: [
            "Catálogo de productos con precio claro",
            "Carrito con modalidad compra o alquiler",
            "Seguimiento de estado de tus pedidos",
          ],
          primaryLabel: "Ver productos",
          primaryRoute: "/productos",
          secondaryLabel: "Mis pedidos",
          secondaryRoute: "/pedidos",
          icon: "basket",
        };

  const opcionesDisponibles = menuOptions.filter(
    (option) => !option.rolesPermitidos || option.rolesPermitidos.includes(rol as 'NORMAL' | 'ADMIN')
  );

  const productosActivos = productos.filter((p) => p.activo).length;
  const pedidosPendientes = pedidos.filter((p) => p.estado === "PENDIENTE_REVISION").length;
  const ultimoPedido = pedidos[0] as PedidoListItem | undefined;

  const heroStats =
    rol === "ADMIN"
      ? [
          { label: "Productos activos", value: String(productosActivos) },
          { label: "Pedidos pendientes", value: String(pedidosPendientes) },
          { label: "Pedidos totales", value: String(pedidos.length) },
        ]
      : [
          { label: "Productos disponibles", value: String(productosActivos) },
          { label: "En carrito", value: String(totalCarritoItems) },
          { label: "Pedidos visibles", value: String(pedidos.length) },
        ];

  const activityTitle = ultimoPedido
    ? `Último pedido: ${ultimoPedido.codigo}`
    : "Aún no hay actividad registrada";
  const activityDescription = ultimoPedido
    ? `Estado: ${ultimoPedido.estado} • Fecha inicio: ${ultimoPedido.fechaInicio}`
    : "Cuando registres pedidos, aquí verás un resumen rápido de la última acción.";

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

  const seleccionarImagenHero = async () => {
    if (!isAdmin) return;

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permiso requerido", "Necesitas permitir acceso a la galería para elegir una imagen.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      const uri = result.assets[0].uri;
      setHeroImageUri(uri);
      await AsyncStorage.setItem(HOME_HERO_IMAGE_KEY, uri);
    } catch {
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  const eliminarImagenHero = async () => {
    if (!isAdmin) return;

    setHeroImageUri(null);
    await AsyncStorage.removeItem(HOME_HERO_IMAGE_KEY);
  };

  // Refresca la URL firmada cuando cambia el avatar.
  useEffect(() => {
    let mounted = true;

    const loadAvatar = async () => {
      // Si no hay path, usar avatar por iniciales.
      if (!avatarPath) {
        setAvatarUrl(null);
        return;
      }

      try {
        // URL firmada temporal para buckets privados.
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
  }, [avatarPath, avatarUpdatedAt]);

  useEffect(() => {
    let mounted = true;

    const loadHeroImage = async () => {
      const savedUri = await AsyncStorage.getItem(HOME_HERO_IMAGE_KEY);
      if (mounted && savedUri) {
        setHeroImageUri(savedUri);
      }
    };

    loadHeroImage();

    return () => {
      mounted = false;
    };
  }, []);

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
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: colores.fondoCard,
            borderColor: colores.borde,
          },
        ]}
      >
        <View style={[styles.heroDecorTop, { backgroundColor: colores.btnPrimario }]} />
        <View style={[styles.heroDecorBottom, { backgroundColor: colores.btnSecundario }]} />

        <View style={styles.heroTop}>
          <View style={[styles.heroIconWrap, { backgroundColor: colores.cardElevacion }]}> 
            <MaterialCommunityIcons
              name={heroData.icon as any}
              size={24}
              color={colores.btnPrimario}
            />
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={[styles.heroTitle, { color: colores.textoPrincipal }]}>{heroData.title}</Text>
            <Text style={[styles.heroSubtitle, { color: colores.textoSecundario }]}>{heroData.subtitle}</Text>
            <Text style={[styles.heroDescription, { color: colores.textoSecundario }]}>{heroData.description}</Text>
            <View style={styles.heroHighlights}>
              {heroData.highlights.map((item) => (
                <View key={item} style={styles.heroHighlightItem}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={16}
                    color={colores.btnPrimario}
                  />
                  <Text style={[styles.heroHighlightText, { color: colores.textoPrincipal }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {(isAdmin || heroImageUri) ? (
          <View style={styles.heroImageSection}>
            {heroImageUri ? (
              <Image source={{ uri: heroImageUri }} style={styles.heroImage} resizeMode="cover" />
            ) : (
              <View style={[styles.heroImagePlaceholder, { borderColor: colores.borde }]}>
                <MaterialCommunityIcons name="image-plus" size={22} color={colores.btnPrimario} />
                <Text style={[styles.heroImagePlaceholderText, { color: colores.textoSecundario }]}>Añade una imagen para personalizar el inicio</Text>
              </View>
            )}

            {isAdmin ? (
              <View style={styles.heroImageActions}>
                <Button
                  mode="contained-tonal"
                  onPress={seleccionarImagenHero}
                  icon="image"
                  style={styles.heroImageBtn}
                >
                  {heroImageUri ? "Cambiar imagen" : "Añadir imagen"}
                </Button>
                {heroImageUri ? (
                  <Button
                    mode="text"
                    onPress={eliminarImagenHero}
                    textColor={colores.enlaces}
                  >
                    Quitar
                  </Button>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.heroStatsGrid}>
          {heroStats.map((stat) => (
            <View
              key={stat.label}
              style={[
                styles.heroStatCard,
                {
                  borderColor: colores.borde,
                  backgroundColor: colores.fondoSecundario,
                },
              ]}
            >
              <Text style={[styles.heroStatValue, { color: colores.btnPrimario }]}>{stat.value}</Text>
              <Text style={[styles.heroStatLabel, { color: colores.textoSecundario }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.heroActions}>
          <Button
            mode="contained"
            onPress={() => handleNavigate(heroData.primaryRoute)}
            buttonColor={colores.btnPrimario}
            textColor={colores.textoInverso}
            style={styles.heroPrimaryBtn}
          >
            {heroData.primaryLabel}
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleNavigate(heroData.secondaryRoute)}
            textColor={colores.btnPrimario}
            style={[styles.heroSecondaryBtn, { borderColor: colores.btnPrimario }]}
          >
            {heroData.secondaryLabel}
          </Button>
        </View>
      </View>

      <View
        style={[
          styles.activityCard,
          {
            backgroundColor: colores.fondoCard,
            borderColor: colores.borde,
          },
        ]}
      >
        <View style={styles.activityHeader}>
          <MaterialCommunityIcons name="history" size={20} color={colores.btnPrimario} />
          <Text style={[styles.activityTitle, { color: colores.textoPrincipal }]}>Última actividad</Text>
        </View>
        <Text style={[styles.activityMainText, { color: colores.textoPrincipal }]}>{activityTitle}</Text>
        <Text style={[styles.activitySubText, { color: colores.textoSecundario }]}>{activityDescription}</Text>
      </View>

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

