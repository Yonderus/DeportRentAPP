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
    fontWeight: "800",
    marginBottom: 10,
  },
  input: {
    marginTop: 10,
  },
  row: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
    marginBottom: 6,
  },
  imagePreview: {
    width: 54,
    height: 54,
    borderRadius: 10,
  },
});
