import { NativeModules, UIManager } from "react-native";

type AdSubscription = {
  remove: () => void;
};

type FullScreenAd = {
  addEventListener: (
    event: "adLoaded" | "adDismissed" | "adFailedToLoad",
    handler: () => void,
  ) => AdSubscription;
  load: () => Promise<void> | void;
  show: () => Promise<void>;
};

type SupportedProvider = "google" | "legacy" | "none";

const noopSubscription: AdSubscription = { remove: () => {} };

let googleAds: any = null;
let legacyAds: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  googleAds = require("react-native-google-mobile-ads");
} catch {}

if (!googleAds) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    legacyAds = require("@react-native-admob/admob");
  } catch {}
}

export const mobileAdsProvider: SupportedProvider = googleAds
  ? "google"
  : legacyAds
    ? "legacy"
    : "none";

const hasLegacyBannerNative = Boolean(
  UIManager.getViewManagerConfig?.("RNAdMobBannerView"),
);
const hasGoogleBannerNative = Boolean(
  UIManager.getViewManagerConfig?.("RNGoogleMobileAdsBannerView") ||
    UIManager.getViewManagerConfig?.("GoogleMobileAdsBannerView"),
);
const hasLegacyInterstitialNative = Boolean(
  NativeModules.RNAdMobInterstitialAd && NativeModules.RNAdMobEvent,
);
const hasLegacyRewardedNative = Boolean(
  NativeModules.RNAdMobRewardedAd && NativeModules.RNAdMobEvent,
);
const hasGoogleCoreNative = Boolean(NativeModules.RNGoogleMobileAdsModule);

const mapEventForGoogle = (event: "adLoaded" | "adDismissed" | "adFailedToLoad") => {
  if (!googleAds) {
    return event;
  }

  const { AdEventType } = googleAds;
  switch (event) {
    case "adLoaded":
      return AdEventType.LOADED;
    case "adDismissed":
      return AdEventType.CLOSED;
    case "adFailedToLoad":
      return AdEventType.ERROR;
    default:
      return event;
  }
};

const adaptFullScreenAd = (ad: any): FullScreenAd | null => {
  if (!ad) {
    return null;
  }

  if (typeof ad.addEventListener !== "function" && typeof ad.addAdEventListener === "function") {
    ad.addEventListener = (
      event: "adLoaded" | "adDismissed" | "adFailedToLoad",
      handler: () => void,
    ) => {
      const unsubscribe = ad.addAdEventListener(mapEventForGoogle(event), handler);
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

export const hasBannerModule =
  (mobileAdsProvider === "google" && hasGoogleBannerNative) ||
  (mobileAdsProvider === "legacy" && hasLegacyBannerNative);

export const hasInterstitialModule =
  (mobileAdsProvider === "google" && hasGoogleCoreNative) ||
  (mobileAdsProvider === "legacy" && hasLegacyInterstitialNative);

export const hasRewardedModule =
  (mobileAdsProvider === "google" && hasGoogleCoreNative) ||
  (mobileAdsProvider === "legacy" && hasLegacyRewardedNative);

export const hasMobileAdsCore =
  (mobileAdsProvider === "google" && hasGoogleCoreNative) ||
  (mobileAdsProvider === "legacy" && Boolean(NativeModules.RNAdMob));

export const initializeMobileAds = async () => {
  if (mobileAdsProvider === "google" && googleAds?.default) {
    await googleAds.default().initialize();
    return;
  }

  if (mobileAdsProvider === "legacy" && legacyAds?.default?.getInitializationStatus) {
    await legacyAds.default.getInitializationStatus();
  }
};

export const createInterstitialAd = (unitId: string): FullScreenAd | null => {
  if (!hasInterstitialModule) {
    return null;
  }

  if (mobileAdsProvider === "google") {
    return adaptFullScreenAd(googleAds?.InterstitialAd?.createForAdRequest?.(unitId));
  }

  if (mobileAdsProvider === "legacy") {
    return adaptFullScreenAd(legacyAds?.InterstitialAd?.createAd?.(unitId));
  }

  return null;
};

export const createRewardedAd = (unitId: string): FullScreenAd | null => {
  if (!hasRewardedModule) {
    return null;
  }

  if (mobileAdsProvider === "google") {
    return adaptFullScreenAd(googleAds?.RewardedAd?.createForAdRequest?.(unitId));
  }

  if (mobileAdsProvider === "legacy") {
    return adaptFullScreenAd(legacyAds?.RewardedAd?.createAd?.(unitId));
  }

  return null;
};

export const createRewardedInterstitialAd = (
  unitId: string,
): FullScreenAd | null => {
  if (!hasRewardedModule) {
    return null;
  }

  if (mobileAdsProvider === "google") {
    return adaptFullScreenAd(
      googleAds?.RewardedInterstitialAd?.createForAdRequest?.(unitId),
    );
  }

  if (mobileAdsProvider === "legacy") {
    return adaptFullScreenAd(
      legacyAds?.RewardedInterstitialAd?.createAd?.(unitId),
    );
  }

  return null;
};

export const BannerAd = googleAds?.BannerAd ?? legacyAds?.BannerAd ?? null;

export const BannerAdSize =
  googleAds?.BannerAdSize ??
  legacyAds?.BannerAdSize ?? {
    ADAPTIVE_BANNER: "ADAPTIVE_BANNER",
    ANCHORED_ADAPTIVE_BANNER: "ANCHORED_ADAPTIVE_BANNER",
  };

export const getAdaptiveBannerSize = () => {
  if (mobileAdsProvider === "google") {
    return BannerAdSize.ANCHORED_ADAPTIVE_BANNER;
  }
  return BannerAdSize.ADAPTIVE_BANNER;
};

export const addAdListener = (
  ad: FullScreenAd | null,
  event: "adLoaded" | "adDismissed" | "adFailedToLoad",
  handler: () => void,
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
