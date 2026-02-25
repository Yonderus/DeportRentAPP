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
    maxHeight: "88%",
  },
  contentScroll: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingBottom: 4,
  },
  title: {
    fontWeight: "800",
    marginBottom: 12,
  },
  imageWrapper: {
    width: "100%",
    height: 240,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: "700",
  },
  descriptionTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  descriptionBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 72,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  priceTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  priceBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  priceLine: {
    fontSize: 15,
    fontWeight: "700",
  },
  priceLineSecondary: {
    fontSize: 13,
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
  actionButton: {
    borderRadius: 14,
  },
});
