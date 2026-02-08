import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '@/types/api';

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
    // Si el backend responde con ApiResponse, devolvemos solo el body (T)
    return response.data.body;
  },
  async (error) => {
    // Extraemos la estructura de ApiError de Java
    const apiError = error.response?.data as ApiError;
    
    // Objeto de error normalizado para el frontend
    const errorInfo = {
      title: apiError?.title || "Error de conexión",
      detail: apiError?.detail || "No se pudo establecer comunicación con el servidor.",
      code: apiError?.code || error.response?.status || 500
    };

    // Disparamos el Toast automáticamente
    const { toast } = await import("sonner");
    toast.error(errorInfo.title, {
      description: errorInfo.detail,
    });

    if (error.response?.status === 401) {
      console.warn("Sesión expirada o no autorizada");
      // Opcional: localStorage.clear(); window.location.href = '/login';
    }

    // Retornamos un objeto predecible para que el .catch() de los componentes no explote
    return Promise.reject(errorInfo);
  }
);

export default apiClient;