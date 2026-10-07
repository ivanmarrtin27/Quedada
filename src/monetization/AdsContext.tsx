import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { Alert, Platform } from 'react-native';
import { APP_NAME } from '../constants/app';
import {
  ADS_REMOVED_STORAGE_KEY,
  INTERSTITIAL_COOLDOWN_MS,
  LAST_INTERSTITIAL_STORAGE_KEY,
  REMOVE_ADS_PRICE_LABEL,
  REMOVE_ADS_PRODUCT_ID,
} from './adUnits';
import { getAdsModule, getInterstitialUnitId, isAdsNativeAvailable, isExpoGo } from './nativeAds';

type AdsContextValue = {
  ready: boolean;
  adsRemoved: boolean;
  adsSupported: boolean;
  iapSupported: boolean;
  purchasing: boolean;
  productPriceLabel: string;
  showInterstitialIfNeeded: () => Promise<void>;
  buyRemoveAds: () => Promise<void>;
  restorePurchases: () => Promise<void>;
};

const AdsContext = createContext<AdsContextValue | null>(null);

type IapApi = typeof import('react-native-iap');

function loadIap(): IapApi | null {
  // Solo en builds EAS con flag nativo (Expo Go usa stubs / no IAP real).
  if (isExpoGo() || Platform.OS === 'web') return null;
  if (process.env.EXPO_PUBLIC_NATIVE_MONETIZATION !== '1') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-iap') as IapApi;
  } catch {
    return null;
  }
}

function getPurchaseProductId(purchase: { productId?: string; id?: string }): string | undefined {
  return purchase.productId ?? purchase.id;
}

export function AdsProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [productPriceLabel, setProductPriceLabel] = useState(REMOVE_ADS_PRICE_LABEL);
  const [iapConnected, setIapConnected] = useState(false);

  const lastShownAt = useRef(0);
  const loadingAd = useRef(false);
  const interstitialRef = useRef<{
    loaded: boolean;
    load: () => void;
    show: () => Promise<void>;
    addAdEventListener: (event: string, cb: () => void) => () => void;
  } | null>(null);

  const iapRef = useRef<IapApi | null>(null);
  const adsSupported = isAdsNativeAvailable();
  const iapSupported =
    Platform.OS === 'android' &&
    !isExpoGo() &&
    process.env.EXPO_PUBLIC_NATIVE_MONETIZATION === '1';

  const persistAdsRemoved = useCallback(async (value: boolean) => {
    setAdsRemoved(value);
    await AsyncStorage.setItem(ADS_REMOVED_STORAGE_KEY, value ? '1' : '0');
  }, []);

  const grantRemoveAds = useCallback(async () => {
    await persistAdsRemoved(true);
    interstitialRef.current = null;
  }, [persistAdsRemoved]);

  const preloadInterstitial = useCallback(() => {
    if (!adsSupported || adsRemoved) return;
    const ads = getAdsModule();
    const unitId = getInterstitialUnitId();
    if (!ads || !unitId || loadingAd.current) return;

    loadingAd.current = true;
    const interstitial = ads.InterstitialAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: true,
    });
    interstitialRef.current = interstitial as typeof interstitialRef.current;

    const unsubLoaded = interstitial.addAdEventListener(ads.AdEventType.LOADED, () => {
      loadingAd.current = false;
    });
    const unsubError = interstitial.addAdEventListener(ads.AdEventType.ERROR, () => {
      loadingAd.current = false;
      interstitialRef.current = null;
    });
    const unsubClosed = interstitial.addAdEventListener(ads.AdEventType.CLOSED, () => {
      interstitialRef.current = null;
      loadingAd.current = false;
      preloadInterstitial();
    });

    interstitial.load();

    return () => {
      unsubLoaded();
      unsubError();
      unsubClosed();
    };
  }, [adsRemoved, adsSupported]);

  useEffect(() => {
    let cancelled = false;
    let purchaseSub: { remove: () => void } | undefined;
    let errorSub: { remove: () => void } | undefined;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(ADS_REMOVED_STORAGE_KEY);
        if (!cancelled && stored === '1') setAdsRemoved(true);

        const last = await AsyncStorage.getItem(LAST_INTERSTITIAL_STORAGE_KEY);
        if (last) lastShownAt.current = Number(last) || 0;

        const ads = getAdsModule();
        if (ads && Platform.OS !== 'web') {
          try {
            await ads.default().initialize();
            await ads.default().setRequestConfiguration({
              maxAdContentRating: ads.MaxAdContentRating.MA,
              tagForChildDirectedTreatment: false,
              tagForUnderAgeOfConsent: false,
            });
          } catch {
            // Expo Go / missing native module
          }
        }

        const iap = loadIap();
        iapRef.current = iap;
        if (iap && Platform.OS === 'android') {
          try {
            await iap.initConnection();
            if (cancelled) return;
            setIapConnected(true);

            purchaseSub = iap.purchaseUpdatedListener(async (purchase) => {
              const sku = getPurchaseProductId(purchase);
              if (sku !== REMOVE_ADS_PRODUCT_ID) return;
              try {
                await iap.finishTransaction({ purchase, isConsumable: false });
                await grantRemoveAds();
              } catch {
                // ignore finish errors after grant attempt
              }
            });

            errorSub = iap.purchaseErrorListener(() => {
              setPurchasing(false);
            });

            const products = await iap.fetchProducts({
              skus: [REMOVE_ADS_PRODUCT_ID],
              type: 'in-app',
            });
            if (!cancelled && Array.isArray(products)) {
              const product = products.find(
                (p) => (p as { id?: string }).id === REMOVE_ADS_PRODUCT_ID,
              ) as { displayPrice?: string } | undefined;
              if (product?.displayPrice) setProductPriceLabel(product.displayPrice);
            }

            const available = await iap.getAvailablePurchases();
            if (!cancelled && Array.isArray(available)) {
              const owned = available.find(
                (p) => getPurchaseProductId(p) === REMOVE_ADS_PRODUCT_ID,
              );
              if (owned) {
                try {
                  await iap.finishTransaction({ purchase: owned, isConsumable: false });
                } catch {
                  // already finished
                }
                await grantRemoveAds();
              }
            }
          } catch {
            setIapConnected(false);
          }
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
      purchaseSub?.remove();
      errorSub?.remove();
      const iap = iapRef.current;
      if (iap && Platform.OS === 'android') {
        void iap.endConnection().catch(() => undefined);
      }
    };
  }, [grantRemoveAds]);

  useEffect(() => {
    if (!ready || adsRemoved || !adsSupported) return;
    return preloadInterstitial();
  }, [ready, adsRemoved, adsSupported, preloadInterstitial]);

  const showInterstitialIfNeeded = useCallback(async () => {
    if (adsRemoved || !adsSupported) return;
    const now = Date.now();
    if (now - lastShownAt.current < INTERSTITIAL_COOLDOWN_MS) return;

    const interstitial = interstitialRef.current;
    if (!interstitial?.loaded) {
      preloadInterstitial();
      return;
    }

    try {
      await interstitial.show();
      lastShownAt.current = now;
      await AsyncStorage.setItem(LAST_INTERSTITIAL_STORAGE_KEY, String(now));
    } catch {
      interstitialRef.current = null;
      preloadInterstitial();
    }
  }, [adsRemoved, adsSupported, preloadInterstitial]);

  const buyRemoveAds = useCallback(async () => {
    if (adsRemoved) {
      Alert.alert('Ya estás sin anuncios', `Esta instalación ya tiene ${APP_NAME} sin anuncios.`);
      return;
    }

    const iap = iapRef.current;
    if (!iapSupported || !iap || !iapConnected) {
      Alert.alert(
        'Compra no disponible',
        'Las compras in-app requieren un build nativo (EAS Preview/Production), no Expo Go. Crea el producto remove_ads (1,99 €) en Play Console y prueba en un APK firmado.',
      );
      return;
    }

    setPurchasing(true);
    try {
      await iap.fetchProducts({ skus: [REMOVE_ADS_PRODUCT_ID], type: 'in-app' });
      await iap.requestPurchase({
        request: {
          google: { skus: [REMOVE_ADS_PRODUCT_ID] },
          apple: { sku: REMOVE_ADS_PRODUCT_ID },
        },
        type: 'in-app',
      });
      // Entitlement se aplica en purchaseUpdatedListener
    } catch (e) {
      const message = e instanceof Error ? e.message : 'No se pudo iniciar la compra.';
      if (!/cancel|Cancel|UserCancelled|E_USER_CANCELLED/i.test(message)) {
        Alert.alert('Compra', message);
      }
    } finally {
      setPurchasing(false);
    }
  }, [adsRemoved, iapConnected, iapSupported]);

  const restorePurchases = useCallback(async () => {
    const iap = iapRef.current;
    if (!iapSupported || !iap || !iapConnected) {
      Alert.alert(
        'Restaurar no disponible',
        'Necesitas un build de Play (EAS). Si ya compraste con tu cuenta de Google, al abrir la app firmada se restaurará.',
      );
      return;
    }

    setPurchasing(true);
    try {
      await iap.restorePurchases();
      const available = await iap.getAvailablePurchases();
      const owned = Array.isArray(available)
        ? available.find((p) => getPurchaseProductId(p) === REMOVE_ADS_PRODUCT_ID)
        : undefined;

      if (!owned) {
        Alert.alert(
          'Sin compras',
          'No encontramos “Quitar anuncios” en esta cuenta de Google Play.',
        );
        return;
      }

      try {
        await iap.finishTransaction({ purchase: owned, isConsumable: false });
      } catch {
        // ok
      }
      await grantRemoveAds();
      Alert.alert('Restaurado', 'Anuncios desactivados de nuevo.');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'No se pudo restaurar.';
      Alert.alert('Restaurar', message);
    } finally {
      setPurchasing(false);
    }
  }, [grantRemoveAds, iapConnected, iapSupported]);

  const value = useMemo<AdsContextValue>(
    () => ({
      ready,
      adsRemoved,
      adsSupported,
      iapSupported: iapSupported && iapConnected,
      purchasing,
      productPriceLabel,
      showInterstitialIfNeeded,
      buyRemoveAds,
      restorePurchases,
    }),
    [
      ready,
      adsRemoved,
      adsSupported,
      iapSupported,
      iapConnected,
      purchasing,
      productPriceLabel,
      showInterstitialIfNeeded,
      buyRemoveAds,
      restorePurchases,
    ],
  );

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export function useAds() {
  const ctx = useContext(AdsContext);
  if (!ctx) throw new Error('useAds must be used within AdsProvider');
  return ctx;
}
