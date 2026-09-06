import { MASTERS, resolveMaster } from './masterIndex';

// Resolves the user's current practice pool (all 83 active masters, or a custom
// hand-picked subset) to an array of active master ids.
export function resolvePool(selection) {
  if (!selection || selection.mode !== 'custom' || !selection.customIds?.length) {
    return MASTERS.map((m) => m.id);
  }
  const ids = new Set();
  for (const rawId of selection.customIds) {
    const m = resolveMaster(rawId);
    if (m) ids.add(m.id);
  }
  return ids.size ? [...ids] : MASTERS.map((m) => m.id);
}

export function pickRandom(arr) {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}
