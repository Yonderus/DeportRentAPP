import { usuarios, User } from "../app/types/types";

export interface LoginResult {
  success: boolean;
  message: string;
  usuario?: User;
}

export const validarLogin = (
  email: string,
  password: string
): LoginResult => {
  // Validar que los campos no estén vacíos
  if (!email || !email.trim()) {
    return {
      success: false,
      message: "El email es obligatorio",
    };
  }

  if (!password || !password.trim()) {
    return {
      success: false,
      message: "La contraseña es obligatoria",
    };
  }

  // Buscar usuario por email
  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );

  if (!usuario) {
    return {
      success: false,
      message: "Email o contraseña incorrectos",
    };
  }

  // Validar contraseña
  if (usuario.password !== password) {
    return {
      success: false,
      message: "Email o contraseña incorrectos",
    };
  }

  // Login exitoso
  return {
    success: true,
    message: "Login exitoso",
    usuario: usuario,
  };
};
