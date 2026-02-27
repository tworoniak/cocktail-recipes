import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../../components/ui/Spinner/Spinner';
import { getCocktailById } from '../../services/cocktaildb';
import styles from './CocktailPage.module.scss';

export function CocktailPage() {
  const { id } = useParams<{ id: string }>();

  const q = useQuery({
    queryKey: ['cocktails', 'id', id],
    queryFn: () => getCocktailById(id!),
    enabled: !!id,
  });

  if (q.isLoading) return <Spinner label='Loading cocktail...' />;
  if (q.isError)
    return <div className={styles.error}>Could not load that cocktail.</div>;
  if (!q.data) return null;

  const c = q.data;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <img className={styles.hero} src={c.thumbnail} alt={c.name} />
        <div className={styles.info}>
          <h1 className={styles.title}>{c.name}</h1>
          <div className={styles.meta}>
            {[c.category, c.alcoholic, c.glass].filter(Boolean).join(' • ')}
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2>Ingredients</h2>
        <ul className={styles.list}>
          {c.ingredients.map((line, idx) => (
            <li key={`${line.ingredient}-${idx}`}>
              <span className={styles.measure}>{line.measure ?? ''}</span>
              <span>{line.ingredient}</span>
            </li>
          ))}
        </ul>
      </section>

      {c.instructions && (
        <section className={styles.section}>
          <h2>Instructions</h2>
          <p className={styles.instructions}>{c.instructions}</p>
        </section>
      )}
    </div>
  );
}
