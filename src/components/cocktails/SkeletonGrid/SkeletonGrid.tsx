import styles from './SkeletonGrid.module.scss';

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className={styles.grid} aria-hidden='true'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.thumb} />
          <div className={styles.body}>
            <div className={styles.lineLg} />
            <div className={styles.lineSm} />
          </div>
        </div>
      ))}
    </div>
  );
}
