import type { Cocktail } from '../../../types/cocktail';
import styles from './CocktailGrid.module.scss';
import { CocktailCard } from '../CocktailCard/CocktailCard';

export function CocktailGrid({
  cocktails,
  favoritesSet,
  onToggleFavorite,
}: {
  cocktails: Cocktail[];
  favoritesSet: Set<string>;
  onToggleFavorite: (c: Cocktail) => void;
}) {
  return (
    <div className={styles.grid}>
      {cocktails.map((c) => (
        <CocktailCard
          key={c.id}
          cocktail={c}
          isFavorite={favoritesSet.has(c.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
