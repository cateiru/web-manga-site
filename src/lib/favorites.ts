const STORAGE_KEY = "manga-site:favorites";
const FAVORITES_CHANGE_EVENT = "manga-site:favorites-change";

function readFavorites(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: string[]): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage が使えない環境（プライベートモード等）では何もしない
  }
  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));
}

export function isFavorite(workId: string): boolean {
  return readFavorites().includes(workId);
}

export function toggleFavorite(workId: string): void {
  const favorites = readFavorites();
  const index = favorites.indexOf(workId);
  if (index === -1) {
    writeFavorites([...favorites, workId]);
  } else {
    const next = [...favorites];
    next.splice(index, 1);
    writeFavorites(next);
  }
}

export function subscribeFavorites(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(FAVORITES_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(FAVORITES_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
