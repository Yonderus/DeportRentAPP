# Solución - Sistema de Autenticación con Context API y Zustand

## 📋 Resumen de cambios

Este proyecto implementa un sistema de autenticación completo siguiendo los requisitos del ejercicio:

### ✅ Requerimientos cumplidos

1. **Context API para autenticación** ✓
   - Archivo: `src/context/AuthContext.tsx`
   - Controla el flujo de login/logout
   - Gestiona la restauración de sesión al iniciar

2. **Zustand store para datos del usuario** ✓
   - Archivo: `src/stores/useUsuarioStore.tsx`
   - Almacena: id, email, nombreVisible, rol
   - Métodos: login(), logout(), setNombreVisible()
   - Persiste automáticamente en AsyncStorage

3. **Persistencia de sesión** ✓
   - Zustand con middleware `persist`
   - AsyncStorage para almacenamiento
   - Restauración automática al reiniciar la app

4. **Navegación protegida** ✓
   - Login: Solo accesible para no autenticados
   - Tabs: Solo accesibles para autenticados
   - Redirección automática según estado

5. **Pantalla de Perfil** ✓
   - Muestra: email, rol, nombre visible
   - Permite editar nombre visible
   - Botón de logout

6. **Pantalla de Preferencias** ✓
   - Cambio de tema (claro/oscuro)
   - Almacenamiento persistente de tema
   - Aplicación global en toda la app

## 📁 Estructura de archivos

```
src/
├── app/
│   ├── _layout.tsx                  # Root layout con AuthProvider
│   ├── Auth/
│   │   └── loginPage.tsx           # Pantalla de login
│   └── (tabs)/
│       ├── _layout.tsx              # Protección de rutas
│       ├── perfil/
│       │   └── index.tsx           # Pantalla de perfil (editable)
│       └── preferencias/
│           └── index.tsx           # Pantalla de preferencias
├── context/
│   └── AuthContext.tsx             # Context de autenticación
├── stores/
│   ├── useUsuarioStore.tsx         # Store del usuario (Zustand)
│   └── usePreferenciasStore.tsx    # Store de preferencias (Zustand)
├── services/
│   └── authService.tsx             # Validación de credenciales
└── types/
    └── types.ts                    # Tipos e interfaces
```

## 🔐 Flujo de autenticación

```
App inicia
    ↓
AuthProvider restaura sesión desde AsyncStorage
    ↓
¿Usuario autenticado?
    ├─ SÍ → Mostrar Tabs (Home, Pedidos, Clientes, Perfil)
    └─ NO → Mostrar Login
        ↓
    Usuario ingresa credenciales
        ↓
    authService.validarLogin() valida
        ↓
    useUsuarioStore.login() guarda estado
        ↓
    Zustand persiste en AsyncStorage
        ↓
    Navega a Tabs
```

## 👤 Credenciales de prueba

```
Email: admin@alquilerapp.com
Password: admin123

Email: operario1@alquilerapp.com
Password: operario123
```

## 🎨 Gestión de estado

### AuthContext (Context API)
- Control de sesión
- Restauración automática
- Estado de carga

### useUsuarioStore (Zustand)
```typescript
{
  id: string | null,
  email: string | null,
  nombreVisible: string | null,
  rol: "NORMAL" | "ADMIN",
  isLoggedIn: boolean,
  
  // Métodos
  login(usuario)
  logout()
  setNombreVisible(nombre)
}
```

### useTemaStore (Zustand)
```typescript
{
  tema: "claro" | "oscuro",
  
  // Métodos
  toggleTema()
}
```

## 💾 Persistencia

**AsyncStorage** almacena automáticamente:
- Estado del usuario (usuario-storage)
- Preferencia de tema (TEMA_APP)

Los datos se restauran automáticamente al reiniciar la app.

## 🛡️ Protección de rutas

1. **Root Layout**: AuthProvider envuelve toda la app
2. **Tabs Layout**: Verifica isLoggedIn, redirige a login si es necesario
3. **Pantalla de Perfil**: Redirige a login si no está autenticado

## 📝 Funcionalidades destacadas

### Perfil de usuario
- Ver información básica (email, rol)
- Editar nombre visible en tiempo real
- Botones: Editar/Guardar/Cancelar
- Acceso a preferencias mediante ícono engranaje
- Logout con limpieza de datos

### Preferencias
- Switch para cambiar tema claro/oscuro
- Cambios aplicados globalmente
- Persistencia automática
- Colores dinámicos según tema

### Temas soportados
- **Claro**: Fondo blanco, texto oscuro
- **Oscuro**: Fondo oscuro, texto claro
- Colores de acento personalizados

## 🚀 Próximas mejoras recomendadas

1. Integración con Supabase para autenticación real
2. React Query para gestión de datos del servidor
3. Validación más robusta de credenciales
4. Recuperación de contraseña
5. Autenticación con redes sociales
6. Biometría (huella, Face ID)

## ✨ Conclusión

Este sistema proporciona una base sólida para una aplicación de autenticación con:
- ✅ Separación clara entre Context (sesión) y Zustand (datos)
- ✅ Persistencia automática
- ✅ Navegación protegida
- ✅ UI intuitiva con temas personalizables
- ✅ Fácil de extender con Supabase y React Query
