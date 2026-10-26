export type ToastKind = 'success' | 'error' | 'info';

export type ToastItem = {
  id: number;
  kind: ToastKind;
  message: string;
};

export type ToastApi = {
  show: (message: string, kind?: ToastKind) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};
