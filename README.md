# 🍸 Cocktail Recipes

A modern **React + TypeScript + Vite + Sass** app for discovering cocktail recipes using **TheCocktailDB**.

Search cocktails by **name** or **build a multi-ingredient query** with smart autocomplete. View detailed recipes, and save your favorites — all with a polished, responsive UI.

---

## 🚀 Live Demo

https://cocktail-recipes-kappa.vercel.app

---

## ✨ Features

- 🔎 Search cocktails by **name**
- 🧪 Multi-ingredient search with:
  - Autocomplete suggestions
  - Keyboard navigation (↑ ↓ Enter Esc)
  - Include ALL (intersection) or Include ANY (union) toggle
- 🎲 Random cocktail (name mode)
- 📄 Detailed cocktail page (ingredients + instructions)
- ⭐ Favorites with localStorage persistence
- 🔔 Toast notifications (add/remove favorites)
- 💀 Skeleton loading states for improved UX
- ⚡ React Query caching + request deduplication
- ♿ Accessible interactions (ARIA roles + keyboard support)
- 🎨 Modular SCSS architecture (tokens, mixins, responsive utilities)

---

## 🧰 Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack React Query
- Sass (SCSS Modules)

---

## 🌐 API

- This project uses TheCocktailDB public API:
- Search by name: search.php?s=...
- Filter by ingredient: filter.php?i=...
- Lookup by id: lookup.php?i=...
- Random: random.php
- Ingredient autocomplete uses list.php?i=list
- Multi-ingredient matching is done by intersecting multiple filter.php?i= calls (free-tier workaround) since native multi-ingredient filtering is Premium-only

Note: ingredient filtering returns “light” results (id/name/thumb). Full details are fetched on the details page.

---

## ✅ Roadmap

- Ingredient search refinements (multi-ingredient, suggestions)
- Filters (alcoholic/non-alcoholic, glass, category)
- Modal details view (optional)
- Toast notifications for favorites
- Better loading UX (skeleton cards)

---

## 🗂 Project Structure (high level)

```code
src/
  app/
    App.module.scss
    App.tsx
    providers.tsx
    router.tsx

  pages/
    CocktailPage/
        CocktailPage.module.scss
        CocktailPage.tsx
    FavoritesPage/
        FavoritesPage.module.scss
        FavoritesPage.tsx
    SearchPage/
        SearchPage.module.scss
        SearchPage.tsx


  components/
    ui/
        Button/
            Button.module.scss
            Button.tsx
        InlineSpinner/
            InlineSpinner.module.scss
            InlineSpinner.tsx
        Input/
            Input.module.scss
            Input.tsx
        Scroll/
            ScrollToTop.tsx
            ScrollToTopButton.module.scss
            ScrollToTopButton.tsx
        Spinner/
            Spinner.module.scss
            Spinner.tsx

    cocktails/
        CocktailCard/
            CocktailCard.module.scss
            CocktailCard.tsx
        CocktailGrid/
            CocktailGrid.module.scss
            CocktailGrid.tsx
        FavoriteButton/
            FavoriteButton.module.scss
            FavoriteButton.tsx
        SkeletonGrid/
            SkeletonGrid.module.scss
            SkeletonGrid.tsx

  features/
    favorites/
        useFavorites.ts
    ingredients/
        useIngredients.ts
    toast/
        toast.context.ts
        toast.module.scss
        ToastProvider.tsx

  hooks/
    useDebounce.ts
    useLocalStorageState.ts
    useScrollPosition.ts

  services/
    cocktaildb.ts

  styles/
    abstracts/
        _index.scss
        _mixins.scss
        _tokens.scss
        _variables.scss
    base/
        _base.scss
        _index.scss
        _reset.scss
        _typography.scss
    main.scss

  types/
    cocktail.ts

main.tsx
```

---

## 🚀 Getting Started

### Install

```bash
npm install
```
