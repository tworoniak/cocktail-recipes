import styles from './Input.module.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props) {
  return (
    <input {...props} className={`${styles.input} ${props.className ?? ''}`} />
  );
}
