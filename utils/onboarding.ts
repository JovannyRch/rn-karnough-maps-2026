import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_SEEN_KEY = "@onboarding_seen_v1";

export const hasSeenOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY);
    return value === "true";
  } catch (error) {
    console.error("Error reading onboarding state:", error);
    return false;
  }
};

export const markOnboardingSeen = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "true");
  } catch (error) {
    console.error("Error saving onboarding state:", error);
  }
};
