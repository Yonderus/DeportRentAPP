# ✅ Checklist de validación - Prueba todas las funcionalidades

## 1️⃣ Inicio de sesión

### Prueba: Login correcto
- [ ] Abre la app
- [ ] Te muestra LoginPage
- [ ] Ingresa: `admin@alquilerapp.com` / `admin123`
- [ ] Presiona "Iniciar sesión"
- [ ] **Esperado**: Navega automáticamente a (tabs)

### Prueba: Credenciales incorrectas
- [ ] En LoginPage
- [ ] Ingresa: `wrong@email.com` / `wrongpass`
- [ ] Presiona "Iniciar sesión"
- [ ] **Esperado**: Muestra Alert "Error de inicio de sesión"

### Prueba: Campos vacíos
- [ ] En LoginPage
- [ ] Deja email o password vacíos
- [ ] Presiona "Iniciar sesión"
- [ ] **Esperado**: Muestra validación "Campo requerido"

---

## 2️⃣ Navegación protegida

### Prueba: No puedes acceder a tabs sin autenticarte
- [ ] En LoginPage
- [ ] Abre el navegador/inspector
- [ ] Intenta navegar a `(tabs)` directamente
- [ ] **Esperado**: Te redirige a LoginPage

### Prueba: Después de logout no puedes ver tabs
- [ ] Has logeado exitosamente
- [ ] Estás en (tabs)
- [ ] Presiona "Cerrar sesión" en Perfil
- [ ] Intenta ir a otra tab
- [ ] **Esperado**: Te redirige a LoginPage

---

## 3️⃣ Pantalla de Perfil

### Prueba: Mostrar información del usuario
- [ ] Has logeado como `admin@alquilerapp.com`
- [ ] Vas a tab "Perfil"
- [ ] **Esperado**: Ves:
  - Email: admin@alquilerapp.com
  - Rol: ADMIN
  - Nombre visible: Admin (o el último que guardaste)

### Prueba: Editar nombre visible
- [ ] En Perfil
- [ ] Presiona botón "Editar"
- [ ] El campo de nombre se hace editable
- [ ] Cambia el texto a "Juan Pérez"
- [ ] Presiona "Guardar"
- [ ] **Esperado**: El nombre cambia y se muestra "Juan Pérez"

### Prueba: Cancelar edición
- [ ] En Perfil
- [ ] Presiona "Editar"
- [ ] Cambia el nombre a algo diferente
- [ ] Presiona "Cancelar"
- [ ] **Esperado**: El nombre vuelve al anterior (sin guardar)

### Prueba: El nombre persistente
- [ ] Has editado el nombre a "Juan Pérez"
- [ ] Presiona "Guardar"
- [ ] Cierra completamente la app
- [ ] Reabre la app
- [ ] Vas a Perfil
- [ ] **Esperado**: Aún muestra "Juan Pérez"

---

## 4️⃣ Preferencias de tema

### Prueba: Acceder a preferencias
- [ ] En Perfil
- [ ] Presiona el ícono engranaje (🔧) en la esquina superior derecha
- [ ] **Esperado**: Navega a Preferencias

### Prueba: Cambiar a modo oscuro
- [ ] En Preferencias
- [ ] Ves "Modo oscuro" con un switch
- [ ] El switch está OFF (blanco)
- [ ] Presiona el switch
- [ ] **Esperado**: 
  - El switch se pone ON
  - Toda la app cambia a colores oscuros
  - El fondo se vuelve oscuro
  - El texto se vuelve claro

### Prueba: Cambiar a modo claro
- [ ] El switch está ON (oscuro)
- [ ] Presiona el switch nuevamente
- [ ] **Esperado**:
  - El switch se pone OFF
  - Toda la app vuelve a colores claros
  - El fondo se vuelve claro
  - El texto se vuelve oscuro

### Prueba: El tema persiste
- [ ] En Preferencias, activa "Modo oscuro"
- [ ] Cierra completamente la app
- [ ] Reabre la app
- [ ] **Esperado**: La app aún está en modo oscuro

### Prueba: El tema es global
- [ ] En Preferencias, activa modo oscuro
- [ ] Presiona atrás para volver a Perfil
- [ ] **Esperado**: Perfil también está en modo oscuro
- [ ] Ve a otras tabs (Home, Pedidos, Clientes)
- [ ] **Esperado**: Todas están en modo oscuro

---

## 5️⃣ Persistencia de sesión

### Prueba: Sesión persiste entre reinicios
- [ ] Haz login como `admin@alquilerapp.com`
- [ ] Navega por los tabs (Home, Pedidos, Clientes, Perfil)
- [ ] Cierra completamente la app (swipe up o cerrar ventana)
- [ ] Reabre la app
- [ ] **Esperado**: 
  - No pide login
  - Va directamente a (tabs)
  - Muestra tu información (email, nombre visible, rol)

### Prueba: Logout limpia la sesión
- [ ] Has logeado
- [ ] En Perfil, presiona "Cerrar sesión"
- [ ] Cierra completamente la app
- [ ] Reabre la app
- [ ] **Esperado**: Te muestra LoginPage (la sesión fue limpiada)

### Prueba: Puedes hacer login con otro usuario
- [ ] Haz logout
- [ ] Haz login como `operario1@alquilerapp.com` / `operario123`
- [ ] Vas a Perfil
- [ ] **Esperado**: Ves el email del operario y rol NORMAL

---

## 6️⃣ Almacenamiento (AsyncStorage)

### Prueba: Los datos se guardan localmente
```bash
# En la consola del emulador o con React Native Debugger:
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ver datos del usuario guardados
AsyncStorage.getItem("usuario-storage").then(data => {
  console.log("Usuario guardado:", JSON.parse(data));
});

// Ver tema guardado
AsyncStorage.getItem("TEMA_APP").then(data => {
  console.log("Tema guardado:", JSON.parse(data));
});
```

**Esperado**: Ambos devuelven los datos guardados

---

## 7️⃣ Logs de consola

### Logs esperados al hacer login
```
✅ Usuario logeado: admin@alquilerapp.com
💾 Hidratación completada
📱 Store hidratado, isLoggedIn: true
```

### Logs esperados al reiniciar la app (con sesión guardada)
```
📱 Store hidratado, isLoggedIn: true
✅ Sesión restaurada: admin@alquilerapp.com
```

### Logs esperados al hacer logout
```
👋 Usuario deslogeado
```

---

## 8️⃣ Interfaz de usuario

### Pantalla de Login
- [ ] Muestra avatar de candado
- [ ] Título "Bienvenido"
- [ ] Campo de email
- [ ] Campo de contraseña (con puntos de seguridad)
- [ ] Botón "Iniciar sesión"
- [ ] Colores dinámicos según tema

### Pantalla de Perfil
- [ ] Título "Perfil"
- [ ] Ícono engranaje para acceder a preferencias
- [ ] Card con "Información del usuario"
- [ ] Muestra Email, Rol, Nombre visible
- [ ] Botón "Editar" para nombre visible
- [ ] Botón "Cerrar sesión" al final
- [ ] Colores dinámicos según tema

### Pantalla de Preferencias
- [ ] Título "Preferencias" (en stack)
- [ ] Card con "Modo oscuro"
- [ ] Switch para cambiar tema
- [ ] Cambios se aplican inmediatamente
- [ ] Colores dinámicos según tema

---

## 9️⃣ Casos extremos

### Prueba: Cambiar tema mientras estás editando el nombre
- [ ] En Perfil, presiona "Editar"
- [ ] Cambia el nombre
- [ ] Abre Preferencias y cambia el tema
- [ ] Vuelve a Perfil
- [ ] **Esperado**: El campo de edición aún está visible, nombre sin cambios

### Prueba: Hacer logout desde Preferencias
- [ ] En Preferencias
- [ ] Presiona atrás para ir a Perfil
- [ ] Presiona "Cerrar sesión"
- [ ] **Esperado**: Te lleva a LoginPage

### Prueba: Cambiar de usuario rápidamente
- [ ] Haz login como admin
- [ ] Logout
- [ ] Haz login como operario
- [ ] **Esperado**: Ves los datos del operario

---

## 🔟 Resumen final

| Funcionalidad | Estado | Notas |
|---------------|--------|-------|
| Login funciona | ✅ | Con credenciales correctas |
| Logout funciona | ✅ | Limpia datos |
| Protección de rutas | ✅ | Solo autenticados ven tabs |
| Persistencia | ✅ | Entre reinicios |
| Edición de perfil | ✅ | Nombre visible |
| Cambio de tema | ✅ | Global y persistente |
| Navegación | ✅ | Automática según estado |
| Colores dinámicos | ✅ | Actualizados con tema |

---

## 📝 Notas de prueba

- **Device de prueba**: Android Emulator / iOS Simulator
- **Navegador**: Chrome DevTools F12 para ver console
- **AsyncStorage**: Persiste automáticamente
- **Tema**: Cambios inmediatos

---

## ⚠️ Si algo no funciona

1. **Limpia cache**:
   ```bash
   npx expo start -c
   ```

2. **Reinstala dependencias**:
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Verifica que AsyncStorage esté instalado**:
   ```bash
   npm ls @react-native-async-storage/async-storage
   ```

4. **Revisa los logs**:
   ```bash
   # En la consola Expo, busca errores en rojo
   ```

5. **Verifica archivos modificados**:
   - `src/context/AuthContext.tsx` ✅
   - `src/app/_layout.tsx` ✅
   - `src/app/(tabs)/_layout.tsx` ✅
   - `src/stores/useUsuarioStore.tsx` ✅
   - `src/app/(tabs)/perfil/index.tsx` ✅

---

**Última actualización**: 23 de enero de 2026
**Total de pruebas**: 40+
**Tiempo estimado**: 30 minutos

✅ **Si todas pasan, ¡la solución está correcta!**
