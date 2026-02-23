import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";
import { Linking, Platform } from "react-native";

const REVIEW_COMPLETED_EXERCISES_KEY = "@review_completed_exercises";
const REVIEW_REQUESTED_ONCE_KEY = "@review_requested_once";

const getAndroidPackageName = () =>
  Constants.expoConfig?.android?.package ?? Constants.manifest2?.extra?.expoClient?.android?.package;

const getIosAppStoreId = () => process.env.EXPO_PUBLIC_IOS_APP_STORE_ID;

export const requestInAppReview = async (): Promise<boolean> => {
  if (await StoreReview.isAvailableAsync()) {
    await StoreReview.requestReview();
    return true;
  }

  if (Platform.OS === "android") {
    const packageName = getAndroidPackageName();
    if (!packageName) {
      return false;
    }

    const marketUrl = `market://details?id=${packageName}`;
    const webUrl = `https://play.google.com/store/apps/details?id=${packageName}`;

    try {
      await Linking.openURL(marketUrl);
      return true;
    } catch {
      await Linking.openURL(webUrl);
      return true;
    }
  }

  if (Platform.OS === "ios") {
    const appStoreId = getIosAppStoreId();
    if (!appStoreId) {
      return false;
    }

    await Linking.openURL(`itms-apps://itunes.apple.com/app/id${appStoreId}?action=write-review`);
    return true;
  }

  return false;
};

export const incrementCompletedExercises = async (): Promise<number> => {
  try {
    const rawCount = await AsyncStorage.getItem(REVIEW_COMPLETED_EXERCISES_KEY);
    const nextCount = (rawCount ? Number(rawCount) || 0 : 0) + 1;
    await AsyncStorage.setItem(REVIEW_COMPLETED_EXERCISES_KEY, String(nextCount));
    return nextCount;
  } catch (error) {
    console.log("Failed incrementing completed exercises", error);
    return 0;
  }
};

export const getCompletedExercisesCount = async (): Promise<number> => {
  try {
    const rawCount = await AsyncStorage.getItem(REVIEW_COMPLETED_EXERCISES_KEY);
    return rawCount ? Number(rawCount) || 0 : 0;
  } catch (error) {
    console.log("Failed reading completed exercises count", error);
    return 0;
  }
};

export const hasRequestedReviewBefore = async (): Promise<boolean> => {
  try {
    const rawRequested = await AsyncStorage.getItem(REVIEW_REQUESTED_ONCE_KEY);
    return rawRequested === "1";
  } catch (error) {
    console.log("Failed reading review requested flag", error);
    return false;
  }
};

export const requestInAppReviewOnce = async (): Promise<boolean> => {
  try {
    if (!__DEV__) {
      const alreadyRequested = await hasRequestedReviewBefore();
      if (alreadyRequested) {
        return false;
      }
    }

    const opened = await requestInAppReview();
    if (opened && !__DEV__) {
      await AsyncStorage.setItem(REVIEW_REQUESTED_ONCE_KEY, "1");
    }
    return opened;
  } catch (error) {
    console.log("Failed requesting in-app review once", error);
    return false;
  }
};
