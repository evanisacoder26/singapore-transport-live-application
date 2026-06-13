import { useSyncExternalStore, useCallback } from 'react';

// localStorage-backed favourites + recents for MRT stations and bus stops.
// A small module-level store keeps every component that calls useFavourites()
// in sync, so toggling a star on a card updates the detail panel and the
// pinned rows at the same time.

const KEYS = {
  favStations: 'sgmrt.fav.stations',
  favStops: 'sgmrt.fav.stops',
  recentStations: 'sgmrt.recent.stations',
  recentStops: 'sgmrt.recent.stops',
} as const;

const RECENT_CAP = 6;

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // localStorage unavailable or over quota — favourites just won't persist
  }
}

interface FavState {
  favStations: string[];
  favStops: string[];
  recentStations: string[];
  recentStops: string[];
}

let state: FavState = {
  favStations: readList(KEYS.favStations),
  favStops: readList(KEYS.favStops),
  recentStations: readList(KEYS.recentStations),
  recentStops: readList(KEYS.recentStops),
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function setField(field: keyof FavState, value: string[]) {
  state = { ...state, [field]: value };
  writeList(KEYS[field], value);
  for (const l of listeners) l();
}

function toggleIn(list: string[], code: string): string[] {
  return list.includes(code) ? list.filter(c => c !== code) : [code, ...list];
}

function pushRecent(list: string[], code: string): string[] {
  return [code, ...list.filter(c => c !== code)].slice(0, RECENT_CAP);
}

export function useFavourites() {
  const s = useSyncExternalStore(subscribe, getSnapshot);

  return {
    favStations: s.favStations,
    favStops: s.favStops,
    recentStations: s.recentStations,
    recentStops: s.recentStops,

    isFavStation: useCallback((code: string) => state.favStations.includes(code), []),
    isFavStop: useCallback((code: string) => state.favStops.includes(code), []),

    toggleFavStation: useCallback((code: string) => setField('favStations', toggleIn(state.favStations, code)), []),
    toggleFavStop: useCallback((code: string) => setField('favStops', toggleIn(state.favStops, code)), []),

    addRecentStation: useCallback((code: string) => setField('recentStations', pushRecent(state.recentStations, code)), []),
    addRecentStop: useCallback((code: string) => setField('recentStops', pushRecent(state.recentStops, code)), []),
  };
}
