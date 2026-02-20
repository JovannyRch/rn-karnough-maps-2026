import {
  addAdListener,
  createInterstitialAd,
  createRewardedAd,
  hasBannerModule,
  hasInterstitialModule,
  hasMobileAdsCore,
  hasRewardedModule,
  initializeMobileAds,
} from "./mobileAds";

export const hasAdMobCoreModule = hasMobileAdsCore;
export const hasAdMobBannerModule = hasBannerModule;
export const hasAdMobInterstitialModule = hasInterstitialModule;
export const hasAdMobRewardedModule = hasRewardedModule;
export {
  addAdListener,
  createInterstitialAd,
  createRewardedAd,
  initializeMobileAds,
};
