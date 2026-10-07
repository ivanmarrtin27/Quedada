/** Stub Nitro para Expo Go (react-native-iap lo importa al cargar). */
module.exports = {
  __esModule: true,
  NitroModules: {
    createHybridObject() {
      throw new Error('NitroModules stub: no disponible en Expo Go');
    },
  },
  isNitroReady() {
    return false;
  },
};
