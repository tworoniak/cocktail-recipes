import { Link } from 'react-router-dom';
import type { Cocktail } from '../../../types/cocktail';
import styles from './CocktailCard.module.scss';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';

export function CocktailCard({
  cocktail,
  isFavorite,
  onToggleFavorite,
}: {
  cocktail: Cocktail;
  isFavorite: boolean;
  onToggleFavorite: (c: Cocktail) => void;
}) {
  return (
    <article className={styles.card}>
      <Link to={`/cocktail/${cocktail.id}`} className={styles.link}>
        <img
          className={styles.thumb}
          src={cocktail.thumbnail}
          alt={cocktail.name}
          loading='lazy'
        />
        <div className={styles.meta}>
          <div className={styles.name}>{cocktail.name}</div>
          <div className={styles.sub}>
            {[cocktail.category, cocktail.alcoholic]
              .filter(Boolean)
              .join(' • ')}
          </div>
        </div>
      </Link>

      <div className={styles.actions}>
        <FavoriteButton
          active={isFavorite}
          onClick={() => onToggleFavorite(cocktail)}
          ariaLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        />
      </div>
    </article>
  );
}
