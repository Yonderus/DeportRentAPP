import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  pressed: { opacity: 0.85 },
  info: { flex: 1, paddingRight: 8 },
  name: { fontSize: 15, fontWeight: "700" },
  secondary: { fontSize: 12, marginTop: 3 },
  priceBox: { alignItems: "flex-end" },
  price: { fontSize: 13, fontWeight: "700" },
});
