import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 15, marginTop: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  loadingState: { paddingHorizontal: 16, paddingVertical: 24, alignItems: "center", gap: 12 },
  emptyState: { paddingHorizontal: 16, paddingVertical: 24 },
  emptyText: { fontSize: 14 },
  fab: { position: "absolute", right: 16, bottom: 16 },
});
