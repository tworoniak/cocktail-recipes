import { NavLink, Outlet } from 'react-router-dom';
import styles from './App.module.scss';

export default function App() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>🍸 Cocktail Recipes</div>

        <nav className={styles.nav}>
          <NavLink
            to='/'
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Search
          </NavLink>
          <NavLink
            to='/favorites'
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Favorites
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
