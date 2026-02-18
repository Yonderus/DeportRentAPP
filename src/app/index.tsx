import { StyleSheet, View } from "react-native";
import LoginScreen from "./Auth/loginPage";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { PaperProvider } from "react-native-paper";
import { config } from "@gluestack-ui/config";

export default function Index() {
  return (
    <GluestackUIProvider config={config}>
      <PaperProvider>
        <View style={styles.container}>
          <LoginScreen />
        </View>
      </PaperProvider>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkgrey",
  },
});
