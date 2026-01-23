# 🏗️ Arquitectura de Estado - Guía de Diseño

## Comparación: Context API vs Zustand

### Context API (AuthContext)
**Propósito**: Gestionar el flujo de sesión y autenticación
- Estado: `isLoggedIn`, `isLoading`
- Responsabilidades:
  - ✅ Restaurar sesión al iniciar
  - ✅ Controlar el flujo de autenticación
  - ✅ Envolver toda la aplicación
  - ✅ Manejar la hidratación

**Ventajas**:
- Es el patrón correcto para contexto global
- No necesita librerías externas
- Perfecto para estado que afecta toda la app

**Cuándo usarlo**:
- Estados que se leen pero no cambian frecuentemente
- Control de flujo de la aplicación
- Información global de sesión

### Zustand (useUsuarioStore)
**Propósito**: Almacenar y gestionar datos del usuario
- Estado: `id`, `email`, `nombreVisible`, `rol`
- Responsabilidades:
  - ✅ Guardar datos del usuario autenticado
  - ✅ Permitir modificaciones (setNombreVisible)
  - ✅ Persistir en AsyncStorage
  - ✅ Proveedor de datos accesible desde cualquier componente

**Ventajas**:
- Performance (no causa re-renders innecesarios)
- API simple y limpia
- DevTools para debugging
- Middleware para persistencia

**Cuándo usarlo**:
- Estados que cambian frecuentemente
- Datos que se acceden desde múltiples componentes
- Estado que requiere persistencia

## Flujo de datos

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICACIÓN REACT NATIVE                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   AuthProvider   │ ← Context API
                    │  (sesión global) │
                    └────────┬─────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
┌──────────────────┐                  ┌──────────────────┐
│  useAuth()       │                  │ useUsuarioStore()│ ← Zustand
│ (componentes)    │                  │ (datos usuario)  │
│ {               │                  │ {               │
│  isLoggedIn,    │                  │  id,             │
│  isLoading      │                  │  email,          │
│ }               │                  │  nombreVisible,  │
└────────┬────────┘                  │  rol,            │
         │                           │  login(),        │
         └──────────────┬────────────┤  logout(),       │
                        │            │  setNombreVisible│
                        ▼            │ }               │
                  ┌─────────────┐    └────────┬────────┘
                  │AsyncStorage │             │
                  │ (persisten.)│             │
                  └─────────────┘             │
                                    ┌────────▼────────┐
                                    │ AsyncStorage    │
                                    │ (persistencia)  │
                                    └─────────────────┘
```

## Ejemplos de uso en componentes

### Scenario 1: Verificar si usuario está autenticado
```tsx
import { useAuth } from "../context/AuthContext";

function ProtectedComponent() {
  const { isLoggedIn, isLoading } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  if (!isLoggedIn) return null; // Será redirigido por layout
  
  return <YourComponent />;
}
```

### Scenario 2: Mostrar datos del usuario
```tsx
import { useUsuarioStore } from "../stores/useUsuarioStore";

function UserProfile() {
  const { email, nombreVisible, rol } = useUsuarioStore();
  
  return (
    <View>
      <Text>{email}</Text>
      <Text>{nombreVisible}</Text>
      <Text>{rol}</Text>
    </View>
  );
}
```

### Scenario 3: Modificar datos del usuario
```tsx
import { useUsuarioStore } from "../stores/useUsuarioStore";

function EditProfile() {
  const { setNombreVisible } = useUsuarioStore();
  
  const handleSave = (newName) => {
    setNombreVisible(newName); // Se persiste automáticamente
    Alert.alert("Guardado", "Datos actualizados");
  };
  
  return <EditForm onSave={handleSave} />;
}
```

### Scenario 4: Logout
```tsx
import { useUsuarioStore } from "../stores/useUsuarioStore";
import { useRouter } from "expo-router";

function LogoutButton() {
  const { logout } = useUsuarioStore();
  const router = useRouter();
  
  const handleLogout = () => {
    logout(); // Limpia estado
    router.replace("Auth/loginPage"); // Redirige
  };
  
  return <Button onPress={handleLogout}>Logout</Button>;
}
```

## Antipatrones y errores comunes

### ❌ INCORRECTO: Guardar todo en Context
```tsx
// NO HAGAS ESTO
const AuthContext = create((set) => ({
  user: { id, email, rol }, // ← Datos que cambian frecuente
  todos: [],                  // ← Datos que se actualizan mucho
  // Esto causa re-renders de toda la app
}));
```

### ✅ CORRECTO: Separar contexto y estado
```tsx
// Context para sesión (poco frecuente)
<AuthProvider>
  {/* Zustand para datos (cambios frecuentes) */}
</AuthProvider>
```

### ❌ INCORRECTO: No usar store para datos compartidos
```tsx
// NO HAGAS ESTO
function ComponenteA() {
  const [user, setUser] = useState(null); // Local
  return <ComponenteB user={user} />;
}

// Esto obliga a pasar props hacia abajo
```

### ✅ CORRECTO: Usar Zustand para datos compartidos
```tsx
// CORRECTO
function ComponenteA() {
  const user = useUsuarioStore((s) => s.user);
  return <ComponenteB />;
}

function ComponenteB() {
  const user = useUsuarioStore((s) => s.user); // Acceso directo
  return null;
}
```

## Persistencia automática

### Flujo de hidratación (rehydration)

```
1. App inicia
         │
         ▼
2. Zustand intenta leer AsyncStorage
         │
         ├─ SI hay datos guardados → Restaurar estado
         │
         └─ NO hay datos → Usar valores por defecto
         │
         ▼
3. onRehydrateStorage() se ejecuta
         │
         ▼
4. Componentes se renderizan con estado restaurado
```

### Verificar persistencia

```tsx
// En useUsuarioStore
persist(
  (set) => ({...}),
  {
    name: "usuario-storage",
    storage: createJSONStorage(() => AsyncStorage),
    onRehydrateStorage: () => (state) => {
      // Se ejecuta cuando AsyncStorage termina de cargar
      if (state) {
        console.log("✅ Usuario restaurado:", state.email);
      }
    },
  }
)
```

## Migración futura a Supabase + React Query

### Estructura recomendada para el futuro

```tsx
// Context API → Mantener igual
export const AuthContext = create(() => ({
  session: null,
  loading: true,
}));

// Zustand con React Query
export const useUsuarioStore = create(() => ({
  user: null, // Datos en caché
  setUser: (user) => set({ user }),
}));

// React Query para sincronizar servidor
const { data: user } = useQuery({
  queryKey: ["user"],
  queryFn: () => supabase.auth.getUser(),
});
```

## Checklist de implementación

- ✅ AuthContext creado y envolviendo la app
- ✅ useUsuarioStore con persist middleware
- ✅ AsyncStorage configurado
- ✅ Navegación protegida en tabs layout
- ✅ Login persiste sesión
- ✅ Logout limpia datos
- ✅ Edición de perfil guarda cambios
- ✅ Tema persiste y se aplica globalmente
- ✅ No hay re-renders innecesarios
- ✅ Documentación completa

## Referencias

- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo Router Documentation](https://expo.github.io/router/)
- [Context API - React Docs](https://react.dev/reference/react/useContext)
