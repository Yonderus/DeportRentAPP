// Servicios de autenticación y perfil (Supabase).
// Aquí centralizamos llamadas a Auth y a la tabla profiles para mantener
// un único punto de acceso y evitar lógica duplicada en componentes.
import { supabase } from "../lib/supabaseClient";

export interface LoginResult {
  success: boolean;
  message: string;
}

// Login con email/contraseña usando Supabase Auth.
// Retorna un objeto simple para mostrar mensajes en UI.
export const loginWithPassword = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  if (!email || !email.trim()) {
    return { success: false, message: "El email es obligatorio" };
  }

  if (!password || !password.trim()) {
    return { success: false, message: "La contraseña es obligatoria" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim(),
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Login exitoso" };
};

// Cerrar sesión en Supabase.
// Limpia tokens de la sesión actual en el cliente.
export const logoutSession = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

// Actualiza el usuario de Auth (solo email / metadata).
// Cambiar email puede requerir confirmación por correo.
export const updateUserProfile = async (data: {
  nombreVisible?: string;
  email?: string;
}) => {
  const { error } = await supabase.auth.updateUser({
    email: data.email,
    data: data.nombreVisible ? { nombreVisible: data.nombreVisible } : undefined,
  });

  if (error) {
    throw new Error(error.message);
  }
};

// Obtiene el registro del usuario en la tabla profiles.
// Si no existe (o RLS lo impide) se devuelve null.
export const getProfileByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data;
};

// Actualiza campos en profiles según la columna disponible.
// Esto permite adaptarse a distintas nomenclaturas de columnas
// (nombre_visible, full_name, etc.) sin romper la app.
export const updateProfileFieldsForUser = async (
  userId: string,
  data: { nombreVisible?: string; email?: string }
) => {
  if (!data.nombreVisible && !data.email) return;

  const profile = await getProfileByUserId(userId);
  if (!profile) return;

  const nameFields = ["nombre_visible", "nombreVisible", "nombre", "full_name", "name"];
  const emailFields = ["email", "correo", "mail"];

  const updates: Record<string, string> = {};

  if (data.nombreVisible) {
    const nameField = nameFields.find((f) => Object.prototype.hasOwnProperty.call(profile, f));
    if (nameField) updates[nameField] = data.nombreVisible;
  }

  if (data.email) {
    const emailField = emailFields.find((f) => Object.prototype.hasOwnProperty.call(profile, f));
    if (emailField) updates[emailField] = data.email;
  }

  if (Object.keys(updates).length === 0) return;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
};
