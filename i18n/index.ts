import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import {
  AppLanguage,
  resources,
  supportedLanguages,
} from "./resources";

const LANGUAGE_STORAGE_KEY = "@app_language";
const DEFAULT_LANGUAGE: AppLanguage = "es";
const i18n = createInstance();

let initializationPromise: Promise<void> | null = null;

const isSupportedLanguage = (value: string): value is AppLanguage =>
  supportedLanguages.includes(value as AppLanguage);

const normalizeLanguage = (value?: string | null): AppLanguage | null => {
  if (!value) {
    return null;
  }

  const languageCode = value.split("-")[0].toLowerCase();
  return isSupportedLanguage(languageCode) ? languageCode : null;
};

const getInitialLanguage = async (): Promise<AppLanguage> => {
  try {
    const storedLanguage = normalizeLanguage(
      await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
    );
    if (storedLanguage) {
      return storedLanguage;
    }
  } catch (error) {
    console.error("Error reading language preference:", error);
  }

  return normalizeLanguage(getLocales()[0]?.languageCode) ?? DEFAULT_LANGUAGE;
};

export const initializeI18n = (): Promise<void> => {
  if (i18n.isInitialized) {
    return Promise.resolve();
  }

  if (!initializationPromise) {
    initializationPromise = getInitialLanguage()
      .then(async (language) => {
        await i18n.use(initReactI18next).init({
          resources,
          lng: language,
          fallbackLng: DEFAULT_LANGUAGE,
          supportedLngs: supportedLanguages,
          interpolation: {
            escapeValue: false,
          },
          react: {
            useSuspense: false,
          },
        });
      })
      .catch((error) => {
        initializationPromise = null;
        throw error;
      });
  }

  return initializationPromise;
};

export const getCurrentLanguage = (): AppLanguage =>
  normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? DEFAULT_LANGUAGE;

export const changeAppLanguage = async (
  language: AppLanguage,
): Promise<void> => {
  await i18n.changeLanguage(language);

  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error("Error saving language preference:", error);
  }
};

export const getCurrentLocale = (): string =>
  getCurrentLanguage() === "en" ? "en-US" : "es-MX";

export default i18n;
