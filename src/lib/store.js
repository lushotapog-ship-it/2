import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'progress-v1';
const MAX_WRONG_ENTRIES = 300;

function defaultState() {
  return {
    version: 1,
    selection: { mode: 'all', customIds: [] }, // mode: 'all' | 'custom'
    perMaster: {}, // id -> { en: card, zh: card }
    scenarioLog: {}, // topicKey -> { masterCounts: {id: n}, history: [{ts, masterId, mode}] }
    misspellings: {}, // word -> count
    wrongAnswers: [], // [{ts, mode, topicKey, topicLabel, masterId, guessMasterId, answerText, issues:[]}]
  };
}

function migrate(loaded) {
  const base = defaultState();
  if (!loaded || typeof loaded !== 'object') return base;
  return {
    ...base,
    ...loaded,
    selection: { ...base.selection, ...(loaded.selection || {}) },
    perMaster: loaded.perMaster || {},
    scenarioLog: loaded.scenarioLog || {},
    misspellings: loaded.misspellings || {},
    wrongAnswers: loaded.wrongAnswers || [],
  };
}

let state = defaultState();
let loaded = false;
const listeners = new Set();
let saveTimer = null;

function notify() {
  for (const l of listeners) l();
}

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('failed to save progress', e);
    }
  }, 300);
}

export async function loadStore() {
  try {
    const res = await window.storage.get(STORAGE_KEY);
    if (res && res.value) {
      state = migrate(JSON.parse(res.value));
    }
  } catch (e) {
    console.error('failed to load progress', e);
  }
  loaded = true;
  notify();
  return state;
}

export function isLoaded() {
  return loaded;
}

export function getState() {
  return state;
}

export function setState(updater) {
  state = typeof updater === 'function' ? updater(state) : updater;
  notify();
  scheduleSave();
}

export function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useStore(selector = (s) => s) {
  return useSyncExternalStore(subscribe, () => selector(getState()));
}

// ---- mutation helpers ----

export function getCard(id, mode) {
  const pm = state.perMaster[id];
  return pm?.[mode] ?? null;
}

export function updateCard(id, mode, newCard) {
  setState((s) => ({
    ...s,
    perMaster: {
      ...s.perMaster,
      [id]: { ...(s.perMaster[id] || {}), [mode]: newCard },
    },
  }));
}

export function logScenarioAttempt(topicKey, masterId, mode) {
  setState((s) => {
    const entry = s.scenarioLog[topicKey] || { masterCounts: {}, history: [] };
    const masterCounts = { ...entry.masterCounts, [masterId]: (entry.masterCounts[masterId] || 0) + 1 };
    const history = [...entry.history, { ts: Date.now(), masterId, mode }].slice(-50);
    return { ...s, scenarioLog: { ...s.scenarioLog, [topicKey]: { masterCounts, history } } };
  });
}

export function recordMisspellings(words) {
  if (!words.length) return;
  setState((s) => {
    const misspellings = { ...s.misspellings };
    for (const w of words) misspellings[w] = (misspellings[w] || 0) + 1;
    return { ...s, misspellings };
  });
}

export function recordWrongAnswer(entry) {
  setState((s) => ({
    ...s,
    wrongAnswers: [...s.wrongAnswers, { ts: Date.now(), ...entry }].slice(-MAX_WRONG_ENTRIES),
  }));
}

export function setSelection(selection) {
  setState((s) => ({ ...s, selection: { ...s.selection, ...selection } }));
}

export function resetAllProgress() {
  setState(() => defaultState());
}
