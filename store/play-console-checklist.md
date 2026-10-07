# Checklist Google Play Console — Quedada

**Guía completa paso a paso:** [`launch-guide.es.md`](launch-guide.es.md)

Email soporte: `ivanmarrtin2703@gmail.com`  
Package: `com.proyectospropios.quedada`  
Privacidad: https://ivanmarrtin2703.github.io/quedada-privacy/  
EAS: https://expo.dev/accounts/ivanmarrtin/projects/quedada  
Textos ficha: [`play-listing.es.md`](play-listing.es.md)  
Feature graphic: `feature-graphic.png` (1024×500)  
Capturas: `screenshots/` (mín. 2, ideal 4–6, **sin Picante**) — ver [`screenshots/README.md`](screenshots/README.md)  
Smoke test: [`smoke-test.md`](smoke-test.md)

## Monetización en código (hecho)

- Interstitials fin de ronda + Verdades/Retos cada 10 cartas
- Cooldown **3 min**
- Production **falla** si faltan `EXPO_PUBLIC_ADMOB_*` reales

## Builds EAS (histórico — rebuild obligatorio tras cambios)

| Perfil | Archivo | Nota |
|--------|---------|------|
| preview | APK | Solo QA/capturas; regenerar tras cambios de ads |
| production | AAB **nuevo (30/9/2026)** | Listo para Play |

- Build: https://expo.dev/accounts/ivanmarrtin/projects/quedada/builds/bd6c9a29-6c6f-4036-a818-94a1ae79a6e0  
- AAB: https://expo.dev/artifacts/eas/-xuV-a-RLYxwkJjQi_7LXjw0t1E_5LmXUhnB26SvEqM.aab  

Comando: `eas build -p android --profile production`

## Play Console

1. [ ] Crear app **Quedada** (app, gratis, con anuncios).
2. [ ] Ficha principal: título, descripción corta/larga, icono, feature graphic, capturas, email.
3. [ ] Enlace política de privacidad (URL de arriba).
4. [ ] Clasificación de contenido / audiencia: **solo 18+**, temas sexuales / lenguaje adulto.
5. [ ] Data safety: publicidad (AdMob / identificadores); sin cuentas propias; IAP vía Play.
6. [ ] Declarar anuncios + compras in-app.
7. [ ] Crear producto no consumible `remove_ads` a **1,99 €** + license testers (tu Gmail).
8. [ ] Subir AAB **nuevo** → testing interno → smoke ads/IAP → enviar a revisión.

## AdMob + EAS (verificar otra vez antes del AAB final)

1. [x] AdMob: app Android `com.proyectospropios.quedada` + unidad Interstitial.
2. [x] EAS env **production** (+ preview):
   - `EXPO_PUBLIC_ADMOB_ANDROID_APP_ID`
   - `EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID`
3. [x] `eas env:list --environment production` muestra esas vars.
4. [x] `eas build -p android --profile production` termina OK (bd6c9a29…).
5. [ ] Sube ese AAB a Play (no Test IDs).

## IAP

- ID exacto: `remove_ads`
- Tipo: no consumible / one-time
- Precio: 1,99 €
