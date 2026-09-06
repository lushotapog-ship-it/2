import { MASTERS } from './masterIndex';
import { checkSpelling } from './spellcheck';

const STOPWORDS = new Set(
  'a an the of to in on for and or but with without into onto from by at is are was were be being been this that these those it its their his her they he she we you your our i not no can could would should will may might also than then so because if when while as own real own more most less very much many own about over under again once each other another'.split(
    ' ',
  ),
);

function stem(word) {
  let w = word.toLowerCase();
  if (w.endsWith('ies')) w = w.slice(0, -3) + 'y';
  else if (w.endsWith('es')) w = w.slice(0, -2);
  else if (w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  if (w.endsWith('ing') && w.length > 5) w = w.slice(0, -3);
  else if (w.endsWith('ed') && w.length > 4) w = w.slice(0, -2);
  return w;
}

function keywordSet(text) {
  const words = (text.toLowerCase().match(/[a-z']+/g) || []).filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return new Set(words.map(stem));
}

function masterKeywordBag(master) {
  const parts = [master.skeleton || '', ...(master.bodies || []).map((b) => b.text)];
  return keywordSet(parts.join(' '));
}

// Rank candidate master ids by how much their skeleton/body vocabulary overlaps the
// user's English answer. Returns [{id, score, overlapCount}] sorted best-first.
export function matchMasters(answerText, candidateIds) {
  const answerWords = keywordSet(answerText);
  if (answerWords.size === 0) return [];
  const pool = candidateIds && candidateIds.length ? candidateIds : MASTERS.map((m) => m.id);
  const results = [];
  for (const id of pool) {
    const master = MASTERS.find((m) => m.id === id);
    if (!master) continue;
    const bag = masterKeywordBag(master);
    let overlap = 0;
    for (const w of answerWords) if (bag.has(w)) overlap += 1;
    const score = overlap / Math.sqrt(bag.size || 1);
    if (overlap > 0) results.push({ id, score, overlapCount: overlap });
  }
  return results.sort((a, b) => b.score - a.score);
}

const A_AN_RE = /\b(a)\s+([aeiouAEIOU]\w*)/g;
const REPEATED_WORD_RE = /\b(\w+)\s+\1\b/gi;

// Lightweight, purely local heuristic checks — not real grammar AI, just the common
// slip-ups worth flagging automatically while typing English answers.
export function basicGrammarChecks(text) {
  const issues = [];
  const trimmed = text.trim();
  if (!trimmed) return issues;

  let m;
  A_AN_RE.lastIndex = 0;
  while ((m = A_AN_RE.exec(trimmed))) {
    const nextWord = m[2].toLowerCase();
    if (!/^(uni|use|user|one|euro)/.test(nextWord)) {
      issues.push({ type: 'grammar', message: `"a ${m[2]}" 前面母音開頭,應該用 "an ${m[2]}"` });
    }
  }
  REPEATED_WORD_RE.lastIndex = 0;
  while ((m = REPEATED_WORD_RE.exec(trimmed))) {
    issues.push({ type: 'grammar', message: `「${m[1]}」重複出現了兩次` });
  }
  if (/\balot\b/i.test(trimmed)) issues.push({ type: 'grammar', message: '"alot" 應該分開寫成 "a lot"' });
  if (/\bdon'?t\s+have\s+no\b/i.test(trimmed)) issues.push({ type: 'grammar', message: '雙重否定 "don\'t have no"，應改為 "don\'t have any"' });
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim());
  for (const s of sentences) {
    const wc = s.trim().split(/\s+/).length;
    if (wc > 45) {
      issues.push({ type: 'grammar', message: '其中一句過長(40 個字以上)，建議拆成兩句。' });
      break;
    }
  }
  return issues;
}

// Full local (non-AI) grading pipeline: spelling + basic grammar + best-matching Master(s).
export async function gradeLocally(answerText, candidateIds) {
  const [{ misspelled }, grammarIssues] = await Promise.all([
    checkSpelling(answerText),
    Promise.resolve(basicGrammarChecks(answerText)),
  ]);
  const matches = matchMasters(answerText, candidateIds);
  return {
    source: 'heuristic',
    misspelled,
    grammarIssues,
    matches,
    bestMatch: matches[0] || null,
  };
}
