import { useMemo } from 'react';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import type { Cocktail } from '../../types/cocktail';
import { useToast } from '../toast/toast.context';

const FAV_KEY = 'cocktail_favorites_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorageState<Cocktail[]>(
    FAV_KEY,
    [],
  );
  const favoritesSet = useMemo(
    () => new Set(favorites.map((f) => f.id)),
    [favorites],
  );
  const { push } = useToast();

  function isFavorite(id: string) {
    return favoritesSet.has(id);
  }

  function toggleFavorite(c: Cocktail) {
    const willRemove = favoritesSet.has(c.id);

    setFavorites((prev) => {
      const exists = prev.some((x) => x.id === c.id);
      return exists ? prev.filter((x) => x.id !== c.id) : [c, ...prev];
    });

    push({
      message: willRemove ? `Removed: ${c.name}` : `Saved: ${c.name}`,
      variant: 'success',
    });

    return { added: !willRemove };
  }

  function removeFavorite(id: string) {
    setFavorites((prev) => prev.filter((x) => x.id !== id));
  }

  function clearFavorites() {
    setFavorites([]);
    push({ message: 'Cleared favorites', variant: 'default' });
  }

  return {
    favorites,
    favoritesSet,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  };
}
