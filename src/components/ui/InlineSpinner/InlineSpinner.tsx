import styles from './InlineSpinner.module.scss';

export function InlineSpinner({ label }: { label?: string }) {
  return (
    <div className={styles.wrap} aria-label={label ?? 'Loading'} role='status'>
      <div className={styles.dot} />
    </div>
  );
}
