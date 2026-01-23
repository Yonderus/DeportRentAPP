import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useUsuarioStore } from "../stores/useUsuarioStore";

export default function Index() {
  const router = useRouter();
  const { isLoading } = useAuth();
  const isLoggedIn = useUsuarioStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/Auth/loginPage");
      }
    }
  }, [isLoading, isLoggedIn]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
