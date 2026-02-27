import { useMemo } from 'react';
import type { Cocktail } from '../../types/cocktail';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { CocktailGrid } from '../../components/cocktails/CocktailGrid/CocktailGrid';
import styles from './FavoritesPage.module.scss';

const FAV_KEY = 'cocktail_favorites_v1';

export function FavoritesPage() {
  const [favorites, setFavorites] = useLocalStorageState<Cocktail[]>(
    FAV_KEY,
    [],
  );
  const favoritesSet = useMemo(
    () => new Set(favorites.map((f) => f.id)),
    [favorites],
  );

  function toggleFavorite(c: Cocktail) {
    setFavorites((prev) => prev.filter((x) => x.id !== c.id));
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Favorites</h1>

      {favorites.length === 0 ? (
        <div className={styles.empty}>No favorites yet. Go save a few 🍸</div>
      ) : (
        <CocktailGrid
          cocktails={favorites}
          favoritesSet={favoritesSet}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
