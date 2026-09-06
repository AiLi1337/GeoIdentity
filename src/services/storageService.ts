import type { GeneratedIdentity } from '../types/identity';

const HISTORY_KEY = 'geo_identity_history_v1';
const FAVORITES_KEY = 'geo_identity_favorites_v1';
const MAX_HISTORY = 50;

export function getHistory(): GeneratedIdentity[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse history from localStorage', e);
    return [];
  }
}

export function saveToHistory(identity: GeneratedIdentity): void {
  try {
    const list = getHistory();
    // Prepend new identity
    const filtered = list.filter(item => item.id !== identity.id);
    const updated = [identity, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history to localStorage', e);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}

export function getFavorites(): GeneratedIdentity[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse favorites from localStorage', e);
    return [];
  }
}

export function toggleFavorite(identity: GeneratedIdentity): boolean {
  try {
    const favorites = getFavorites();
    const existsIndex = favorites.findIndex(item => item.id === identity.id);
    let isNowFav = false;

    if (existsIndex >= 0) {
      favorites.splice(existsIndex, 1);
      isNowFav = false;
    } else {
      favorites.unshift({ ...identity, isFavorite: true });
      isNowFav = true;
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return isNowFav;
  } catch (e) {
    console.error('Failed to toggle favorite', e);
    return false;
  }
}

export function isIdentityFavorite(id: string): boolean {
  const favorites = getFavorites();
  return favorites.some(item => item.id === id);
}
