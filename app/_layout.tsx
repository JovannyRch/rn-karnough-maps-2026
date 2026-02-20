import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import GridScreen from "./GridScreen";

import { hasSeenOnboarding } from "@/utils/onboarding";
import HistoryScreen from "./HistoryScreen";
import OnboardingScreen from "./OnboardingScreen";
import ProScreen from "./ProScreen";
import ResultScreen from "./ResultScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    (async () => {
      const seenOnboarding = await hasSeenOnboarding();
      setShowOnboarding(!seenOnboarding);
      SplashScreen.hideAsync();
    })();
  }, [loaded]);

  if (!loaded || showOnboarding === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          options={({ navigation }) => ({
            title: "K-Maps",
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
    </GestureHandlerRootView>
  );
}
