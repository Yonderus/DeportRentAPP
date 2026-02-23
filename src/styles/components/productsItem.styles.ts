import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pressed: { opacity: 0.85 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  thumbPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbText: {
    fontSize: 11,
    fontWeight: "700",
  },
  info: { flex: 1, paddingRight: 8 },
  name: { fontSize: 15, fontWeight: "700" },
  secondary: { fontSize: 12, marginTop: 3 },
  priceBox: { alignItems: "flex-end" },
  price: { fontSize: 13, fontWeight: "700" },
});
