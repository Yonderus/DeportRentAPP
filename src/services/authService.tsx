import { supabase } from "../lib/supabaseClient";

export interface LoginResult {
  success: boolean;
  message: string;
}

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

export const logoutSession = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

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

export const updateProfileNameForUser = async (
  userId: string,
  nombreVisible?: string
) => {
  if (!nombreVisible) return;

  const profile = await getProfileByUserId(userId);
  if (!profile) return;

  const candidateFields = [
    "nombre_visible",
    "nombreVisible",
    "nombre",
    "full_name",
    "name",
  ];

  const field = candidateFields.find((f) => Object.prototype.hasOwnProperty.call(profile, f));
  if (!field) return;

  const { error } = await supabase
    .from("profiles")
    .update({ [field]: nombreVisible })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
};
