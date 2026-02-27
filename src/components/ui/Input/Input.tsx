import styles from './Input.module.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props) {
  return (
    <input
      id='search'
      {...props}
      className={`${styles.input} ${props.className ?? ''}`}
    />
  );
}
