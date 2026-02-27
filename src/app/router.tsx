import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { SearchPage } from '../pages/SearchPage/SearchPage';
import { CocktailPage } from '../pages/CocktailPage/CocktailPage';
import { FavoritesPage } from '../pages/FavoritesPage/FavoritesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <SearchPage /> },
      { path: 'cocktail/:id', element: <CocktailPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
    ],
  },
]);
