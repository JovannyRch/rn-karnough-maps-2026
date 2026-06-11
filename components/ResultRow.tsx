import useStore from "@/app/store";
import { DUO } from "@/constants/duoTheme";
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
    backgroundColor: DUO.card,
    borderWidth: 1,
    borderColor: DUO.border,
    shadowColor: DUO.greenShadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  headerPill: {
    alignSelf: "flex-start",
    backgroundColor: DUO.greenSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  headerText: {
    color: DUO.greenText,
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
    color: DUO.ink,
  },
});

export default ResultRow;
