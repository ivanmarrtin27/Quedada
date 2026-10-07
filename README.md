# Quedada

App de juegos con amigos (Qué Prefieres, Impostor, Yo Nunca, Verdades o Retos, Más Probable Que…) hecha con Expo / React Native.

## Juegos

| Juego | Descripción |
|------|-------------|
| Qué Prefieres | Elige entre dos opciones (5 categorías) |
| Impostor | Uno miente, el resto investiga |
| Yo Nunca | Confiesa o bebe / pierde punto |
| Verdades o Retos | El clásico de fiesta |
| Más Probable Que… | Señala a quien encaje con la frase |

## Arrancar en local (Expo Go)

Como **antes** (sin development build):

```bash
npx expo start -c --go
```

En la terminal debe salir **`Using Expo Go`**.

Luego abre **Expo Go** en el móvil y escanea el QR **desde la propia app Expo Go** (misma Wi‑Fi).

Si la Cámara/Safari abre `http://192.168…`, ignóralo: entra en Expo Go → proyectos recientes o Introduce URL `exp://…` de la terminal.

Tras cambios de monetización hace falta **reiniciar Metro con caché limpia** (`-c`). En Expo Go no hay anuncios reales (stubs); en EAS sí.

## Plan → Google Play

**Guía paso a paso (AdMob, EAS, ficha, IAP, revisión):** [`store/launch-guide.es.md`](store/launch-guide.es.md)

Checklist: [`store/play-console-checklist.md`](store/play-console-checklist.md) · smoke: [`store/smoke-test.md`](store/smoke-test.md)

### Estado del producto
- [x] Proyecto Expo + pantallas Home / Juego
- [x] 5 modos + contenido
- [x] Icono y splash
- [x] Política de privacidad (URL pública)
- [x] Textos de ficha + feature graphic
- [x] Monetización equilibrada (interstitial fin de ronda / cada 10 en Verdades; cooldown 3 min)
- [ ] Variables AdMob reales en EAS + rebuild production
- [ ] Capturas de pantalla → `store/screenshots/`
- [ ] Completar ficha Play + IAP `remove_ads` + enviar a revisión

## Notas importantes

1. **Cuenta de desarrollador**: con licencia Play ya pagada; sigue `store/launch-guide.es.md`.
2. **Privacidad**: Play exige URL de política (ya publicada).
3. **Primera publicación**: Google a veces tarda; 1–3+ días es realista si la ficha está completa.
4. **Modo Picante**: declara **18+** en Play; no lo muestres en capturas de la ficha.
5. **Anuncios**: sin banners; solo interstitials con cooldown para no saturar.
