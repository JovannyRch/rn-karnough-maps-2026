import useStore from "@/app/store";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

const ResultRow = () => {
  const { t } = useTranslation();
  const { vectorResult } = useStore();

  if (vectorResult.length === 0) {
    return null;
  }

  return (
    <View style={styles.resultContainer}>
      <View style={styles.headerPill}>
        <Text style={styles.headerText}>{t("result.minimumResult")}</Text>
      </View>
      <View style={styles.resultVector}>
        {vectorResult.map((item, index) => (
          <Text key={index} style={{ ...styles.resultItem, ...item.style }}>
            {item.value}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E8CC",
    shadowColor: "#96BC7C",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  headerPill: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF8DE",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  headerText: {
    color: "#3A7F1A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  resultVector: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  resultItem: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1C2A1A",
  },
});

export default ResultRow;
