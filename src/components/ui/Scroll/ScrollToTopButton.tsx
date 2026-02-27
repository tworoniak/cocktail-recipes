import { useScrollPosition } from '../../../hooks/useScrollPosition';
import { ArrowUp } from 'lucide-react';
import styles from './ScrollToTopButton.module.scss';

const ScrollToTopButton: React.FC = () => {
  const isVisible = useScrollPosition(300);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`${styles.scrolltotop} ${isVisible ? styles.show : ''}`}
      aria-label='Scroll to top'
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default ScrollToTopButton;
