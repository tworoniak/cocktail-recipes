import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { Spinner } from '../../components/ui/Spinner/Spinner';
import { useDebounce } from '../../hooks/useDebounce';
import { useFavorites } from '../../features/favorites/useFavorites';
import { useIngredientAutocomplete } from '../../features/ingredients/useIngredients';
import { CocktailGrid } from '../../components/cocktails/CocktailGrid/CocktailGrid';
import styles from './SearchPage.module.scss';
import {
  filterCocktailsByIngredients,
  getRandomCocktail,
  searchCocktailsByName,
} from '../../services/cocktaildb';

export function SearchPage() {
  const [term, setTerm] = useState('');
  const [mode, setMode] = useState<'name' | 'ingredient'>('name');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const debounced = useDebounce(term, 350);
  const ia = useIngredientAutocomplete();
  const { favoritesSet, toggleFavorite } = useFavorites();

  const searchQuery = useQuery({
    queryKey:
      mode === 'name'
        ? ['cocktails', 'name', debounced]
        : ['cocktails', 'ingredients', selectedIngredients],
    queryFn: () =>
      mode === 'name'
        ? searchCocktailsByName(debounced)
        : filterCocktailsByIngredients(selectedIngredients),
    enabled:
      mode === 'name'
        ? debounced.trim().length > 0
        : selectedIngredients.length > 0,
  });

  const randomQuery = useQuery({
    queryKey: ['cocktails', 'random'],
    queryFn: getRandomCocktail,
    enabled: false,
  });

  const cocktails = searchQuery.data ?? [];
  const showEmpty =
    searchQuery.isFetched && !searchQuery.isLoading && cocktails.length === 0;

  function addIngredient(value: string) {
    const v = value.trim();
    if (!v) return;

    setSelectedIngredients((prev) => {
      const exists = prev.some((x) => x.toLowerCase() === v.toLowerCase());
      return exists ? prev : [...prev, v];
    });

    ia.setInput('');
  }

  function removeIngredient(value: string) {
    setSelectedIngredients((prev) => prev.filter((x) => x !== value));
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Find your next cocktail</h1>
        <p className={styles.subtitle}>
          Search by name (e.g. “margarita”, “negroni”, “old fashioned”).
        </p>

        <div className={styles.modeRow}>
          <button
            type='button'
            className={`${styles.modeBtn} ${mode === 'name' ? styles.modeActive : ''}`}
            onClick={() => setMode('name')}
          >
            Name
          </button>
          <button
            type='button'
            className={`${styles.modeBtn} ${mode === 'ingredient' ? styles.modeActive : ''}`}
            onClick={() => setMode('ingredient')}
          >
            Ingredients
          </button>
        </div>
        {mode === 'name' ? (
          <div className={styles.controls}>
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder='Search cocktails (e.g. margarita)...'
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
        ) : (
          <div className={styles.ingredientArea}>
            <div className={styles.controls}>
              <Input
                value={ia.input}
                onChange={(e) => ia.setInput(e.target.value)}
                placeholder='Add an ingredient (e.g. gin, lime)...'
                aria-label='Ingredient input'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addIngredient(ia.input);
                  }
                  if (e.key === 'Escape') ia.setInput('');
                }}
              />
              <Button
                type='button'
                variant='ghost'
                onClick={() => addIngredient(ia.input)}
              >
                Add
              </Button>
            </div>

            {ia.suggestions.length > 0 && (
              <div
                className={styles.suggestBox}
                role='listbox'
                aria-label='Ingredient suggestions'
              >
                {ia.suggestions.map((s) => (
                  <button
                    key={s}
                    type='button'
                    className={styles.suggestItem}
                    onClick={() => addIngredient(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {selectedIngredients.length > 0 && (
              <div className={styles.chips}>
                {selectedIngredients.map((ing) => (
                  <button
                    key={ing}
                    type='button'
                    className={styles.chip}
                    onClick={() => removeIngredient(ing)}
                    title='Remove ingredient'
                  >
                    {ing} <span aria-hidden='true'>×</span>
                  </button>
                ))}

                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => setSelectedIngredients([])}
                >
                  Clear
                </Button>
              </div>
            )}

            <div className={styles.hint}>
              Results show cocktails that include <strong>all</strong> selected
              ingredients.
            </div>
          </div>
        )}

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
        <div className={styles.empty}>
          {mode === 'name'
            ? `No results for “${debounced}”.`
            : `No cocktails found with: ${selectedIngredients.join(', ')}`}
        </div>
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
