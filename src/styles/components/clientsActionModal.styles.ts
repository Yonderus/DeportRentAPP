import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontWeight: "800",
    marginBottom: 10,
  },
  line: {
    marginTop: 6,
  },
  row: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
