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
        config.headers['authentication'] = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de Respuesta: Desenvolvemos el ApiResponse de Java
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // Si el backend responde con ApiResponse, devolvemos solo el body (T)
    return response.data.body;
  },
  (error) => {
    // Si hay un error, intentamos extraer la estructura de ApiError de Java
    const apiError = error.response?.data as ApiError;
    
    if (apiError) {
      // Podemos loguear o lanzar un error con el mensaje amigable del backend
      console.error(`[API Error ${apiError.code}]: ${apiError.title} - ${apiError.detail}`);
    }

    if (error.response?.status === 401) {
      console.warn("Sesión expirada");
    }
    
    return Promise.reject(apiError || error);
  }
);

export default apiClient;