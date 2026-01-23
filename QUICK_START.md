# 🚀 Quick Start - Guía rápida de referencia

## En 30 segundos

```
1. Usuario abre app → AuthContext restaura sesión
2. ¿Hay usuario guardado? → Ir a (tabs)
3. ¿No hay usuario? → Ir a Auth/loginPage
4. Login → useUsuarioStore guarda datos → AsyncStorage persiste
5. Logout → useUsuarioStore limpia → AsyncStorage limpia
```

---

## Uso básico en componentes

### Ver si usuario está autenticado
```tsx
import { useAuth } from "../context/AuthContext";

function MiComponente() {
  const { isLoggedIn } = useAuth();
  
  return <Text>{isLoggedIn ? "Autenticado" : "No autenticado"}</Text>;
}
```

### Acceder a datos del usuario
```tsx
import { useUsuarioStore } from "../stores/useUsuarioStore";

function MiComponente() {
  const { email, rol, nombreVisible } = useUsuarioStore();
  
  return <Text>{email} - {rol}</Text>;
}
```

### Cambiar nombre del usuario
```tsx
const { setNombreVisible } = useUsuarioStore();

const handleGuardar = () => {
  setNombreVisible("Juan Pérez"); // ← Se guarda automáticamente
};
```

### Cerrar sesión
```tsx
import { useRouter } from "expo-router";

const { logout } = useUsuarioStore();
const router = useRouter();

const handleLogout = () => {
  logout();
  router.replace("Auth/loginPage");
};
```

### Cambiar tema
```tsx
import { useTemaStore } from "../app/(tabs)/preferencias";

function MiComponente() {
  const { tema, toggleTema } = useTemaStore();
  
  const esOscuro = tema === "oscuro";
  
  return <Switch value={esOscuro} onValueChange={toggleTema} />;
}
```

### Aplicar colores dinámicos
```tsx
import { useTemaStore } from "../app/(tabs)/preferencias";
import { obtenerColores } from "../theme";

function MiComponente() {
  const tema = useTemaStore((s) => s.tema);
  const colores = obtenerColores(tema);
  
  return (
    <View style={{ backgroundColor: colores.fondoPrincipal }}>
      <Text style={{ color: colores.textoPrincipal }}>Texto</Text>
    </View>
  );
}
```

---

## Archivos importantes

| Archivo | Qué hace | Dónde va |
|---------|----------|----------|
| `AuthContext.tsx` | Controla sesión global | `src/context/` |
| `useUsuarioStore.tsx` | Almacena datos del usuario | `src/stores/` |
| `useTemaStore` | Almacena preferencia de tema | `src/app/(tabs)/preferencias/` |
| `authService.tsx` | Valida credenciales | `src/services/` |
| `_layout.tsx` (root) | Envuelve con AuthProvider | `src/app/` |
| `_layout.tsx` (tabs) | Protege rutas | `src/app/(tabs)/` |
| `loginPage.tsx` | Pantalla de login | `src/app/Auth/` |
| `perfil/index.tsx` | Perfil editable | `src/app/(tabs)/perfil/` |
| `preferencias/index.tsx` | Cambio de tema | `src/app/(tabs)/preferencias/` |

---

## Estados del usuario

### Antes de login
```ts
{
  id: null,
  email: null,
  nombreVisible: null,
  rol: null,
  isLoggedIn: false  // ← Redirige a login
}
```

### Después de login
```ts
{
  id: "1",
  email: "admin@alquilerapp.com",
  nombreVisible: "Admin",
  rol: "ADMIN",
  isLoggedIn: true  // ← Navega a tabs
}
```

---

## Credenciales para pruebas

```
👤 Admin
   Email: admin@alquilerapp.com
   Pass:  admin123
   
👤 Operario
   Email: operario1@alquilerapp.com
   Pass:  operario123
```

---

## Flujo de un usuario

```
┌─────────────────────────────────────────────┐
│ 1. App inicia                               │
│    AuthContext intenta cargar sesión        │
└────────────────┬────────────────────────────┘
                 │
    ¿Hay sesión guardada?
                 │
      ┌─────────┴─────────┐
      │                   │
   SÍ │                   │ NO
      ▼                   ▼
  IR A TABS         MOSTRAR LOGIN
      │                   │
      │                   │ Ingresa email/contraseña
      │                   │
      │                   ▼ Presiona "Iniciar sesión"
      │              authService.validarLogin()
      │                   │
      │                   ▼
      │            useUsuarioStore.login()
      │                   │
      │                   ▼
      │            AsyncStorage.setItem()
      │                   │
      │                   ▼
      │              IR A TABS
      │
      └────────────┬─────────┘
                   │
              DENTRO DE TABS
                   │
      ┌────────────┴────────────┐
      │                         │
   Ver Perfil         Acceder a Preferencias
      │                         │
      ▼                         ▼
  - Email              - Toggle tema claro/oscuro
  - Rol                - Se guarda automáticamente
  - Nombre (editable)  - Se aplica globalmente
      │
      ▼ Presiona "Editar"
  Cambiar nombre visible
      │
      ▼ Presiona "Guardar"
  setNombreVisible()
      │
      ▼
  AsyncStorage.setItem()
      │
      ▼ Presiona "Cerrar sesión"
  logout()
      │
      ▼
  AsyncStorage.clear()
      │
      ▼
  VOLVER A LOGIN
```

---

## Checklist de funcionalidades

- ✅ Login con credenciales
- ✅ Logout con limpieza completa
- ✅ Persistencia entre reinicios
- ✅ Protección de rutas
- ✅ Edición de nombre visible
- ✅ Cambio de tema
- ✅ Persistencia de tema
- ✅ Colores dinámicos
- ✅ Navegación automática

---

## Debugging

### Ver logs de autenticación
```bash
# En la consola Expo
npx expo start

# Cuando haces login, verás:
✅ Usuario logeado: admin@alquilerapp.com
💾 Hidratación completada
📱 Store hidratado, isLoggedIn: true
```

### Ver datos guardados en AsyncStorage
```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

// En cualquier componente:
AsyncStorage.getItem("usuario-storage").then(data => {
  console.log("Datos guardados:", JSON.parse(data));
});
```

### Ver logs de cambios de tema
```tsx
const { tema, toggleTema } = useTemaStore();

// Cuando cambias tema:
console.log("Tema ahora es:", tema);
```

---

## Errores comunes

### ❌ "isLoggedIn no cambia después de login"
**Solución**: Asegúrate de usar `useUsuarioStore` en el componente
```tsx
// CORRECTO
const { isLoggedIn } = useUsuarioStore();

// INCORRECTO
const isLoggedIn = useAuth().isLoggedIn; // ← No funciona
```

### ❌ "La sesión no persiste después de cerrar la app"
**Solución**: Verifica que AsyncStorage esté instalado
```bash
npm install @react-native-async-storage/async-storage
```

### ❌ "El tema no se aplica globalmente"
**Solución**: Usa `useTemaStore` en el componente y `obtenerColores()`
```tsx
// CORRECTO
const tema = useTemaStore((s) => s.tema);
const colores = obtenerColores(tema);

// INCORRECTO
const { tema } = useTemaStore(); // ← No funciona, usa función
```

### ❌ "useAuth() dice que no está en AuthProvider"
**Solución**: Verifica que AuthProvider envuelve toda la app en `_layout.tsx`

---

## Próximos pasos

1. **Integrar Supabase Auth**
   - Reemplazar validarLogin() mock
   - Usar credenciales reales

2. **Agregar React Query**
   - Consultas con `useQuery`
   - Mutaciones con `useMutation`

3. **Mejorar validación**
   - Email válido
   - Contraseña fuerte
   - Mensajes de error claros

4. **Agregar recuperación de contraseña**
   - Email de reset
   - Token de validación
   - Nueva contraseña

5. **Agregar autenticación con redes sociales**
   - Google Sign In
   - Apple Sign In
   - GitHub OAuth

---

## Contacto / Soporte

Si hay dudas:
1. Revisa `ARQUITECTURA_ESTADO.md`
2. Revisa `SOLUCION.md`
3. Revisa `README_SOLUCION.md`
4. Revisa EJEMPLOS_USO.tsx

---

**Última actualización**: 23 de enero de 2026
**Versión**: 1.0
**Estado**: ✅ Estable
