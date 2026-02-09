import apiClient from "@/lib/api-client";
import { LoginInput, RegisterInput } from "@/lib/validations/auth";

// Definimos interfaces para lo que viene dentro del 'body' del ApiResponse
interface AuthResponse {
  token: string;
  email: string;
}

export interface CreateParticipanteDTO {
  nombre: string;
  apellido: string;
  password: string;
  email: string; // Se enviará como string gracias a @JsonValue en el back
  documento: {
    tipo: "DNI" | "PASAPORTE" | "LE" | "LC"; // Ajusta según tu Enum TipoDocumento
    numero: string;
  };
}

export const authService = {
  adminLogin: async (data: LoginInput): Promise<AuthResponse> => {
    // apiClient ahora devuelve directamente el T (AuthResponse en este caso)
    return apiClient.post('/admin/auth', data, { _silent: true } as any);
  },

  participantLogin: async (data: LoginInput): Promise<AuthResponse> => {
    return apiClient.post('/auth', data);
  },

  register: async (data: CreateParticipanteDTO): Promise<any> => {
    return apiClient.post('/accounts', data);
  }
};