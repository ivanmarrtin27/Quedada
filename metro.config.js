const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

/**
 * En Expo Go / `expo start` NO hay AdMob ni IAP nativos.
 * Stubbeamos esos paquetes salvo builds EAS con EXPO_PUBLIC_NATIVE_MONETIZATION=1.
 */
const useNativeMonetization = process.env.EXPO_PUBLIC_NATIVE_MONETIZATION === '1';

const STUBS = {
  'react-native-google-mobile-ads': path.resolve(
    __dirname,
    'src/monetization/stubs/googleMobileAds.js',
  ),
  'react-native-iap': path.resolve(__dirname, 'src/monetization/stubs/iap.js'),
  'react-native-nitro-modules': path.resolve(__dirname, 'src/monetization/stubs/nitro.js'),
};

if (!useNativeMonetization) {
  const previous = config.resolver.resolveRequest;
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (STUBS[moduleName]) {
      return { filePath: STUBS[moduleName], type: 'sourceFile' };
    }
    if (previous) {
      return previous(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  };
}

module.exports = config;
