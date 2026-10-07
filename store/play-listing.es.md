# Ficha Google Play — Quedada

Copia y pega estos textos en Play Console → Presencia en Google Play → Ficha principal de la tienda.

## Título de la app
```
Quedada
```
(máx. 30 caracteres — OK)

## Descripción breve (máx. 80 caracteres)
```
Juegos de fiesta con un solo móvil: Qué Prefieres, Impostor, Yo Nunca y más.
```
(79 caracteres)

## Descripción completa
```
Quedada es la app para cuando estáis juntos y no hay plan… o el plan es fiesta.

Cinco modos en un solo móvil. Sin cuentas. Pasad el teléfono y empezad.

• Qué Prefieres — debate entre dos opciones (clásico, amigos, parejas, locuras y picante)
• Impostor — uno miente, el resto investiga. Cartas secretas y ronda de discusión
• Yo Nunca — confiesa… o pasa el reto
• Verdades o Retos — el clásico, con nivel suave y picante
• Más Probable Que… — señalad a quien encaje con la frase

Puede mostrar anuncios cortos entre rondas. Si prefieres jugar sin ellos, en Ajustes puedes quitar anuncios con un pago único (sin suscripción).

Ideal para quedadas, viajes, afters o cualquier noche en grupo.

Importante: el modo Picante es más atrevido y pensado para mayores de edad. Si bebéis, hacedlo con responsabilidad; también se puede jugar sin alcohol.

Privacidad: no pedimos login. Detalles en la política de privacidad de la ficha.
```

## Categoría sugerida
- Categoría principal: **Juegos** → **Casual** (o Entretenimiento si no usas categoría de juegos)

## Etiquetas / palabras clave (ideas, no campo fijo)
quedada, juegos fiesta, impostor, yo nunca, verdades o retos, qué prefieres, party games, amigos

## Contacto
- Email de soporte (obligatorio en ficha): el mismo que pongas en la política de privacidad

## Clasificación / audiencia (recordatorio)
- Audiencia: **solo 18+** (no incluir niños)
- Contenido: temas sexuales / lenguaje adulto si el cuestionario lo pregunta
- Anuncios: **Sí** (AdMob interstitial)
- Contiene compras in-app: **Sí** (quitar anuncios, 1,99 €, no consumible `remove_ads`)

## Data safety (Play Console) — qué declarar
- **Sí se recopilan datos** relacionados con publicidad (por Google AdMob), tipicamente:
  - Identificadores de dispositivo / publicidad
  - Datos de uso de anuncios (impresiones, interacciones)
- Finalidad: **Publicidad**
- Recopilado por terceros (Google)
- No hay cuentas propias ni datos de contacto del usuario
- Compra in-app: procesada por Google Play; en el dispositivo solo se guarda un flag local “sin anuncios”

---

## Assets gráficos que debes subir

### Icono
Ya lo tienes en `assets/icon.png` (512×512 recomendado para Play).

### Feature graphic (obligatoria)
- Tamaño: **1024 × 500 px**
- Archivo: `store/feature-graphic.png`

### Capturas de teléfono (mínimo 2, recomendado 4–6)
Resolución típica: **1080 × 1920** (o la de tu móvil).

Sugerencia de set (sin mostrar modo Picante explícito en la store):
1. Home — lista de juegos
2. Qué Prefieres — duelo A/B
3. Impostor — setup o carta
4. Yo Nunca o Más Probable (modo Suave)
5. Ajustes (opcional)

Cómo sacarlas:
1. Abre la app en el móvil (dev client / APK preview; anuncios nativos no van en Expo Go)
2. Android: capturas del sistema
3. Cópialas a la carpeta `store/screenshots/`

---

## Política de privacidad — URL publicada

- URL: https://ivanmarrtin2703.github.io/quedada-privacy/
- Repo: https://github.com/ivanmarrtin2703/quedada-privacy
- En la app: `src/constants/app.ts` → `PRIVACY_POLICY_URL`

### Pendiente
Email de contacto en política y ficha: `ivanmarrtin2703@gmail.com` (ya en `store/privacy-policy.html` y en GitHub Pages).

### AdMob (antes del AAB de producción)
Sustituye los App IDs de test en `app.json` y el interstitial en `EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID` / `adUnits.ts`.
