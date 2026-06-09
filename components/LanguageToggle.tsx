import { DUO } from "@/constants/duoTheme";
import {
  changeAppLanguage,
  getCurrentLanguage,
} from "@/i18n";
import {
  AppLanguage,
  supportedLanguages,
} from "@/i18n/resources";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { useTranslation } from "react-i18next";

export const LanguageToggle = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = getCurrentLanguage();
  const languageName = t(`common.languages.${currentLanguage}`);
  const languageCodes: Record<AppLanguage, string> = {
    es: "ES",
    en: "EN",
    pt: "PT",
    fr: "FR",
    de: "DE",
    it: "IT",
    ja: "JA",
    ko: "KO",
    "zh-CN": "CN",
    "zh-TW": "TW",
  };

  const handleLanguageChange = (language: AppLanguage) => {
    setIsOpen(false);
    void changeAppLanguage(language);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(
          "common.languageSelector.accessibilityLabel",
          { language: languageName },
        )}
        accessibilityHint={t("common.languageSelector.accessibilityHint")}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.label}>
          {languageCodes[currentLanguage]}
        </Text>
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
        transparent
        visible={isOpen}
      >
        <Pressable
          accessibilityLabel={t("common.languageSelector.close")}
          accessibilityRole="button"
          onPress={() => setIsOpen(false)}
          style={styles.backdrop}
        >
          <Pressable
            accessibilityRole="none"
            onPress={(event) => event.stopPropagation()}
            style={styles.dialog}
          >
            <Text style={styles.title}>
              {t("common.languageSelector.title")}
            </Text>

            <ScrollView
              contentContainerStyle={styles.options}
              showsVerticalScrollIndicator
              style={styles.optionsScroll}
            >
              {supportedLanguages.map((language) => {
                const isSelected = language === currentLanguage;

                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    key={language}
                    onPress={() => handleLanguageChange(language)}
                    style={({ pressed }) => [
                      styles.option,
                      isSelected && styles.optionSelected,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionCode,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {languageCodes[language]}
                    </Text>
                    <Text
                      style={[
                        styles.optionName,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {t(`common.languages.${language}`)}
                    </Text>
                    <Text
                      accessibilityElementsHidden
                      importantForAccessibility="no"
                      style={styles.checkmark}
                    >
                      {isSelected ? "✓" : ""}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(28, 42, 26, 0.45)",
  },
  dialog: {
    width: "100%",
    maxWidth: 360,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DUO.borderStrong,
    backgroundColor: DUO.card,
  },
  title: {
    marginBottom: 14,
    color: DUO.ink,
    fontSize: 20,
    fontWeight: "900",
  },
  options: {
    gap: 8,
  },
  optionsScroll: {
    maxHeight: 520,
  },
  option: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.bg,
  },
  optionSelected: {
    borderColor: DUO.blue,
    backgroundColor: "#E8F7FE",
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionCode: {
    width: 38,
    color: DUO.blueDark,
    fontSize: 12,
    fontWeight: "900",
  },
  optionName: {
    flex: 1,
    color: DUO.ink,
    fontSize: 16,
    fontWeight: "700",
  },
  optionTextSelected: {
    color: DUO.blueDark,
  },
  checkmark: {
    width: 24,
    color: DUO.blueDark,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "right",
  },
});
