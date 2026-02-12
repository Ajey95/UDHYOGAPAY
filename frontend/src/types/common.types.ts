export interface Notification {
  _id: string;
  type: 'booking' | 'payment' | 'review' | 'system' | 'message';
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: string;
}

export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type ThemeMode = 'light' | 'dark';

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface FilterOptions {
  [key: string]: any;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
