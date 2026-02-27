import React, { useCallback, useMemo, useState } from 'react';
import styles from './toast.module.scss';
import { ToastContext, type Toast } from './toast.context';

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = makeId();
    const durationMs = toast.durationMs ?? 2400;

    setToasts((prev) => [...prev, { id, ...toast, durationMs }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className={styles.viewport}
        aria-live='polite'
        aria-relevant='additions'
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${t.variant === 'success' ? styles.success : ''}`}
            role='status'
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
