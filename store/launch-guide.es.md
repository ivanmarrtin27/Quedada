# Guía de lanzamiento — Quedada (paso a paso)

Sigue este orden. Lo del repo (código + docs) ya está listo; el resto es **tu cuenta** Google / Expo.

Package: `com.proyectospropios.quedada`  
Soporte: `ivanmarrtin2703@gmail.com`  
Privacidad: https://ivanmarrtin2703.github.io/quedada-privacy/  
EAS: https://expo.dev/accounts/ivanmarrtin/projects/quedada  
Ficha textos: [`play-listing.es.md`](play-listing.es.md)

**Anuncios (equilibrio):** interstitial al fin de ronda; en Verdades/Retos cada 10 cartas; cooldown **3 minutos**. Sin banners.

---

## A) AdMob + variables EAS (obligatorio para ingresos)

### A1. AdMob
1. Entra en https://admob.google.com
2. Apps → confirma app Android con package `com.proyectospropios.quedada`
3. Copia el **App ID** (`ca-app-pub-…~…`)
4. Unidades de anuncio → Interstitial → copia el **Ad unit ID** (`ca-app-pub-…/…`)

Si aún no existe la app/unidad, créalas ahora (sin esto no hay ingresos reales).

### A2. EAS Environment variables
1. https://expo.dev/accounts/ivanmarrtin/projects/quedada → **Environment variables**
2. Para entornos **production** y **preview**, confirma (o crea):

| Variable | Valor |
|----------|--------|
| `EXPO_PUBLIC_ADMOB_ANDROID_APP_ID` | App ID real (no el de test `3940256099942544`) |
| `EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID` | Ad unit interstitial real |
| `EXPO_PUBLIC_NATIVE_MONETIZATION` | `1` (también viene en `eas.json`) |

3. Comprueba en terminal (con sesión `eas login`):

```bash
eas env:list --environment production
```

Debes ver las dos vars `EXPO_PUBLIC_ADMOB_*` (valores ocultos OK).

### A3. Rebuild production (nuevo AAB con anuncios reales + fixes)
Desde la carpeta del proyecto:

```bash
eas build -p android --profile production
```

- Si faltan IDs reales → el build **falla a propósito** (mensaje en `app.config.js`).
- **AAB listo (30/9/2026):**  
  https://expo.dev/artifacts/eas/-xuV-a-RLYxwkJjQi_7LXjw0t1E_5LmXUhnB26SvEqM.aab  
  Logs: https://expo.dev/accounts/ivanmarrtin/projects/quedada/builds/bd6c9a29-6c6f-4036-a818-94a1ae79a6e0

Opcional QA en móvil:

```bash
eas build -p android --profile preview
```

Instala el APK y marca [`smoke-test.md`](smoke-test.md).

---

## B) Capturas para la ficha (tú, en el móvil)

Usa el APK **preview**, modo **Suave** (nada de Picante en pantalla).

Mínimo 2; ideal:

1. `01-home.png` — Home con logo y juegos  
2. `02-preferencias.png` — duelo Qué Prefieres  
3. `03-impostor.png` — setup o carta Impostor  
4. `04-yo-nunca.png` — Yo Nunca o Más Probable Suave  
5. `05-ajustes.png` — Ajustes (opcional)

Cópialas a `store/screenshots/`. Detalle: [`screenshots/README.md`](screenshots/README.md).

Assets listos en repo:
- Icono: `assets/icon.png`
- Feature graphic: `store/feature-graphic.png` (1024×500)

---

## C) Play Console — ficha y políticas

1. [Play Console](https://play.google.com/console) → **Crear app** (si no existe):
   - Nombre: **Quedada**
   - Tipo: App
   - Gratis
   - Declara que **contiene anuncios**
2. **Presencia en Google Play → Ficha principal**
   - Copia textos de [`play-listing.es.md`](play-listing.es.md)
   - Sube icono, feature graphic, capturas
   - Email soporte: `ivanmarrtin2703@gmail.com`
3. **Política de privacidad** → URL:  
   `https://ivanmarrtin2703.github.io/quedada-privacy/`
4. **Clasificación de contenido**
   - Audiencia: **solo 18+** (no niños)
   - Temas sexuales / lenguaje adulto: **Sí** (modo Picante)
5. **Seguridad de los datos (Data safety)**
   - Recopilación: **Sí** (publicidad / AdMob)
   - Identificadores de dispositivo/publicidad; uso de anuncios
   - Finalidad: Publicidad; terceros (Google)
   - Sin cuentas propias de usuario
6. Declarar **anuncios = Sí** y **compras in-app = Sí**

---

## D) Producto IAP `remove_ads`

1. Monetizar con Play → Productos / Productos gestionados → **Crear producto**
2. ID del producto (exacto): `remove_ads`
3. Nombre (ej.): Quitar anuncios
4. Tipo: **No consumible** (compra única)
5. Precio: **1,99 €**
6. Estado: **Activo**
7. **Configuración → License testing** → añade tu Gmail (y testers)
8. Si Play pide cuenta de comerciante / pagos: complétalo o IAP no funcionará en producción

En la app: Ajustes → Quitar anuncios / Restaurar compras.

---

## E) Subir AAB → testing interno → producción

1. **Producción** o **Pruebas internas** → Crear versión → sube el **AAB nuevo** de EAS production
2. Pruebas internas (recomendado primero):
   - Añade tu email como tester
   - Instala desde el enlace de testing
   - Smoke: fin de ronda → interstitial; cooldown ~3 min; compra `remove_ads` con license tester
3. Completa el **panel de publicación** (todos los apartados en verde)
4. **Enviar a revisión**

Primera app: suele tardar **1–3+ días**. Si rechazan, lee el motivo y avísame con el texto exacto.

---

## Checklist rápido

- [x] AdMob App ID + Interstitial reales (EAS production + preview)
- [x] Vars EAS en production (+ preview)
- [x] `eas build -p android --profile production` OK
- [ ] ≥2 capturas Suave
- [ ] Ficha + privacidad + 18+ + Data safety
- [ ] Producto `remove_ads` activo + license tester
- [ ] AAB en testing interno → smoke OK → envío a revisión
