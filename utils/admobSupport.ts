import {
  addAdListener,
  createInterstitialAd,
  createRewardedAd,
  createRewardedInterstitialAd,
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
  createRewardedInterstitialAd,
  initializeMobileAds,
};
