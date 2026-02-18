import React, { createContext, useContext, useEffect, useState } from "react";
// Cliente Supabase para escuchar cambios de sesión.
// Esto permite reaccionar automáticamente a login/logout.
import { supabase } from "../lib/supabaseClient";
// Store global de usuario (Zustand), fuente única del estado de auth en UI.
import { useUsuarioStore } from "../stores/useUsuarioStore";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useUsuarioStore((state) => state.isLoggedIn);
  const setFromSession = useUsuarioStore((state) => state.setFromSession);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Cargar la sesión actual de Supabase al iniciar la app.
      // Si hay sesión, el store quedará poblado y la UI navegará a (tabs).
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      await setFromSession(data.session);
      setIsLoading(false);
    };

    init();

    // Suscribirse a cambios de sesión (login/logout).
    // Cualquier cambio actualiza el store y mantiene la UI sincronizada.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await setFromSession(session);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
}
