"""Generate Soft-mode branded phone mockups for store/README (no Picante)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
LOGO = ROOT / "assets" / "quedada-logo.png"

W, H = 1080, 1920
BG = (11, 16, 32)
CARD = (26, 35, 64)
CARD_SOFT = (21, 28, 50)
BORDER = (58, 70, 104)
TEXT = (255, 255, 255)
MUTED = (168, 180, 208)
DIM = (110, 124, 156)
ACCENT = (255, 77, 109)
CYAN = (0, 209, 255)
PINK = (255, 107, 203)
AMBER = (255, 176, 32)
VIOLET = (167, 139, 250)
GREEN = (0, 232, 160)
ORANGE = (255, 122, 61)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibrib.ttf" if bold else r"C:\Windows\Fonts\calibri.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def rounded_rect(draw: ImageDraw.ImageDraw, box, radius, fill, outline=None, width=2):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def gradient_line(img: Image.Image, y: int, x0: int, x1: int, height: int = 4):
    colors = [CYAN, PINK, AMBER]
    for i, x in enumerate(range(x0, x1)):
        t = i / max(1, x1 - x0 - 1)
        if t < 0.5:
            u = t * 2
            c0, c1 = colors[0], colors[1]
        else:
            u = (t - 0.5) * 2
            c0, c1 = colors[1], colors[2]
        c = tuple(int(c0[j] + (c1[j] - c0[j]) * u) for j in range(3))
        for dy in range(height):
            img.putpixel((x, y + dy), c + (255,))


def base_canvas() -> Image.Image:
    img = Image.new("RGBA", (W, H), BG + (255,))
    # Soft corner glows
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.ellipse((-200, -120, 520, 480), fill=(0, 209, 255, 28))
    d.ellipse((700, 1500, 1300, 2100), fill=(255, 77, 109, 24))
    return Image.alpha_composite(img, overlay)


def paste_logo(img: Image.Image, xy: tuple[int, int], size: int = 120):
    logo = Image.open(LOGO).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    img.alpha_composite(logo, dest=xy)


def wrap_text(draw, text, font_obj, max_width):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=font_obj) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def make_home():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    paste_logo(img, (64, 96), 128)
    rounded_rect(d, (860, 120, 1016, 188), 24, CARD, BORDER)
    d.text((892, 136), "Ajustes", fill=MUTED, font=font(28, True))

    d.text((64, 260), "JUEGOS CON AMIGOS", fill=CYAN, font=font(28, True))
    d.text((64, 310), "Quedada", fill=TEXT, font=font(86, True))
    gradient_line(img, 420, 64, 420, 5)
    d.text((64, 450), "Cinco modos para una noche perfecta.", fill=MUTED, font=font(34))
    d.text((64, 500), "Elige y juega.", fill=MUTED, font=font(34))

    d.text((64, 590), "Elige un juego", fill=TEXT, font=font(40, True))
    rounded_rect(d, (820, 590, 1016, 646), 20, (0, 209, 255, 40), CYAN)
    d.text((846, 602), "5 modos", fill=CYAN, font=font(26, True))

    games = [
        ("Qué Prefieres", "Elige entre dos opciones y debate", CYAN, "2–20"),
        ("Impostor", "Uno miente. El resto investiga", ACCENT, "3–12"),
        ("Yo Nunca", "Confiesa… o bebe / pierde punto", AMBER, "3–20"),
        ("Verdades o Retos", "El clásico de fiesta, con niveles", VIOLET, "3–16"),
        ("Más Probable Que…", "Señala a quien encaje con la frase", GREEN, "3–16"),
    ]
    y = 680
    for title, sub, color, players in games:
        rounded_rect(d, (64, y, 1016, y + 150), 28, CARD, color + (90,))
        d.rectangle((64, y + 18, 76, y + 132), fill=color)
        rounded_rect(d, (100, y + 22, 320, y + 62), 16, color + (40,))
        d.text((118, y + 28), f"{players} jugadores", fill=color, font=font(22, True))
        d.text((100, y + 74), title, fill=TEXT, font=font(36, True))
        d.text((100, y + 118), sub, fill=MUTED, font=font(24))
        rounded_rect(d, (930, y + 50, 990, y + 110), 20, color)
        d.text((948, y + 60), "›", fill=TEXT, font=font(42, True))
        y += 170

    return img.convert("RGB")


def make_preferencias():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    d.text((64, 90), "‹", fill=CYAN, font=font(56, True))
    d.text((140, 104), "Qué Prefieres", fill=TEXT, font=font(42, True))
    d.text((64, 190), "Categoría · Clásico", fill=DIM, font=font(28))
    d.text((64, 250), "Modo Suave", fill=GREEN, font=font(26, True))

    rounded_rect(d, (64, 360, 1016, 820), 36, CARD, CYAN)
    d.text((100, 420), "A", fill=CYAN, font=font(48, True))
    for i, line in enumerate(
        wrap_text(d, "¿Preferirías viajar sin plan fijo?", font(44, True), 820)
    ):
        d.text((100, 520 + i * 58), line, fill=TEXT, font=font(44, True))

    rounded_rect(d, (64, 900, 1016, 1360), 36, CARD, ACCENT)
    d.text((100, 960), "B", fill=ACCENT, font=font(48, True))
    for i, line in enumerate(
        wrap_text(d, "¿Preferirías tenerlo todo organizado?", font(44, True), 820)
    ):
        d.text((100, 1060 + i * 58), line, fill=TEXT, font=font(44, True))

    d.ellipse((470, 1520, 500, 1550), fill=CYAN)
    d.ellipse((530, 1520, 560, 1550), fill=BORDER)
    d.ellipse((590, 1520, 620, 1550), fill=BORDER)
    d.text((64, 1640), "Pasad el móvil y debatid.", fill=MUTED, font=font(30))
    return img.convert("RGB")


def make_impostor():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    d.text((64, 90), "‹", fill=ACCENT, font=font(56, True))
    d.text((140, 104), "Impostor", fill=TEXT, font=font(42, True))
    d.text((64, 200), "Setup · Modo Suave", fill=DIM, font=font(28))
    for i, line in enumerate(
        wrap_text(
            d,
            "Elige jugadores, impostores y temática. Cada uno verá su carta en secreto.",
            font(32),
            920,
        )
    ):
        d.text((64, 280 + i * 44), line, fill=MUTED, font=font(32))

    fields = [
        ("Jugadores", "5"),
        ("Impostores", "1"),
        ("Temática", "Amigos"),
    ]
    y = 460
    for label, value in fields:
        d.text((64, y), label.upper(), fill=DIM, font=font(24, True))
        rounded_rect(d, (64, y + 40, 1016, y + 140), 24, CARD, BORDER)
        d.text((100, y + 70), value, fill=TEXT, font=font(40, True))
        y += 220

    rounded_rect(d, (64, 1280, 1016, 1410), 28, ACCENT)
    d.text((400, 1318), "Continuar", fill=TEXT, font=font(40, True))
    paste_logo(img, (476, 1560), 96)
    return img.convert("RGB")


def make_yo_nunca():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    d.text((64, 90), "‹", fill=AMBER, font=font(56, True))
    d.text((140, 104), "Yo Nunca", fill=TEXT, font=font(42, True))
    rounded_rect(d, (64, 190, 260, 250), 20, (255, 176, 32, 40), AMBER)
    d.text((90, 204), "Suave", fill=AMBER, font=font(28, True))
    d.text((280, 204), "Carta 3 / 20", fill=DIM, font=font(28))

    rounded_rect(d, (64, 360, 1016, 1100), 40, CARD, AMBER)
    d.text((100, 460), "Yo nunca…", fill=AMBER, font=font(36, True))
    for i, line in enumerate(
        wrap_text(
            d,
            "he fingido saber una canción para cantarla con el grupo",
            font(48, True),
            860,
        )
    ):
        d.text((100, 560 + i * 64), line, fill=TEXT, font=font(48, True))

    rounded_rect(d, (64, 1240, 500, 1380), 28, CARD_SOFT, BORDER)
    d.text((150, 1288), "Yo sí", fill=TEXT, font=font(36, True))
    rounded_rect(d, (580, 1240, 1016, 1380), 28, AMBER)
    d.text((680, 1288), "Yo nunca", fill=(20, 20, 20), font=font(36, True))
    d.text((64, 1520), "Confiesa o pasa — sin Picante en ficha.", fill=MUTED, font=font(28))
    return img.convert("RGB")


def make_settings():
    img = base_canvas()
    d = ImageDraw.Draw(img)
    d.text((64, 90), "‹", fill=CYAN, font=font(56, True))
    d.text((140, 104), "Ajustes", fill=TEXT, font=font(42, True))
    paste_logo(img, (64, 220), 140)
    d.text((240, 250), "ACERCA DE", fill=CYAN, font=font(24, True))
    d.text((240, 290), "Quedada", fill=TEXT, font=font(52, True))
    gradient_line(img, 360, 240, 520, 4)
    d.text((240, 380), "Versión 1.0.1", fill=DIM, font=font(28))

    sections = [
        (CYAN, "Cómo se juega", "Un móvil. Cinco modos. Sin salas ni Wi‑Fi."),
        (ACCENT, "Picante y responsabilidad", "Picante es 18+. En ficha solo mostramos Suave."),
        (VIOLET, "Privacidad", "Sin cuentas propias. Puede haber anuncios AdMob."),
    ]
    y = 500
    for color, title, body in sections:
        rounded_rect(d, (64, y, 1016, y + 210), 28, CARD, BORDER)
        d.rectangle((64, y + 24, 76, y + 186), fill=color)
        d.text((100, y + 40), title, fill=TEXT, font=font(34, True))
        for i, line in enumerate(wrap_text(d, body, font(28), 860)):
            d.text((100, y + 100 + i * 38), line, fill=MUTED, font=font(28))
        y += 240

    rounded_rect(d, (64, y + 20, 1016, y + 150), 28, CYAN)
    d.text((280, y + 62), "Quitar anuncios", fill=(11, 16, 32), font=font(36, True))
    return img.convert("RGB")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    targets = {
        "01-home.png": make_home,
        "02-preferencias.png": make_preferencias,
        "03-impostor.png": make_impostor,
        "04-yo-nunca.png": make_yo_nunca,
        "05-ajustes.png": make_settings,
    }
    for name, fn in targets.items():
        path = OUT / name
        fn().save(path, "PNG", optimize=True)
        print(f"wrote {path}")


if __name__ == "__main__":
    main()
