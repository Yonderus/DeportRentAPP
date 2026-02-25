import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontWeight: "700",
  },
  card: {
    borderRadius: 12,
  },
  cardContent: {
    gap: 12,
  },
  sectionTitle: {
    fontWeight: "700",
  },
  fieldLabel: {
    marginBottom: 4,
  },
  fieldValue: {
    fontWeight: "500",
  },
  fieldError: {
    marginTop: 6,
  },
  nameInput: {
    marginBottom: 8,
  },
  nameValue: {
    fontWeight: "500",
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  flexOne: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarFallback: {
    backgroundColor: "#ddd",
  },
  summaryInfo: {
    flex: 1,
    gap: 4,
  },
  summaryName: {
    fontWeight: "700",
    fontSize: 16,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  roleText: {
    fontWeight: "600",
  },
  changePhotoButton: {
    alignSelf: "flex-start",
    marginTop: 6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statLabel: {
    fontSize: 12,
  },
  statValue: {
    fontWeight: "700",
  },
  quickActionsTitle: {
    fontWeight: "700",
    marginBottom: 6,
  },
});
