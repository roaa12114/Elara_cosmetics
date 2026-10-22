import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiError } from '@shared/types';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// Attach token to every request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('elara_access_token');
  if (token && config.headers) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// Unwrap 'data' envelope, reject on success === false, handle 401
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as unknown;
    if (body && typeof body === 'object' && 'success' in (body as object)) {
      const envelope = body as {
        success?: boolean;
        message?: string;
        data?: unknown;
      };
      if (envelope.success === false) {
        return Promise.reject({
          message: envelope.message ?? 'Request failed',
          status: response.status,
          details: body,
        } as ApiError);
      }
      if ('data' in envelope) {
        response.data = envelope.data;
      }
    }
    return response;
  },
  (error: AxiosError<{ message?: string; success?: boolean }>) => {
    const status = error.response?.status ?? 0;
    const body = error.response?.data;
    const message =
      body?.message ?? error.message ?? 'Unknown error';

    if (status === 401) {
      localStorage.removeItem('elara_access_token');
      localStorage.removeItem('elara_user');
      const p = window.location.pathname;
      if (
        !p.startsWith('/sign-in') &&
        !p.startsWith('/seller/sign-in') &&
        !p.startsWith('/sign-up') &&
        !p.startsWith('/seller/sign-up') &&
        !p.startsWith('/confirm-email')
      ) {
        window.location.href = '/sign-in';
      }
    }

    return Promise.reject({
      message,
      status,
      details: body,
    } as ApiError);
  }
);

// Typed helpers — response.data is already unwrapped by the interceptor
export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(url, { params }).then((r) => r.data),
  post: <T>(url: string, body?: unknown) =>
    apiClient.post<T>(url, body).then((r) => r.data),
  patch: <T>(url: string, body?: unknown) =>
    apiClient.patch<T>(url, body).then((r) => r.data),
  put: <T>(url: string, body?: unknown) =>
    apiClient.put<T>(url, body).then((r) => r.data),
  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then((r) => r.data),
};
