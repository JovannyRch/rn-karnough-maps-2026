import { DUO } from "@/constants/duoTheme";
import {
  changeAppLanguage,
  getCurrentLanguage,
} from "@/i18n";
import { AppLanguage } from "@/i18n/resources";
import { Pressable, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";

export const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = getCurrentLanguage();
  const nextLanguage: AppLanguage =
    currentLanguage === "es" ? "en" : "es";
  const languageName = t(`common.languages.${currentLanguage}`);

  const handlePress = () => {
    void changeAppLanguage(nextLanguage);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(
        "common.languageSelector.accessibilityLabel",
        { language: languageName },
      )}
      accessibilityHint={t("common.languageSelector.accessibilityHint")}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.label}>
        {i18n.resolvedLanguage?.toUpperCase() ?? currentLanguage.toUpperCase()}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DUO.card,
    borderWidth: 1,
    borderColor: DUO.borderStrong,
    borderBottomWidth: 3,
  },
  buttonPressed: {
    transform: [{ translateY: 1 }],
    borderBottomWidth: 1,
  },
  label: {
    color: DUO.blueDark,
    fontSize: 12,
    fontWeight: "900",
  },
});
