// Client-side persistence for history, stats, and settings.
// Uses localStorage so the MVP runs entirely in the browser.

export type HistoryEntry = {
  id: string;
  time: number;
  gesture: string;
  text: string;
  confidence: number;
};

export type Settings = {
  speech: boolean;
  darkMode: boolean;
  language: "en" | "hi" | "te";
  cameraResolution: "480p" | "720p" | "1080p";
};

const HISTORY_KEY = "signbridge.history";
const SETTINGS_KEY = "signbridge.settings";
const STATS_KEY = "signbridge.stats";

export const defaultSettings: Settings = {
  speech: true,
  darkMode: true,
  language: "en",
  cameraResolution: "720p",
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export const historyStore = {
  list: (): HistoryEntry[] => safeGet<HistoryEntry[]>(HISTORY_KEY, []),
  add: (entry: HistoryEntry) => {
    const cur = historyStore.list();
    const next = [entry, ...cur].slice(0, 500);
    safeSet(HISTORY_KEY, next);
    return next;
  },
  clear: () => safeSet(HISTORY_KEY, []),
};

export const settingsStore = {
  get: (): Settings => ({ ...defaultSettings, ...safeGet<Partial<Settings>>(SETTINGS_KEY, {}) }),
  set: (patch: Partial<Settings>) => {
    const next = { ...settingsStore.get(), ...patch };
    safeSet(SETTINGS_KEY, next);
    return next;
  },
};

export type Stats = {
  totalGestures: number;
  todayCount: number;
  todayDate: string;
  sessions: number;
  accuracySum: number;
  accuracyCount: number;
};

const emptyStats = (): Stats => ({
  totalGestures: 0,
  todayCount: 0,
  todayDate: new Date().toDateString(),
  sessions: 0,
  accuracySum: 0,
  accuracyCount: 0,
});

export const statsStore = {
  get: (): Stats => {
    const s = safeGet<Stats>(STATS_KEY, emptyStats());
    const today = new Date().toDateString();
    if (s.todayDate !== today) {
      s.todayDate = today;
      s.todayCount = 0;
    }
    return s;
  },
  incrementGesture: (confidence: number) => {
    const s = statsStore.get();
    s.totalGestures += 1;
    s.todayCount += 1;
    s.accuracySum += confidence;
    s.accuracyCount += 1;
    safeSet(STATS_KEY, s);
    return s;
  },
  incrementSession: () => {
    const s = statsStore.get();
    s.sessions += 1;
    safeSet(STATS_KEY, s);
    return s;
  },
};
