import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#ffffff40",
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  welcomeText: {
    color: "#ffffffcc",
    fontSize: 14,
    fontWeight: "500",
  },
  userName: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 2,
  },
  userEmail: {
    color: "#ffffffcc",
    fontSize: 14,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff30",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start",
    gap: 6,
  },
  roleText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  roleInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    overflow: "hidden",
    position: "relative",
  },
  heroDecorTop: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 90,
    right: -60,
    top: -70,
    opacity: 0.15,
  },
  heroDecorBottom: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 80,
    left: -40,
    bottom: -60,
    opacity: 0.12,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  heroIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 6,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  heroHighlights: {
    marginTop: 12,
    gap: 8,
  },
  heroHighlightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroHighlightText: {
    fontSize: 13,
    flex: 1,
  },
  heroActions: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },
  heroStatsGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  heroImageSection: {
    marginTop: 14,
  },
  heroImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
  },
  heroImagePlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 6,
  },
  heroImagePlaceholderText: {
    fontSize: 13,
    textAlign: "center",
  },
  heroImageActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  heroImageBtn: {
    borderRadius: 10,
  },
  heroStatCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  heroStatLabel: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },
  heroPrimaryBtn: {
    flex: 1,
  },
  heroSecondaryBtn: {
    flex: 1,
    borderWidth: 1,
  },
  roleInfoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  activityCard: {
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  activityMainText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activitySubText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  menuGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },
  menuCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  adminPanel: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  adminHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  adminText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
