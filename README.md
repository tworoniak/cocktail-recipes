# 🍸 Cocktail Recipes

A modern **React + TypeScript + Vite + Sass** app for discovering cocktail recipes using **TheCocktailDB**.

Search cocktails by **name** or **ingredient**, view details, and save your favorites (persisted in `localStorage`).

---

## ✨ Features

- 🔎 Search cocktails by **name**
- 🧪 Search cocktails by **ingredient**
- 🎲 Random cocktail (name mode)
- 📄 Cocktail details page (ingredients + instructions)
- ⭐ Favorites (add/remove) with persistence via `localStorage`
- ⚡ Fast dev experience with Vite
- 🎨 SCSS Modules + global tokens/reset

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
  app/                # app shell, router, providers
  pages/              # route pages (Search, Cocktail, Favorites)
  components/
    ui/               # shared UI components
    cocktails/        # cocktail-specific components
  features/
    favorites/        # favorites hook + shared logic
  hooks/              # reusable hooks (debounce, localStorage)
  services/           # API services (cocktaildb)
  styles/             # tokens, reset, global styles
  types/              # shared TypeScript types
```

---

## 🚀 Getting Started

### Install

```bash
npm install
```
