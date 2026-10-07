# Monetización Quedada — AdMob + quitar anuncios 1,99 €

## Qué hay en el código
- Interstitials al **fin de ronda** (Preferencias, Yo Nunca, Más Probable, revelado Impostor)
- Verdades o Retos: interstitial cada **10 cartas** (no en cada draw)
- Cooldown **~3 min** entre anuncios (evita saturar)
- Compra no consumible `remove_ads` + Restaurar en **Ajustes**
- En Expo Go: la app funciona, pero **anuncios/IAP nativos no** (hace falta EAS)

En Expo Go / `expo start` Metro **stubbea** AdMob e IAP (ver `metro.config.js`) para que no pete.
En EAS (`preview` / `production` / `development`) se pone `EXPO_PUBLIC_NATIVE_MONETIZATION=1` y se usan los SDKs reales.

## 1. AdMob (obligatorio para ingresos)
1. https://admob.google.com → Apps → Añadir app Android  
   Package: `com.proyectospropios.quedada`
2. Copia el **App ID** (`ca-app-pub-XXXX~YYYY`)
3. Crea unidad **Interstitial** → copia el **Ad unit ID** (`ca-app-pub-XXXX/ZZZZ`)
4. Sustituye IDs vía env (recomendado en EAS Environment variables):
   - `EXPO_PUBLIC_ADMOB_ANDROID_APP_ID` → plugin en [`app.config.js`](../app.config.js)
   - `EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID` → [`src/monetization/adUnits.ts`](../src/monetization/adUnits.ts)
5. Sin esas vars: preview puede usar Test IDs; **production falla el build** a propósito.
6. Pon el Ad unit ID en una de estas formas:
   - Variable: `EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID=ca-app-pub-.../...`
   - O en [`src/monetization/adUnits.ts`](../src/monetization/adUnits.ts) → `INTERSTITIAL_ANDROID_PROD`

> Riesgo: AdMob puede limitar apps con contenido sexual explícito. Declara rating adulto y no muestres creatividades +18 en la ficha.

## 2. Play Console — producto IAP (tú)
1. Monetización → Productos → Crear producto **gestionados**
2. ID: `remove_ads` (debe coincidir exactamente)
3. Tipo: **No consumible** / one-time
4. Precio: **1,99 €**
5. Activa el producto
6. Cuenta de comerciante / pagos si Play lo pide
7. License testers: Configuración → License testing → añade tu Gmail

## 3. Build de prueba (EAS)
```bash
npm i -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```
Instala el APK en el móvil. **No uses Expo Go** para probar anuncios/compras.

Dev client (opcional):
```bash
eas build -p android --profile development
npx expo start --dev-client
```

## 4. Checklist de prueba en dispositivo
- [ ] Fin de ronda → sale interstitial de **prueba** (o real si ya pegaste IDs)
- [ ] Cooldown ~3 min: dos fines de ronda seguidos no spamean anuncio
- [ ] Verdades/Retos: anuncio solo cada ~10 cartas (y si pasó el cooldown)
- [ ] Ajustes → Quitar anuncios → flujo de compra (license tester)
- [ ] Tras comprar, no vuelven anuncios
- [ ] Restaurar compras en otro wipe / reinstalar con la misma cuenta Google
- [ ] Data safety y ficha marcan **anuncios = sí** + IAP

## 5. Producción
```bash
eas build -p android --profile production
```
Si faltan las vars de AdMob reales, el build **se cancela** (ver `app.config.js`). No subas un AAB con Test IDs.
