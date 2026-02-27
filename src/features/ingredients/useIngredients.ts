import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listIngredients } from '../../services/cocktaildb';

export function useIngredientAutocomplete() {
  const [input, setInput] = useState('');

  const q = useQuery({
    queryKey: ['ingredients', 'list'],
    queryFn: listIngredients,
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  const suggestions = useMemo(() => {
    const all = q.data ?? [];
    const term = input.trim().toLowerCase();
    if (!term) return [];
    return all.filter((x) => x.toLowerCase().includes(term)).slice(0, 10);
  }, [q.data, input]);

  return {
    input,
    setInput,
    allIngredients: q.data ?? [],
    suggestions,
    isLoading: q.isLoading,
    isError: q.isError,
  };
}
