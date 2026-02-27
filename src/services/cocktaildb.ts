import type { Cocktail, IngredientLine } from '../types/cocktail';

const API_BASE = 'https://www.thecocktaildb.com/api/json/v1/1';

/**
 * TheCocktailDB drink shape (only what we use).
 * Ingredient/Measure are numbered fields 1..15.
 */
type IngredientIndex =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;

type IngredientKey = `strIngredient${IngredientIndex}`;
type MeasureKey = `strMeasure${IngredientIndex}`;

type CocktailDbFilterDrink = {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
};

type CocktailDbFilterResponse = {
  drinks: CocktailDbFilterDrink[] | null;
};

function mapFilterDrinkToCocktail(drink: CocktailDbFilterDrink): Cocktail {
  return {
    id: drink.idDrink,
    name: drink.strDrink,
    thumbnail: drink.strDrinkThumb,
    category: undefined,
    alcoholic: undefined,
    glass: undefined,
    instructions: undefined,
    ingredients: [],
  };
}

export async function filterCocktailsByIngredient(
  ingredient: string,
): Promise<Cocktail[]> {
  const q = ingredient.trim();
  if (!q) return [];

  const data = await fetchJson<CocktailDbFilterResponse>(
    `${API_BASE}/filter.php?i=${encodeURIComponent(q)}`,
  );

  return (data.drinks ?? []).map(mapFilterDrinkToCocktail);
}

export type CocktailDbDrink = {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;

  strCategory?: string | null;
  strAlcoholic?: string | null;
  strGlass?: string | null;
  strInstructions?: string | null;

  // numbered ingredient fields
} & Partial<Record<IngredientKey, string | null>> &
  Partial<Record<MeasureKey, string | null>>;

type CocktailDbResponse = {
  drinks: CocktailDbDrink[] | null;
};

function normalizeIngredients(drink: CocktailDbDrink): IngredientLine[] {
  const lines: IngredientLine[] = [];

  const indices: IngredientIndex[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ];

  for (const i of indices) {
    const ingredient = (drink[`strIngredient${i}`] ?? '').trim();
    const measure = (drink[`strMeasure${i}`] ?? '').trim();

    if (!ingredient) continue;
    lines.push({ ingredient, measure: measure || undefined });
  }

  return lines;
}

function mapDrinkToCocktail(drink: CocktailDbDrink): Cocktail {
  return {
    id: drink.idDrink,
    name: drink.strDrink,
    thumbnail: drink.strDrinkThumb,
    category: drink.strCategory ?? undefined,
    alcoholic: drink.strAlcoholic ?? undefined,
    glass: drink.strGlass ?? undefined,
    instructions: drink.strInstructions ?? undefined,
    ingredients: normalizeIngredients(drink),
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function searchCocktailsByName(term: string): Promise<Cocktail[]> {
  const q = term.trim();
  if (!q) return [];

  const data = await fetchJson<CocktailDbResponse>(
    `${API_BASE}/search.php?s=${encodeURIComponent(q)}`,
  );

  return (data.drinks ?? []).map(mapDrinkToCocktail);
}

export async function getCocktailById(id: string): Promise<Cocktail> {
  const data = await fetchJson<CocktailDbResponse>(
    `${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`,
  );

  const drink = data.drinks?.[0];
  if (!drink) throw new Error('Cocktail not found');
  return mapDrinkToCocktail(drink);
}

export async function getRandomCocktail(): Promise<Cocktail> {
  const data = await fetchJson<CocktailDbResponse>(`${API_BASE}/random.php`);
  const drink = data.drinks?.[0];
  if (!drink) throw new Error('Cocktail not found');
  return mapDrinkToCocktail(drink);
}
