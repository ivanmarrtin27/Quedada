/**
 * IDs de AdMob / IAP.
 *
 * Antes del AAB de producción:
 * 1. Crea la app en AdMob y sustituye ADMOB_*_APP_ID en app.json (plugin).
 * 2. Crea unidad interstitial y pega el ID en EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID
 *    o aquí abajo (INTERSTITIAL_ANDROID_PROD).
 * 3. Crea producto no consumible `remove_ads` a 1,99 € en Play Console.
 *
 * En __DEV__ / builds de prueba se usan TestIds de Google automáticamente.
 */

/** SKU de Play Billing (no consumible). */
export const REMOVE_ADS_PRODUCT_ID = 'remove_ads';

/** Precio mostrado en UI (el precio real lo fija Play Console). */
export const REMOVE_ADS_PRICE_LABEL = '1,99 €';

/** Cooldown entre interstitials (ms). ~3 min: monetiza sin saturar. */
export const INTERSTITIAL_COOLDOWN_MS = 3 * 60 * 1000;

/**
 * En Verdades/Retos (sin fin de mazo) mostrar interstitial cada N cartas,
 * no en cada draw.
 */
export const VERDADES_RETOS_AD_EVERY_N_CARDS = 10;

/**
 * Unidad interstitial de producción (Android).
 * Déjala vacía hasta tener el ID real → se usarán TestIds.
 */
export const INTERSTITIAL_ANDROID_PROD =
  process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID?.trim() || '';

export const ADS_REMOVED_STORAGE_KEY = '@quedada/ads_removed';
export const LAST_INTERSTITIAL_STORAGE_KEY = '@quedada/last_interstitial_at';
