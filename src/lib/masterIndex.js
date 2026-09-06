import rawData from '../data/masters.json';

export const ALL_IDS = rawData.allIds;
export const MASTERS = rawData.masters;
export const MERGED_STUBS = rawData.mergedStubs;

const byId = new Map(MASTERS.map((m) => [m.id, m]));
const stubById = new Map(MERGED_STUBS.map((s) => [s.id, s]));

// Resolve any of the 87 canonical numbers to the active Master that holds its content
// (merged numbers like M20/M40/M56/M71 redirect to the entry that absorbed them).
export function resolveMaster(id) {
  if (byId.has(id)) return byId.get(id);
  const stub = stubById.get(id);
  if (stub) return byId.get(stub.mergedInto) ?? null;
  return null;
}

export function isMergedId(id) {
  return stubById.has(id);
}

export function mergedTargetOf(id) {
  return stubById.get(id)?.mergedInto ?? null;
}

export function partLabel(master) {
  if (!master?.part) return '';
  return `${master.part.num}. ${master.part.name}`;
}

// Reverse index: lowercase keyword token -> list of master ids whose "transferable"
// scenario tags contain that token. Used to suggest which Masters plausibly fit a topic.
const tagIndex = new Map();
for (const m of MASTERS) {
  const tags = m.transferable || [];
  for (const tag of tags) {
    for (const token of tag.toLowerCase().split(/[\s/]+/).filter(Boolean)) {
      if (!tagIndex.has(token)) tagIndex.set(token, new Set());
      tagIndex.get(token).add(m.id);
    }
  }
}

function tokenize(s) {
  return s
    .toLowerCase()
    .replace(/[()（）,.:：、]/g, ' ')
    .split(/[\s/]+/)
    .filter((t) => t.length > 2);
}

// Given a topic item like {zh:'交流計劃', en:'Exchange programmes'}, return a ranked
// list of candidate master ids whose "可搬" tags best overlap with the topic's English term.
export function candidateMastersForTopic(topicEn, limit = 6) {
  const tokens = tokenize(topicEn);
  const scores = new Map();
  for (const token of tokens) {
    const ids = tagIndex.get(token);
    if (!ids) continue;
    for (const id of ids) scores.set(id, (scores.get(id) || 0) + 1);
  }
  // also try substring match against full tag strings for multi-word tags/topics
  const topicLower = topicEn.toLowerCase();
  for (const m of MASTERS) {
    for (const tag of m.transferable || []) {
      const tagLower = tag.toLowerCase();
      if (topicLower.includes(tagLower) || tagLower.includes(topicLower)) {
        scores.set(m.id, (scores.get(m.id) || 0) + 2);
      }
    }
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}

export function activeMasterIds() {
  return MASTERS.map((m) => m.id);
}

export function tierOf(id) {
  return resolveMaster(id)?.tier ?? 3;
}
