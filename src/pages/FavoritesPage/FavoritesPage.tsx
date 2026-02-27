import { CocktailGrid } from '../../components/cocktails/CocktailGrid/CocktailGrid';
import { Button } from '../../components/ui/Button/Button';
import { useFavorites } from '../../features/favorites/useFavorites';
import styles from './FavoritesPage.module.scss';

export function FavoritesPage() {
  const { favorites, favoritesSet, toggleFavorite, clearFavorites } =
    useFavorites();

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Favorites</h1>
        <Button
          type='button'
          variant='ghost'
          onClick={clearFavorites}
          disabled={favorites.length === 0}
        >
          Clear
        </Button>
      </div>

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
