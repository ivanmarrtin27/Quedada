import Constants from 'expo-constants';
import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';
import { INTERSTITIAL_ANDROID_PROD } from './adUnits';

type AdsModule = {
  default: () => {
    initialize: () => Promise<unknown>;
    setRequestConfiguration: (c: unknown) => Promise<unknown>;
  };
  MaxAdContentRating: { MA: string };
  TestIds: { INTERSTITIAL: string };
  AdEventType: { LOADED: string; ERROR: string; CLOSED: string };
  InterstitialAd: {
    createForAdRequest: (
      unitId: string,
      opts?: unknown,
    ) => {
      loaded: boolean;
      load: () => void;
      show: () => Promise<void>;
      addAdEventListener: (event: string, cb: () => void) => () => void;
    };
  };
};

let cached: AdsModule | null | undefined;

export function isExpoGo(): boolean {
  return (
    Constants.appOwnership === 'expo' ||
    (Constants as { executionEnvironment?: string }).executionEnvironment === 'storeClient'
  );
}

function hasAdsTurboModule(): boolean {
  try {
    if (typeof TurboModuleRegistry?.get === 'function') {
      if (TurboModuleRegistry.get('RNGoogleMobileAdsModule') != null) return true;
    }
  } catch {
    // ignore
  }
  return NativeModules.RNGoogleMobileAdsModule != null;
}

/**
 * Native ads only when:
 * - not Expo Go
 * - monetization flag on (EAS) OR turbo module present
 * - and module actually loads
 */
export function isAdsNativeAvailable(): boolean {
  if (Platform.OS === 'web' || isExpoGo()) return false;
  if (process.env.EXPO_PUBLIC_NATIVE_MONETIZATION === '1') return true;
  return hasAdsTurboModule();
}

export function getAdsModule(): AdsModule | null {
  if (cached !== undefined) return cached;
  if (isExpoGo() || Platform.OS === 'web') {
    cached = null;
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cached = require('react-native-google-mobile-ads') as AdsModule;
    // Stub returns a module without real native — treat as unsupported for showing ads
    if (process.env.EXPO_PUBLIC_NATIVE_MONETIZATION !== '1' && !hasAdsTurboModule()) {
      cached = null;
    }
  } catch {
    cached = null;
  }
  return cached;
}

export function getInterstitialUnitId(): string | null {
  const ads = getAdsModule();
  if (!ads) return null;
  if (__DEV__ || !INTERSTITIAL_ANDROID_PROD) {
    return ads.TestIds.INTERSTITIAL;
  }
  return INTERSTITIAL_ANDROID_PROD;
}
