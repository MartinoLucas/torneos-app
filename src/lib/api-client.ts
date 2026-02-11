import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '@/types/api';
import { toast } from 'sonner';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _silent?: boolean;
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const isAdminRoute = config.url?.includes('/admin');
      const token = localStorage.getItem(isAdminRoute ? 'auth_token_admin' : 'auth_token_participant');
      
      if (token && config.headers) {
        config.headers['Authorization'] = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de Respuesta: Desenvolvemos el ApiResponse de Java 
 * y manejamos errores globales con notificaciones.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response.data.body;
  },
  async (error) => {
    const apiError = error.response?.data as ApiError;
    
    const errorInfo = {
      title: apiError?.title || "Error de conexión",
      detail: apiError?.detail || "No se pudo establecer comunicación con el servidor.",
      code: apiError?.code || error.response?.status || 500
    };

    // Si la configuración de la petición tiene _silent: true, no mostramos el toast
    if (!error.config?._silent) {
      const { toast } = await import("sonner");
      toast.error(errorInfo.title, {
        description: errorInfo.detail,
      });
    }

    if (error.response?.status === 401) {
      toast.error("Sesión expirada", {
        description: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
      });
      localStorage.removeItem('auth_token_admin');
      localStorage.removeItem('auth_token_participant');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }

    return Promise.reject(errorInfo);
  }
);

export default apiClient;