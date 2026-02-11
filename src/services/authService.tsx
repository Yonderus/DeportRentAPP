// Servicios de autenticación y perfil (Supabase).
// Aquí centralizamos llamadas a Auth y a la tabla profiles para mantener
// un único punto de acceso y evitar lógica duplicada en componentes.
import { supabase } from "../lib/supabaseClient";
import Constants from "expo-constants";
import { decode } from "base64-arraybuffer";

const AVATAR_BUCKET = "imagenes-de-perfil";
const DEFAULT_AVATAR_EXT = "jpg";

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
  const payload: { email?: string; data?: Record<string, string> } = {};
  const emailRedirectTo = Constants.expoConfig?.extra?.emailRedirectTo as string | undefined;

  if (data.email) {
    payload.email = data.email;
  }

  if (data.nombreVisible) {
    payload.data = { nombreVisible: data.nombreVisible };
  }

  if (Object.keys(payload).length === 0) {
    return { user: null, emailPending: false };
  }

  // Si ya hay un cambio de email pendiente, no volvemos a pedir otro.
  if (payload.email) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      throw new Error(userError.message);
    }
    const pendingEmail = (userData?.user as any)?.new_email as string | undefined;
    if (pendingEmail) {
      return { user: userData?.user ?? null, emailPending: true };
    }
  }

  const { data: result, error } = await supabase.auth.updateUser(
    payload,
    payload.email && emailRedirectTo ? { emailRedirectTo } : undefined
  );

  if (error) {
    throw new Error(error.message);
  }

  const user = result?.user ?? null;
  const newEmail = (user as any)?.new_email as string | undefined;
  const emailPending = !!newEmail && newEmail !== user?.email;

  return { user, emailPending };
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

// Guarda el path del avatar en la tabla profiles.
export const updateAvatarPathForUser = async (
  userId: string,
  avatarPath: string
) => {
  if (!avatarPath) return;

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_path: avatarPath })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
};

const getFileExtensionFromUri = (uri: string) => {
  const cleanUri = uri.split("?")[0];
  const dotIndex = cleanUri.lastIndexOf(".");
  if (dotIndex === -1) return DEFAULT_AVATAR_EXT;
  return cleanUri.substring(dotIndex + 1).toLowerCase();
};

const getContentTypeFromExtension = (ext: string) => {
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
    case "heif":
      return "image/heic";
    default:
      return "image/jpeg";
  }
};

// Sube el avatar a Storage y devuelve el path a guardar en profiles.
export const uploadAvatarForUser = async (
  userId: string,
  base64Data: string,
  options?: { extension?: string; mimeType?: string }
) => {
  if (!userId || !base64Data) {
    throw new Error("Falta userId o los datos base64");
  }

  const rawExtension = options?.extension ?? DEFAULT_AVATAR_EXT;
  const extension = rawExtension.replace(".", "").toLowerCase();
  const contentType = options?.mimeType ?? getContentTypeFromExtension(extension);
  const avatarPath = `users/${userId}/avatar.${extension}`;

  const fileBuffer = decode(base64Data);

  const { error } = await supabase
    .storage
    .from(AVATAR_BUCKET)
    .upload(avatarPath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return avatarPath;
};

// Genera una URL firmada para el avatar almacenado en Supabase Storage.
export const getSignedAvatarUrl = async (
  avatarPath: string,
  expiresInSeconds = 60 * 60
) => {
  if (!avatarPath) return null;

  const { data, error } = await supabase
    .storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(avatarPath, expiresInSeconds);

  if (error) {
    throw new Error(error.message);
  }

  return data?.signedUrl ?? null;
};
