/** Baraja in-place over a copy (Fisher–Yates). Nueva orden cada llamada. */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Saca el siguiente ítem de un mazo; si se acaba, vuelve a barajar la fuente. */
export function drawFromDeck<T>(
  remaining: T[],
  source: T[],
): { next: T | undefined; remaining: T[] } {
  if (source.length === 0) {
    return { next: undefined, remaining: [] };
  }
  let deck = remaining;
  if (deck.length === 0) {
    deck = shuffle(source);
  }
  const [next, ...rest] = deck;
  return { next, remaining: rest };
}
