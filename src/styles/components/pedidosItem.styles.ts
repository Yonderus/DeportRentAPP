import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  pressed: { opacity: 0.85 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  codigo: { fontSize: 16, fontWeight: "800" },
  estadoBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  estadoText: { fontSize: 12, fontWeight: "700" },
  cliente: { marginTop: 6, fontSize: 14, fontWeight: "600" },
  fechas: { marginTop: 4, fontSize: 13 },
  tipo: { marginTop: 4, fontSize: 12 },
});
