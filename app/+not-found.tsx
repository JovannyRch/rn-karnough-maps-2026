import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t("notFound.title") }} />
      <View style={styles.container}>
        <Text style={styles.title}>{t("notFound.message")}</Text>
        <Text style={styles.link}>{t("notFound.hint")}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F7FBF2",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C2A1A",
    textAlign: "center",
  },
  link: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#1CB0F6",
  },
});
