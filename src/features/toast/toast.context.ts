import { createContext, useContext } from 'react';

export type Toast = {
  id: string;
  message: string;
  variant?: 'default' | 'success';
  durationMs?: number;
};

export type ToastContextValue = {
  push: (toast: Omit<Toast, 'id'>) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
