/**
 * Stub IAP para Expo Go. Evita NitroModules.
 */

async function initConnection() {
  return true;
}

async function endConnection() {
  return true;
}

async function fetchProducts() {
  return [];
}

async function getAvailablePurchases() {
  return [];
}

async function requestPurchase() {
  throw new Error('IAP no disponible en Expo Go');
}

async function finishTransaction() {}

async function restorePurchases() {
  return [];
}

function purchaseUpdatedListener() {
  return { remove() {} };
}

function purchaseErrorListener() {
  return { remove() {} };
}

module.exports = {
  __esModule: true,
  initConnection,
  endConnection,
  fetchProducts,
  getAvailablePurchases,
  requestPurchase,
  finishTransaction,
  restorePurchases,
  purchaseUpdatedListener,
  purchaseErrorListener,
  useIAP() {
    return {
      connected: false,
      products: [],
      fetchProducts,
      requestPurchase,
      finishTransaction,
      getAvailablePurchases,
    };
  },
};
