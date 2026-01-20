import { StyleSheet, View, Text } from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { PaperProvider } from "react-native-paper";
import { config } from "@gluestack-ui/config";

export default function Index() {
  return (
   <Text>Index Screen</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkgrey",
  },
});
