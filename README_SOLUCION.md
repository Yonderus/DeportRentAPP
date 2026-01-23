# 📱 DeportRentAPP - Sistema de Autenticación

## ✅ Requisitos del ejercicio completados

Este proyecto implementa un sistema de autenticación completo siguiendo los estándares de arquitectura moderna con **Context API** y **Zustand**.

### 1. ✅ Sistema de autenticación con Context API
- **Archivo**: `src/context/AuthContext.tsx`
- **Responsabilidades**:
  - Controla el flujo de login/logout
  - Gestiona el estado de autenticación
  - Restaura la sesión al iniciar la aplicación
  - Envuelve toda la aplicación (`src/app/_layout.tsx`)

### 2. ✅ Store de Zustand para datos del usuario
- **Archivo**: `src/stores/useUsuarioStore.tsx`
- **Almacena**:
  - `id`: Identificador único del usuario
  - `email`: Email del usuario autenticado
  - `nombreVisible`: Nombre mostrable (editable)
  - `rol`: Rol del usuario (NORMAL, ADMIN)
  - `isLoggedIn`: Estado de autenticación

### 3. ✅ Persistencia entre reinicios
- **Tecnología**: AsyncStorage + Zustand persist middleware
- **Comportamiento**: 
  - Los datos se guardan automáticamente al login
  - Se restauran automáticamente al reiniciar
  - Se limpian completamente al logout

### 4. ✅ Navegación protegida
- **No autenticados**: Solo acceso a `/Auth/loginPage`
- **Autenticados**: Acceso a `/` (tabs) con subrutas
- **Redirección automática**: Si intentan acceder sin permisos

### 5. ✅ Pantalla de Perfil
- **Ubicación**: `src/app/(tabs)/perfil/index.tsx`
- **Funcionalidades**:
  - Mostrar email, rol del usuario
  - Editar nombre visible en tiempo real
  - Botón para acceder a preferencias
  - Botón de logout con limpieza completa

### 6. ✅ Pantalla de Preferencias  
- **Ubicación**: `src/app/(tabs)/preferencias/index.tsx`
- **Funcionalidades**:
  - Toggle de tema (claro/oscuro)
  - Persistencia de tema en AsyncStorage
  - Aplicación global automática
  - Almacenado en `useTemaStore` (Zustand)

---

## 🏗️ Arquitectura de estado

```
┌─────────────────────────────────────┐
│    Root Layout (_layout.tsx)        │
│    ├─ AuthProvider (Context API)    │
│    └─ PaperProvider (UI)            │
└────────────────┬────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
   AUTENTICADO      NO AUTENTICADO
        │                 │
        ▼                 ▼
    Tabs Layout     Auth/loginPage
   (protegido)      (público)
```

### Context API: `AuthContext`
```typescript
{
  isLoggedIn: boolean,    // Sesión activa
  isLoading: boolean      // Restaurando persistencia
}
```

### Zustand: `useUsuarioStore`
```typescript
{
  // Estado
  id: string | null,
  email: string | null,
  nombreVisible: string | null,
  rol: "NORMAL" | "ADMIN" | null,
  isLoggedIn: boolean,
  
  // Métodos
  login(usuario: User) → void,
  logout() → void,
  setNombreVisible(nombre: string) → void
}
```

### Zustand: `useTemaStore`
```typescript
{
  tema: "claro" | "oscuro",
  toggleTema() → void
}
```

---

## 🔓 Credenciales de prueba

### Admin
```
Email:    admin@alquilerapp.com
Password: admin123
Rol:      ADMIN
```

### Operario
```
Email:    operario1@alquilerapp.com
Password: operario123
Rol:      NORMAL
```

---

## 📂 Estructura de archivos relevantes

```
src/
├── app/
│   ├── _layout.tsx                    ← Root layout (envuelve AuthProvider)
│   ├── Auth/
│   │   └── loginPage.tsx              ← Formulario de login
│   └── (tabs)/
│       ├── _layout.tsx                ← Protección de rutas
│       ├── index.tsx                  ← Home (tab)
│       ├── pedidos.tsx                ← Pedidos (tab)
│       ├── clientes/                  ← Clientes (tab)
│       ├── perfil/
│       │   ├── index.tsx              ← Perfil (tab) - EDITABLE
│       │   └── preferencias.tsx       ← Acceso a preferencias
│       └── preferencias/
│           └── index.tsx              ← Preferencias (stack modal)
│
├── context/
│   └── AuthContext.tsx                ← Contexto de autenticación
│
├── stores/
│   ├── useUsuarioStore.tsx            ← Store del usuario (Zustand)
│   └── usePreferenciasStore.tsx       ← Store de preferencias (Zustand)
│
├── services/
│   └── authService.tsx                ← Validación de credenciales
│
├── types/
│   └── types.ts                       ← Interfaces y tipos
│
└── theme.ts                           ← Sistema de temas
```

---

## 🔄 Flujo de autenticación

### 1️⃣ Inicio de la aplicación
```
App inicia
  ↓
Root Layout carga AuthProvider
  ↓
Zustand intenta restaurar desde AsyncStorage
  ↓
¿Hay sesión guardada?
  ├─ SÍ:  user.isLoggedIn = true  → Navegar a (tabs)
  └─ NO:  user.isLoggedIn = false → Navegar a Auth/loginPage
```

### 2️⃣ Login
```
Usuario entra email y contraseña
  ↓
Presiona botón "Iniciar sesión"
  ↓
authService.validarLogin() verifica credenciales
  ↓
useUsuarioStore.login(usuario) guarda datos
  ↓
Zustand persiste automáticamente en AsyncStorage
  ↓
Router navega a "(tabs)" automáticamente
```

### 3️⃣ Dentro de la aplicación
```
Componentes pueden acceder a:
  - useUsuarioStore() → Datos del usuario
  - useTemaStore() → Preferencias de tema
  
Cambios se propagan globalmente
  ↓
Zustand actualiza AsyncStorage automáticamente
  ↓
Todos los componentes se re-renderizan si es necesario
```

### 4️⃣ Logout
```
Usuario presiona "Cerrar sesión" en perfil
  ↓
useUsuarioStore.logout() limpia todos los datos
  ↓
AsyncStorage se actualiza (estado vacío)
  ↓
Router redirige a "Auth/loginPage"
  ↓
Usuario ve pantalla de login nuevamente
```

---

## 🎯 Características clave

### ✨ Persistencia automática
```tsx
// Gracias a Zustand persist + AsyncStorage
login(usuario) // → Se guarda automáticamente
logout()       // → Se limpia automáticamente
```

### 🎨 Tema global dinámico
```tsx
const tema = useTemaStore((s) => s.tema);
const colores = obtenerColores(tema);
// Todos los componentes usan los mismos colores
```

### 👤 Edición de perfil
```tsx
// En pantalla de perfil
setNombreVisible("Nuevo nombre")
// Se guarda automáticamente y se aplica en toda la app
```

### 🔐 Protección de rutas
```tsx
// En (tabs)/_layout.tsx
if (!isLoggedIn) {
  router.replace("Auth/loginPage"); // Redirige automáticamente
}
```

---

## 🚀 Cómo ejecutar

### 1. Instalar dependencias
```bash
cd d:\2doDAM\DeportRentAPP
npm install
# o
yarn install
```

### 2. Iniciar el servidor Expo
```bash
npx expo start
```

### 3. Probar en emulador o dispositivo
```bash
# iOS
i

# Android  
a

# Web
w
```

### 4. Flujo de prueba
1. Inicia la app → ves LoginPage
2. Entra credenciales: `admin@alquilerapp.com` / `admin123`
3. Presiona "Iniciar sesión" → vas a (tabs)
4. Abre Perfil → ves tu email, rol, nombre visible
5. Presiona "Editar" → cambia tu nombre
6. Presiona "Cerrar sesión" → vuelves a login
7. Cierra completamente la app
8. Reabre la app → **¡Debería ir directamente a tabs!**

---

## 📚 Archivos de documentación

- **SOLUCION.md** → Resumen ejecutivo de la solución
- **ARQUITECTURA_ESTADO.md** → Diseño arquitectónico detallado
- **README.md** (este archivo) → Guía de uso rápida

---

## 🔮 Próximas mejoras (opcionales)

Para producción, considera:

1. **Supabase Auth** en lugar de mock
   ```tsx
   // En lugar de:
   const usuario = usuarios.find(u => u.email === email);
   
   // Usar:
   const { user } = await supabase.auth.signInWithPassword({ email, password });
   ```

2. **React Query** para datos del servidor
   ```tsx
   const { data: userData } = useQuery(['user'], fetchUserData);
   ```

3. **Validación mejorada**
   - Email válido (regex o librería)
   - Contraseña fuerte
   - Rate limiting

4. **Seguridad**
   - No guardar passwords en el cliente
   - HTTPS obligatorio
   - JWT tokens

5. **UX mejorada**
   - Recordar email del último login
   - Recuperación de contraseña
   - Autenticación de dos factores
   - Biometría

---

## 🤝 Conclusión

Este proyecto demuestra:
- ✅ Uso correcto de Context API para sesión
- ✅ Zustand para estado compartido
- ✅ Persistencia con AsyncStorage
- ✅ Navegación protegida
- ✅ Arquitectura escalable
- ✅ Código limpio y mantenible

**Está listo para ser extendido con Supabase y React Query.**

---

**Última actualización**: 23 de enero de 2026
**Estado**: ✅ Completo y funcional
**Bugs conocidos**: Ninguno
