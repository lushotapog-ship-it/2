let dictPromise = null;
let dictSet = null;

function loadDict() {
  if (!dictPromise) {
    dictPromise = import('../data/dictionary.json').then((mod) => {
      dictSet = new Set(mod.default);
      return dictSet;
    });
  }
  return dictPromise;
}

// Preload in the background so the first grading call doesn't have to wait.
export function warmSpellcheck() {
  loadDict();
}

function stripPunctuation(word) {
  return word.replace(/^[^a-z']+|[^a-z']+$/gi, '');
}

// Try a handful of common inflection endings so legitimate forms (plurals, -ed/-ing,
// possessives) that aren't literally in the dictionary aren't flagged as typos.
function knownWithInflections(word) {
  if (dictSet.has(word)) return true;
  const candidates = [];
  if (word.endsWith("'s")) candidates.push(word.slice(0, -2));
  if (word.endsWith('s')) candidates.push(word.slice(0, -1));
  if (word.endsWith('es')) candidates.push(word.slice(0, -2));
  if (word.endsWith('ies')) candidates.push(word.slice(0, -3) + 'y');
  if (word.endsWith('ing')) {
    candidates.push(word.slice(0, -3));
    candidates.push(word.slice(0, -3) + 'e');
  }
  if (word.endsWith('ed')) {
    candidates.push(word.slice(0, -2));
    candidates.push(word.slice(0, -1));
  }
  if (word.endsWith('ly')) candidates.push(word.slice(0, -2));
  if (word.endsWith('er')) candidates.push(word.slice(0, -2));
  if (word.endsWith('est')) candidates.push(word.slice(0, -3));
  return candidates.some((c) => c.length > 1 && dictSet.has(c));
}

// Returns { misspelled: string[], checked: number }. Proper nouns (capitalised mid-sentence
// aren't reliably detectable client-side, so we just skip very short words and numbers.
export async function checkSpelling(text) {
  await loadDict();
  const words = (text.match(/[A-Za-z']+/g) || []).map(stripPunctuation).filter((w) => w.length > 2);
  const misspelled = [];
  const seen = new Set();
  for (const raw of words) {
    const w = raw.toLowerCase();
    if (seen.has(w)) continue;
    seen.add(w);
    if (!knownWithInflections(w)) misspelled.push(w);
  }
  return { misspelled, checked: words.length };
}
