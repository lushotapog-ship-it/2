// Minimal localStorage-backed implementation of the window.storage.get/set
// interface, matching the convention used by the other app in this account.
const PREFIX = 'dse-master-bank:';

window.storage = {
  async get(key) {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? null : { value: raw };
  },
  async set(key, value) {
    localStorage.setItem(PREFIX + key, value);
    return true;
  },
};
