import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  sizes: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
    marginLeft: 12,
  },
  centerState: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
    gap: 12,
  },
  stateText: {
    fontSize: 14,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
