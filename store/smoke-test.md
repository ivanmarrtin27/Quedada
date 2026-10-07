# Smoke test — APK preview (antes de production AAB)

Instala el APK de `eas build --profile preview` y marca:

- [ ] Arranca Home, logo y 5 juegos visibles
- [ ] Ajustes: versión, política abre URL, textos de anuncios
- [ ] Qué Prefieres: categoría → partida → fin de mazo
- [ ] Impostor: setup → cartas → discusión → revelar; atrás pide confirmar salida
- [ ] Yo Nunca / Más Probable / Verdades: Suave + toggle Picante con alerta
- [ ] Botón atrás Android: vuelve a Home (o categorías en Preferencias)
- [ ] Anuncios: interstitial de **test**/real al fin de ronda (cooldown ~3 min)
- [ ] Verdades/Retos: no anuncia cada carta; como mucho cada ~10 cartas (y si pasó cooldown)
- [ ] Quitar anuncios: mensaje de “build nativo” o flujo IAP (IAP real solo tras producto en Play)

Bugs encontrados:
-
-
