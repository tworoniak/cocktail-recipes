import styles from './Button.module.scss';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export function Button({ variant = 'primary', ...props }: Props) {
  return (
    <button
      {...props}
      className={`${styles.button} ${styles[variant]} ${props.className ?? ''}`}
    />
  );
}
