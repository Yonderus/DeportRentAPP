import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  backdropPressable: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    maxHeight: "86%",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  empty: {
    fontSize: 14,
    marginBottom: 8,
  },
  list: {
    maxHeight: 360,
    flexGrow: 0,
  },
  listContent: {
    gap: 10,
    paddingBottom: 4,
  },
  row: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    marginRight: 10,
  },
  thumbPlaceholder: {
    fontSize: 11,
    fontWeight: "700",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
  },
  actionsCol: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 8,
  },
  summary: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 4,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "700",
  },
  clearBtn: {
    marginTop: 12,
  },
  closeBtn: {
    marginTop: 12,
  },
});
