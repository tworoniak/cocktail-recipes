export type IngredientLine = {
  ingredient: string;
  measure?: string;
};

export type Cocktail = {
  id: string;
  name: string;
  thumbnail: string;
  category?: string;
  alcoholic?: string;
  glass?: string;
  instructions?: string;
  ingredients: IngredientLine[];
};
