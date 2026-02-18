// Polyfill necesario para URL y fetch en React Native.
// Supabase usa fetch/URL internamente y en RN no siempre existen de forma nativa.
import "react-native-url-polyfill/auto";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Credenciales desde app.json -> expo.extra.
// Se cargan en runtime con expo-constants para no hardcodearlas en el código.
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL/Anon Key no configurados. Revisa .env (EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY)"
  );
}

// Cliente Supabase con persistencia de sesión en AsyncStorage.
// Esto mantiene el login entre reinicios de la app y refresca el token automáticamente.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
