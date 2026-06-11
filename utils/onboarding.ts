import AsyncStorage from "@react-native-async-storage/async-storage";

// Bumping the version re-shows the tour once after an update, doubling as a
// "what's new" announcement (v2: step-by-step, circuit variants, ƒ(x), share).
const ONBOARDING_SEEN_KEY = "@onboarding_seen_v2";

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
