import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { initializeI18n } from "@/i18n";
import { hasSeenOnboarding } from "@/utils/onboarding";
import GridScreen from "./GridScreen";
import HistoryScreen from "./HistoryScreen";
import OnboardingScreen from "./OnboardingScreen";
import ProScreen from "./ProScreen";
import ResultScreen from "./ResultScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const AppNavigator = ({ showOnboarding }: { showOnboarding: boolean }) => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName={showOnboarding ? "OnboardingScreen" : "GridScreen"}
    >
      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={() => ({
          headerShown: false,
          gestureEnabled: false,
          animation: "fade",
        })}
      />
      <Stack.Screen
        name="GridScreen"
        component={GridScreen}
        options={() => ({
          title: t("navigation.appTitle"),
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="ResultScreen"
        component={ResultScreen}
        options={() => ({
          headerShown: false,
          animation: "fade_from_bottom",
          gestureEnabled: true,
          presentation: "card",
        })}
      />
      <Stack.Screen
        name="ProScreen"
        component={ProScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={() => ({
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          presentation: "card",
        })}
      />
    </Stack.Navigator>
  );
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    void initializeI18n()
      .then(() => setIsI18nReady(true))
      .catch((error) => {
        console.error("Error initializing translations:", error);
        setIsI18nReady(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded || !isI18nReady) {
      return;
    }

    (async () => {
      const seenOnboarding = await hasSeenOnboarding();
      setShowOnboarding(!seenOnboarding);
      SplashScreen.hideAsync();
    })();
  }, [isI18nReady, loaded]);

  if (!loaded || !isI18nReady || showOnboarding === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator showOnboarding={showOnboarding} />
    </GestureHandlerRootView>
  );
}
