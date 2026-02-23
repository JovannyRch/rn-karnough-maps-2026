import { NativeModules, UIManager } from "react-native";
import mobileAds, {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAdEventType,
  RewardedAd,
  RewardedInterstitialAd,
} from "react-native-google-mobile-ads";

type AdSubscription = {
  remove: () => void;
};

type FullScreenAd = {
  addEventListener: (
    event: "adLoaded" | "adDismissed" | "adFailedToLoad" | "earnedReward",
    handler: (...args: any[]) => void,
  ) => AdSubscription;
  load: () => Promise<void> | void;
  show: () => Promise<void>;
};

type GoogleAdLike = Partial<FullScreenAd> & {
  addAdEventListener?: (...args: any[]) => () => void;
};

const noopSubscription: AdSubscription = { remove: () => {} };

const hasGoogleBannerNative = Boolean(
  UIManager.getViewManagerConfig?.("RNGoogleMobileAdsBannerView") ||
  UIManager.getViewManagerConfig?.("GoogleMobileAdsBannerView"),
);
const hasGoogleCoreNative = Boolean(NativeModules.RNGoogleMobileAdsModule);

const mapEventForGoogle = (
  event: "adLoaded" | "adDismissed" | "adFailedToLoad" | "earnedReward",
) => {
  switch (event) {
    case "adLoaded":
      return AdEventType.LOADED;
    case "adDismissed":
      return AdEventType.CLOSED;
    case "adFailedToLoad":
      return AdEventType.ERROR;
    case "earnedReward":
      return RewardedAdEventType.EARNED_REWARD;
    default:
      return event;
  }
};

const adaptFullScreenAd = (ad: GoogleAdLike | null): FullScreenAd | null => {
  if (!ad) {
    return null;
  }

  const addNativeListener = ad.addAdEventListener;
  if (
    typeof ad.addEventListener !== "function" &&
    typeof addNativeListener === "function"
  ) {
    ad.addEventListener = (
      event: "adLoaded" | "adDismissed" | "adFailedToLoad" | "earnedReward",
      handler: (...args: any[]) => void,
    ) => {
      const unsubscribe = addNativeListener(mapEventForGoogle(event), handler);
      return { remove: unsubscribe };
    };
  }

  if (typeof ad.load !== "function") {
    ad.load = () => {};
  }

  if (typeof ad.show !== "function") {
    ad.show = async () => {};
  }

  return ad as FullScreenAd;
};

export const hasBannerModule = hasGoogleBannerNative;

export const hasInterstitialModule = hasGoogleCoreNative;

export const hasRewardedModule = hasGoogleCoreNative;

export const hasMobileAdsCore = hasGoogleCoreNative;

export const initializeMobileAds = async () => {
  await mobileAds().initialize();
};

export const createInterstitialAd = (unitId: string): FullScreenAd | null => {
  if (!hasInterstitialModule) {
    return null;
  }

  return adaptFullScreenAd(InterstitialAd.createForAdRequest(unitId));
};

export const createRewardedAd = (unitId: string): FullScreenAd | null => {
  if (!hasRewardedModule) {
    return null;
  }

  return adaptFullScreenAd(RewardedAd.createForAdRequest(unitId));
};

export const createRewardedInterstitialAd = (
  unitId: string,
): FullScreenAd | null => {
  if (!hasRewardedModule) {
    return null;
  }

  return adaptFullScreenAd(RewardedInterstitialAd.createForAdRequest(unitId));
};

export const getAdaptiveBannerSize = () =>
  BannerAdSize.ANCHORED_ADAPTIVE_BANNER;

export { BannerAd, BannerAdSize };

export const addAdListener = (
  ad: FullScreenAd | null,
  event: "adLoaded" | "adDismissed" | "adFailedToLoad" | "earnedReward",
  handler: (...args: any[]) => void,
): AdSubscription => {
  if (!ad) {
    return noopSubscription;
  }

  try {
    return ad.addEventListener(event, handler);
  } catch {
    return noopSubscription;
  }
};
