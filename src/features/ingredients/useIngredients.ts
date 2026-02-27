import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listIngredients } from '../../services/cocktaildb';
import { useDebounce } from '../../hooks/useDebounce';

export function useIngredientAutocomplete() {
  const [input, setInput] = useState('');
  const debounced = useDebounce(input, 200);

  const q = useQuery({
    queryKey: ['ingredients', 'list'],
    queryFn: listIngredients,
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  const suggestions = useMemo(() => {
    const all = q.data ?? [];
    const term = debounced.trim().toLowerCase();
    if (!term) return [];

    return all.filter((x) => x.toLowerCase().includes(term)).slice(0, 10);
  }, [q.data, debounced]);

  return {
    input,
    setInput,
    debouncedInput: debounced,
    suggestions,
    isLoading: q.isLoading,
    isFetching: q.isFetching,
    isError: q.isError,
  };
}
