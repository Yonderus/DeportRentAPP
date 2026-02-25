import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  pressed: { opacity: 0.85 },
  avatar: { marginRight: 12 },
  avatarText: { fontWeight: "800", color: "white" },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "800" },
  secondary: { fontSize: 13, marginTop: 2 },
  chevron: { fontSize: 28, fontWeight: "900", marginLeft: 8 },
});
