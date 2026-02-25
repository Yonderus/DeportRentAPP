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
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    marginBottom: 12,
  },
  selector: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: "600",
  },
  selectorSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  selectorPressed: {
    opacity: 0.8,
  },
  row: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  estadoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  estadoButton: {
    marginRight: 6,
    marginBottom: 6,
  },
  selectorCard: {
    borderRadius: 16,
    padding: 16,
    maxHeight: "70%",
  },
  selectorList: {
    marginTop: 8,
  },
  selectorItem: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
