import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  addBtn: {
    marginBottom: 10,
  },
  empty: {
    marginTop: 6,
    fontSize: 13,
  },
  list: {
    gap: 8,
  },
  row: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pressed: { opacity: 0.85 },
  rowInfo: { flex: 1, paddingRight: 8 },
  code: { fontSize: 14, fontWeight: "700" },
  desc: { fontSize: 12, marginTop: 2 },
  delete: { fontSize: 12, fontWeight: "600" },
  closeBtn: { marginTop: 12 },
});
