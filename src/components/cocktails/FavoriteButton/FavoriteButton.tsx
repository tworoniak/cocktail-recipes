import styles from './FavoriteButton.module.scss';

export function FavoriteButton({
  active,
  onClick,
  ariaLabel,
}: {
  active: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type='button'
      className={`${styles.btn} ${active ? styles.active : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {active ? '★' : '☆'}
    </button>
  );
}
