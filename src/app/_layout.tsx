import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          // headerStyle: { backgroundColor: "#0f172a" },
          // headerTintColor: "#ffffff",
          // title: "DeportRentAPP",
        }}
      />
    </PaperProvider>
  );
}
