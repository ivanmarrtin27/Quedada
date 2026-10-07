const appJson = require('./app.json');

const TEST_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const TEST_IOS_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

const androidAppId =
  process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID?.trim() || TEST_ANDROID_APP_ID;
const iosAppId = process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID?.trim() || TEST_IOS_APP_ID;

const isProductionProfile = process.env.EAS_BUILD_PROFILE === 'production';
const usingTestAppId = androidAppId === TEST_ANDROID_APP_ID;
const interstitial = process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID?.trim() || '';

if (isProductionProfile && (usingTestAppId || !interstitial)) {
  throw new Error(
    '[Quedada] Build production bloqueado: faltan IDs reales de AdMob. ' +
      'Define EXPO_PUBLIC_ADMOB_ANDROID_APP_ID y EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID ' +
      'en EAS (Environment variables → production) y vuelve a lanzar el build.',
  );
}

module.exports = {
  ...appJson,
  'react-native-google-mobile-ads': {
    android_app_id: androidAppId,
    ios_app_id: iosAppId,
  },
  expo: {
    ...appJson.expo,
    plugins: (appJson.expo.plugins || []).map((plugin) => {
      if (Array.isArray(plugin) && plugin[0] === 'react-native-google-mobile-ads') {
        return [
          'react-native-google-mobile-ads',
          {
            androidAppId: androidAppId,
            iosAppId: iosAppId,
          },
        ];
      }
      return plugin;
    }),
    extra: {
      ...(appJson.expo.extra || {}),
      supportEmail: 'ivanmarrtin2703@gmail.com',
      androidPackage: 'com.proyectospropios.quedada',
      eas: {
        ...(appJson.expo.extra?.eas || {}),
        projectId: '33068960-b944-4326-a1e1-62ce5eff98d6',
      },
    },
  },
};
