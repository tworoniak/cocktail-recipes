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

type CocktailDbIngredientListItem = { strIngredient1: string };
type CocktailDbIngredientListResponse = {
  drinks: CocktailDbIngredientListItem[] | null;
};

export async function listIngredients(): Promise<string[]> {
  const data = await fetchJson<CocktailDbIngredientListResponse>(
    `${API_BASE}/list.php?i=list`,
  );
  return (data.drinks ?? [])
    .map((d) => d.strIngredient1)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

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

export async function filterCocktailsByIngredients(
  ingredients: string[],
  match: 'all' | 'any' = 'all',
): Promise<Cocktail[]> {
  const cleaned = ingredients.map((s) => s.trim()).filter(Boolean);
  if (cleaned.length === 0) return [];
  if (cleaned.length === 1) return filterCocktailsByIngredient(cleaned[0]);

  const lists = await Promise.all(cleaned.map(filterCocktailsByIngredient));

  if (match === 'any') {
    // Union (dedupe by id)
    const byId = new Map<string, Cocktail>();
    for (const list of lists) {
      for (const c of list) byId.set(c.id, c);
    }
    return [...byId.values()];
  }

  // 'all' — intersect by id
  const counts = new Map<string, { c: Cocktail; n: number }>();
  for (const list of lists) {
    for (const c of list) {
      const entry = counts.get(c.id);
      if (!entry) counts.set(c.id, { c, n: 1 });
      else counts.set(c.id, { c: entry.c, n: entry.n + 1 });
    }
  }

  return [...counts.values()]
    .filter((x) => x.n === cleaned.length)
    .map((x) => x.c);
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
