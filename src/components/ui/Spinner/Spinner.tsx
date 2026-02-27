import styles from './Spinner.module.scss';

export function Spinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className={styles.wrap} role='status' aria-live='polite'>
      <div className={styles.spinner} aria-hidden='true' />
      <div className={styles.label}>{label}</div>
    </div>
  );
}
