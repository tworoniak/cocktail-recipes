import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { Spinner } from '../../components/ui/Spinner/Spinner';

import { useDebounce } from '../../hooks/useDebounce';
import { useFavorites } from '../../features/favorites/useFavorites';
import { useIngredientAutocomplete } from '../../features/ingredients/useIngredients';
import { SkeletonGrid } from '../../components/cocktails/SkeletonGrid/SkeletonGrid';
import {
  filterCocktailsByIngredients,
  getRandomCocktail,
  searchCocktailsByName,
} from '../../services/cocktaildb';

import styles from './SearchPage.module.scss';
import { CocktailGrid } from '../../components/cocktails/CocktailGrid/CocktailGrid';

export function SearchPage() {
  const [mode, setMode] = useState<'name' | 'ingredient'>('name');

  // name search
  const [term, setTerm] = useState('');
  const debounced = useDebounce(term, 350);

  // ingredient search
  const ia = useIngredientAutocomplete();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientMatch, setIngredientMatch] = useState<'all' | 'any'>('all');
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);

  const suggestions = ia.suggestions;

  const { favoritesSet, toggleFavorite } = useFavorites();

  const searchQuery = useQuery({
    queryKey:
      mode === 'name'
        ? ['cocktails', 'name', debounced]
        : ['cocktails', 'ingredients', ingredientMatch, selectedIngredients],
    queryFn: () =>
      mode === 'name'
        ? searchCocktailsByName(debounced)
        : filterCocktailsByIngredients(selectedIngredients, ingredientMatch),
    enabled:
      mode === 'name'
        ? debounced.trim().length > 0
        : selectedIngredients.length > 0,
    placeholderData: (prev) => prev,
  });

  const randomQuery = useQuery({
    queryKey: ['cocktails', 'random'],
    queryFn: getRandomCocktail,
    enabled: false,
  });

  function addIngredient(value: string) {
    const v = value.trim();
    if (!v) return;

    setSelectedIngredients((prev) => {
      const exists = prev.some((x) => x.toLowerCase() === v.toLowerCase());
      return exists ? prev : [...prev, v];
    });

    ia.setInput('');
    setActiveSuggestion(-1);
  }

  function removeIngredient(value: string) {
    setSelectedIngredients((prev) => prev.filter((x) => x !== value));
  }

  const cocktails = searchQuery.data ?? [];
  const showEmpty =
    searchQuery.isFetched && !searchQuery.isLoading && cocktails.length === 0;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Find your next cocktail</h1>
        <p className={styles.subtitle}>
          Search by name or build an ingredient list.
        </p>

        {/* Mode toggle */}
        <div className={styles.modeRow}>
          <button
            type='button'
            className={`${styles.modeBtn} ${
              mode === 'name' ? styles.modeActive : ''
            }`}
            onClick={() => {
              setMode('name');
              ia.setInput('');
              setActiveSuggestion(-1);
            }}
          >
            Name
          </button>
          <button
            type='button'
            className={`${styles.modeBtn} ${
              mode === 'ingredient' ? styles.modeActive : ''
            }`}
            onClick={() => {
              setMode('ingredient');
              setTerm('');
              setActiveSuggestion(-1);
            }}
          >
            Ingredients
          </button>
        </div>

        {/* NAME MODE */}
        {mode === 'name' ? (
          <>
            <div className={styles.controls}>
              <Input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder='Search cocktails (e.g. margarita)...'
                aria-label='Search cocktails by name'
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
                <img
                  src={randomQuery.data.thumbnail}
                  alt={randomQuery.data.name}
                />
                <div>
                  <div className={styles.randomTitle}>
                    {randomQuery.data.name}
                  </div>
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
          </>
        ) : (
          /* INGREDIENT MODE */
          <div className={styles.ingredientArea}>
            {/* Match toggle */}
            <div className={styles.matchRow} aria-label='Ingredient match mode'>
              <button
                type='button'
                className={`${styles.matchBtn} ${
                  ingredientMatch === 'all' ? styles.matchActive : ''
                }`}
                onClick={() => setIngredientMatch('all')}
              >
                Include ALL
              </button>
              <button
                type='button'
                className={`${styles.matchBtn} ${
                  ingredientMatch === 'any' ? styles.matchActive : ''
                }`}
                onClick={() => setIngredientMatch('any')}
              >
                Include ANY
              </button>
            </div>

            {/* Ingredient input */}
            <div className={styles.controls}>
              <Input
                value={ia.input}
                onChange={(e) => {
                  ia.setInput(e.target.value);
                  setActiveSuggestion(-1);
                }}
                placeholder='Add an ingredient (e.g. gin, lime)...'
                aria-label='Ingredient input'
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (suggestions.length === 0) return;

                    setActiveSuggestion((i) => {
                      const next = i + 1;
                      return next >= suggestions.length ? 0 : next;
                    });
                    return;
                  }

                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (suggestions.length === 0) return;

                    setActiveSuggestion((i) => {
                      if (i <= 0) return suggestions.length - 1;
                      return i - 1;
                    });
                    return;
                  }

                  if (e.key === 'Enter') {
                    e.preventDefault();

                    const picked =
                      activeSuggestion >= 0 &&
                      activeSuggestion < suggestions.length
                        ? suggestions[activeSuggestion]
                        : ia.input;

                    addIngredient(picked);
                    setActiveSuggestion(-1);
                    return;
                  }

                  if (e.key === 'Escape') {
                    e.preventDefault();
                    ia.setInput('');
                    setActiveSuggestion(-1);
                    return;
                  }
                }}
              />
              <Button
                type='button'
                variant='ghost'
                onClick={() => {
                  addIngredient(ia.input);
                  setActiveSuggestion(-1);
                }}
              >
                Add
              </Button>
            </div>

            {/* status line */}
            {ia.isError && (
              <div className={styles.inlineNotice}>
                Couldn’t load ingredient suggestions. You can still type and add
                ingredients manually.
              </div>
            )}

            {(ia.isLoading || ia.isFetching) && (
              <div className={styles.inlineNotice}>
                Loading ingredient list…
              </div>
            )}

            {/* Suggestions */}
            {!ia.isLoading && !ia.isFetching && suggestions.length > 0 && (
              <div
                className={styles.suggestBox}
                role='listbox'
                aria-label='Ingredient suggestions'
              >
                {suggestions.map((s, idx) => (
                  <button
                    key={s}
                    type='button'
                    role='option'
                    aria-selected={idx === activeSuggestion}
                    className={`${styles.suggestItem} ${
                      idx === activeSuggestion ? styles.suggestActive : ''
                    }`}
                    onMouseEnter={() => setActiveSuggestion(idx)}
                    onClick={() => addIngredient(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Chips */}
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
              Results show cocktails that include{' '}
              <strong>{ingredientMatch === 'all' ? 'all' : 'any'}</strong>{' '}
              selected ingredients.
            </div>
          </div>
        )}
      </div>

      {/* Results area */}
      {searchQuery.isLoading && <SkeletonGrid count={12} />}

      {searchQuery.isError && (
        <div className={styles.error}>Something went wrong. Try again.</div>
      )}

      {showEmpty && (
        <div className={styles.empty}>
          {mode === 'name'
            ? `No results for “${debounced}”.`
            : selectedIngredients.length === 0
              ? 'Add at least one ingredient.'
              : ingredientMatch === 'all'
                ? `No cocktails found with: ${selectedIngredients.join(', ')}`
                : `No cocktails found for any of: ${selectedIngredients.join(', ')}`}
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
