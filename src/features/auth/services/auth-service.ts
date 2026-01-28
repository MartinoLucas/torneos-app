import apiClient from "@/lib/api-client";
import { LoginInput, RegisterInput } from "@/lib/validations/auth";

// Definimos interfaces para lo que viene dentro del 'body' del ApiResponse
interface AuthResponse {
  token: string;
  email: string;
}

export const authService = {
  adminLogin: async (data: LoginInput): Promise<AuthResponse> => {
    // apiClient ahora devuelve directamente el T (AuthResponse en este caso)
    return apiClient.post('/admin/auth', data);
  },

  participantLogin: async (data: LoginInput): Promise<AuthResponse> => {
    return apiClient.post('/auth', data);
  },

  register: async (data: RegisterInput): Promise<any> => {
    return apiClient.post('/account', data);
  }
};