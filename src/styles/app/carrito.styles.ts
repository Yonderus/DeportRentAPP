import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
  listContent: {
    gap: 10,
    paddingBottom: 10,
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
  thumbText: {
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
    marginTop: 6,
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
  confirmBtn: {
    marginTop: 10,
    borderRadius: 12,
  },
});
