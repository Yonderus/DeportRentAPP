// Ejemplo de uso del AuthContext en componentes

import { useAuth } from "./AuthContext";
import { useUsuarioStore } from "../stores/useUsuarioStore";
import { useTemaStore } from "../app/(tabs)/preferencias/index";

// ============================================
// 1. USAR EL CONTEXTO DE AUTENTICACIÓN
// ============================================

export function MiComponente() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Cargando...</Text>;
  }

  if (!isLoggedIn) {
    return <Text>Por favor inicia sesión</Text>;
  }

  return <Text>Bienvenido usuario autenticado</Text>;
}

// ============================================
// 2. ACCEDER A LOS DATOS DEL USUARIO
// ============================================

export function MostrarDatosUsuario() {
  const { email, nombreVisible, rol } = useUsuarioStore();

  return (
    <View>
      <Text>Email: {email}</Text>
      <Text>Nombre: {nombreVisible}</Text>
      <Text>Rol: {rol}</Text>
    </View>
  );
}

// ============================================
// 3. MODIFICAR DATOS DEL USUARIO
// ============================================

export function EditarNombre() {
  const { setNombreVisible } = useUsuarioStore();

  const handleGuardar = () => {
    setNombreVisible("Juan Pérez");
    Alert.alert("Éxito", "Nombre actualizado");
  };

  return (
    <Button onPress={handleGuardar}>
      Cambiar nombre
    </Button>
  );
}

// ============================================
// 4. CERRAR SESIÓN
// ============================================

export function BotonLogout() {
  const { logout } = useUsuarioStore();
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Limpia estado del usuario
    router.replace("Auth/loginPage"); // Redirige al login
  };

  return (
    <Button onPress={handleLogout} icon="door-open">
      Cerrar sesión
    </Button>
  );
}

// ============================================
// 5. CAMBIAR TEMA
// ============================================

export function ControladorTema() {
  const { tema, toggleTema } = useTemaStore();
  const esOscuro = tema === "oscuro";

  return (
    <Switch
      value={esOscuro}
      onValueChange={toggleTema}
    />
  );
}

// ============================================
// 6. APLICAR COLORES SEGÚN TEMA
// ============================================

import { obtenerColores } from "../theme";

export function ComponenteConTema() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);

  return (
    <View style={{ backgroundColor: colores.fondoPrincipal }}>
      <Text style={{ color: colores.textoPrincipal }}>
        Texto con color dinámico
      </Text>
    </View>
  );
}

// ============================================
// 7. COMPONENTE PROTEGIDO (SOLO AUTENTICADOS)
// ============================================

export function ComponenteProtegido() {
  const { isLoggedIn } = useUsuarioStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("Auth/loginPage");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return null; // No renderizar mientras se redirige
  }

  return <Text>Contenido solo para autenticados</Text>;
}

// ============================================
// 8. RESUMEN DEL FLUJO COMPLETO
// ============================================

/*
INICIO DE LA APP:
─────────────────
1. _layout.tsx envuelve todo con AuthProvider
2. AuthContext carga la sesión guardada (AsyncStorage)
3. useUsuarioStore se rehidrata automáticamente
4. Si hay usuario guardado → Ir a Tabs
5. Si no hay usuario → Ir a Login

LOGIN:
──────
1. Usuario ingresa email y contraseña
2. validarLogin() valida las credenciales
3. useUsuarioStore.login(usuario) guarda los datos
4. Zustand persiste automáticamente
5. Router navega a "(tabs)"

USO DENTRO DE LA APP:
──────────────────────
1. Acceder a datos: useUsuarioStore((s) => s.email)
2. Modificar datos: setNombreVisible("nuevo nombre")
3. Cambiar tema: toggleTema()
4. Los cambios se aplican globalmente
5. Todo se persiste automáticamente

LOGOUT:
───────
1. useUsuarioStore.logout() limpia todos los datos
2. Zustand actualiza AsyncStorage
3. Router redirige a "Auth/loginPage"
4. Usuario vuelve a ver la pantalla de login
*/
