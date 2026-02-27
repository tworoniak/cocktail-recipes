import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { Spinner } from '../../components/ui/Spinner/Spinner';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import type { Cocktail } from '../../types/cocktail';
import {
  getRandomCocktail,
  searchCocktailsByName,
} from '../../services/cocktaildb';
import { CocktailGrid } from '../../components/cocktails/CocktailGrid/CocktailGrid';
import styles from './SearchPage.module.scss';

const FAV_KEY = 'cocktail_favorites_v1';

export function SearchPage() {
  const [term, setTerm] = useState('');
  const debounced = useDebounce(term, 350);

  const [favorites, setFavorites] = useLocalStorageState<Cocktail[]>(
    FAV_KEY,
    [],
  );
  const favoritesSet = useMemo(
    () => new Set(favorites.map((f) => f.id)),
    [favorites],
  );

  const searchQuery = useQuery({
    queryKey: ['cocktails', 'search', debounced],
    queryFn: () => searchCocktailsByName(debounced),
    enabled: debounced.trim().length > 0,
  });

  const randomQuery = useQuery({
    queryKey: ['cocktails', 'random'],
    queryFn: getRandomCocktail,
    enabled: false,
  });

  function toggleFavorite(c: Cocktail) {
    setFavorites((prev) => {
      const exists = prev.some((x) => x.id === c.id);
      return exists ? prev.filter((x) => x.id !== c.id) : [c, ...prev];
    });
  }

  const cocktails = searchQuery.data ?? [];
  const showEmpty =
    debounced.trim().length > 0 &&
    !searchQuery.isLoading &&
    cocktails.length === 0;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Find your next cocktail</h1>
        <p className={styles.subtitle}>
          Search by name (e.g. “margarita”, “negroni”, “old fashioned”).
        </p>

        <div className={styles.controls}>
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder='Search cocktails...'
            aria-label='Search cocktails'
          />
          <Button
            type='button'
            variant='ghost'
            onClick={() => randomQuery.refetch()}
            disabled={randomQuery.isFetching}
          >
            Random
          </Button>
        </div>

        {randomQuery.isFetching && (
          <Spinner label='Finding a random cocktail...' />
        )}
        {randomQuery.data && (
          <div className={styles.randomCard}>
            <img src={randomQuery.data.thumbnail} alt={randomQuery.data.name} />
            <div>
              <div className={styles.randomTitle}>{randomQuery.data.name}</div>
              <div className={styles.randomSub}>
                {[randomQuery.data.category, randomQuery.data.alcoholic]
                  .filter(Boolean)
                  .join(' • ')}
              </div>
              <Button
                type='button'
                onClick={() => toggleFavorite(randomQuery.data)}
              >
                {favoritesSet.has(randomQuery.data.id)
                  ? 'Remove Favorite'
                  : 'Save Favorite'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {searchQuery.isLoading && <Spinner label='Searching...' />}
      {searchQuery.isError && (
        <div className={styles.error}>Something went wrong. Try again.</div>
      )}
      {showEmpty && (
        <div className={styles.empty}>No results for “{debounced}”.</div>
      )}

      {cocktails.length > 0 && (
        <CocktailGrid
          cocktails={cocktails}
          favoritesSet={favoritesSet}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
