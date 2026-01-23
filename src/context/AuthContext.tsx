import React, { createContext, useContext, useEffect, useState } from "react";
import { useUsuarioStore } from "../stores/useUsuarioStore";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useUsuarioStore((state) => state.isLoggedIn);
  const loadFromStorage = useUsuarioStore((state) => state.loadFromStorage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await loadFromStorage();
      setIsLoading(false);
    };
    load();
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
