# Capturas para Google Play / docs

Play exige **mínimo 2** capturas de teléfono (recomendado 4–6). **Solo modo Suave** — nada de Picante en pantalla.

## Archivos en este carpeta

| Archivo | Pantalla |
|---------|----------|
| `01-home.png` | Home + logo + lista de juegos |
| `02-preferencias.png` | Qué Prefieres (duelo A/B, Suave) |
| `03-impostor.png` | Impostor — setup |
| `04-yo-nunca.png` | Yo Nunca — carta Suave |
| `05-ajustes.png` | Ajustes |

Resolución: **1080 × 1920**.

> **Origen actual:** mockups de marca generados con el logo real (`assets/quedada-logo.png`) y la paleta de la app. Sirven para README y como borrador de ficha.  
> **Antes de publicar en Play:** sustituí por capturas reales del APK preview / dispositivo (más fieles a la UI nativa).

## Cómo sacar capturas reales

1. Instalá el APK de EAS **preview** (o build de producción de prueba).
2. Recorré la app en modo **Suave**.
3. Android: Encendido + Volumen − (o gestos del sistema).
4. Sobreescribí los PNG de arriba con los mismos nombres.

Regenerar mockups (opcional):

```bash
python store/screenshots/_gen_mockups.py
```

## Assets de marca listos

- Icono: `assets/icon.png` / `assets/quedada-logo.png`
- Feature graphic: `store/feature-graphic.png` (1024×500)
