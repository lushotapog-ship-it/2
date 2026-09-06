// Simple Anki-like spaced repetition: box 0..4 maps to an interval in days.
// Answering "remembered/correct" advances a box; "forgot/wrong" drops back to box 0.
export const INTERVAL_DAYS = [1, 3, 7, 14, 30];
const DAY_MS = 24 * 60 * 60 * 1000;

export function emptyCard() {
  return { seen: 0, correct: 0, wrong: 0, box: 0, nextDue: null, lastSeen: null };
}

export function reviewCard(card, wasRemembered) {
  const c = { ...(card || emptyCard()) };
  c.seen += 1;
  c.lastSeen = Date.now();
  if (wasRemembered) {
    c.correct += 1;
    c.box = Math.min(c.box + 1, INTERVAL_DAYS.length - 1);
  } else {
    c.wrong += 1;
    c.box = 0;
  }
  const days = INTERVAL_DAYS[c.box];
  c.nextDue = Date.now() + days * DAY_MS;
  return c;
}

export function isDue(card) {
  if (!card || !card.nextDue) return false;
  return card.nextDue <= Date.now();
}

export function daysOverdue(card) {
  if (!card || !card.nextDue) return 0;
  return Math.max(0, (Date.now() - card.nextDue) / DAY_MS);
}
