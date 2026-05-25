// src/services/adMobService.ts

import Constants from 'expo-constants';

type MobileAdsModule = {
  default?: () => {
    initialize: () => Promise<unknown>;
  };
};

let isInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

/**
 * Detects whether the app is running inside Expo Go.
 *
 * react-native-google-mobile-ads requires a native module.
 * It will NOT work in Expo Go unless you create a custom dev build / EAS build.
 */
const isExpoGo = (): boolean => {
  return Constants.appOwnership === 'expo';
};

/**
 * Initializes Google Mobile Ads safely.
 *
 * This function is intentionally defensive because react-native-google-mobile-ads
 * crashes in Expo Go or in a native binary that was built before the AdMob plugin
 * was added.
 */
export const initializeAdMob = async (): Promise<boolean> => {
  if (isInitialized) {
    return true;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      if (isExpoGo()) {
        console.warn(
          'AdMob initialization skipped: react-native-google-mobile-ads does not run in Expo Go. Use an EAS/dev build to test AdMob.'
        );
        return false;
      }

      const mobileAdsModule: MobileAdsModule = await import(
        'react-native-google-mobile-ads'
      );

      const mobileAds = mobileAdsModule.default;

      if (typeof mobileAds !== 'function') {
        console.warn(
          'AdMob initialization skipped: Google Mobile Ads native module is not available in this build.'
        );
        return false;
      }

      await mobileAds().initialize();

      isInitialized = true;
      console.log('AdMob initialized successfully.');
      return true;
    } catch (error) {
      console.warn('AdMob initialization skipped', error);
      return false;
    }
  })();

  return initializationPromise;
};

/**
 * Returns whether AdMob has successfully initialized in this runtime session.
 */
export const getAdMobInitialized = (): boolean => {
  return isInitialized;
};

/**
 * Test banner ad unit IDs.
 *
 * Replace these with production ad unit IDs only for a real release build.
 */
export const TEST_AD_UNIT_IDS = {
  androidBanner: 'ca-app-pub-3940256099942544/6300978111',
  iosBanner: 'ca-app-pub-3940256099942544/2934735716',
};

/**
 * Reads the banner ad unit ID from env when available.
 * Falls back to Google test IDs so assessment builds do not expose real secrets.
 */
export const getBannerAdUnitId = (): string => {
  const platform = Constants.platform;

  const androidAdUnitId =
    process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID ||
    TEST_AD_UNIT_IDS.androidBanner;

  const iosAdUnitId =
    process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID ||
    TEST_AD_UNIT_IDS.iosBanner;

  if (platform?.ios) {
    return iosAdUnitId;
  }

  return androidAdUnitId;
};