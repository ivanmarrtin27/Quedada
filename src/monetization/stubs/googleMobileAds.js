/**
 * Stub para Expo Go / `expo start`.
 * En builds EAS con EXPO_PUBLIC_NATIVE_MONETIZATION=1 Metro usa el paquete real.
 */

const MaxAdContentRating = { G: 'G', PG: 'PG', T: 'T', MA: 'MA' };

const TestIds = {
  INTERSTITIAL: 'test-interstitial',
  BANNER: 'test-banner',
  REWARDED: 'test-rewarded',
  APP_OPEN: 'test-app-open',
};

const AdEventType = {
  LOADED: 'loaded',
  ERROR: 'error',
  OPENED: 'opened',
  CLOSED: 'closed',
  CLICKED: 'clicked',
};

function createStubInterstitial() {
  return {
    loaded: false,
    load() {},
    async show() {},
    addAdEventListener() {
      return () => {};
    },
  };
}

const InterstitialAd = {
  createForAdRequest() {
    return createStubInterstitial();
  },
};

function mobileAds() {
  return {
    async initialize() {
      return [];
    },
    async setRequestConfiguration() {},
  };
}

mobileAds.MaxAdContentRating = MaxAdContentRating;

module.exports = {
  __esModule: true,
  default: mobileAds,
  MobileAds: mobileAds,
  MaxAdContentRating,
  TestIds,
  AdEventType,
  InterstitialAd,
};
