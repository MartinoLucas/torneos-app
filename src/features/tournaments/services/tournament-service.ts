import apiClient from "@/lib/api-client";
import { get } from "http";

export interface Tournament {
  id: number;
  nombre: string;       // Cambiado de 'name'
  descripcion: string;  // Cambiado de 'description'
  fechaInicio: string;  // Cambiado de 'startDate'
  fechaFin: string;     // Cambiado de 'finishDate'
  estado: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Competition {
  id: number;
  nombre: string;
  descripcion: string;
  precioBase: {
    amount: number;
    currency: string;
  };
  cupo: number;
  inscriptosActuales: number;
}

export const tournamentService = {
  // GET /tournaments (Público/Participante)
  getUpcoming: async (): Promise<PaginatedResponse<Tournament>> => {
    return apiClient.get('/tournaments');
  },

  // GET /tournament/:id
  getById: async (id: string): Promise<Tournament> => {
    return apiClient.get(`/tournaments/${id}`);
  },

  getCompetitions: async (tournamentId: string | number): Promise<PaginatedResponse<Competition>> => {
    return apiClient.get(`/tournaments/${tournamentId}/competitions`);
  },

  createTournament: async (data: any) => {
    return apiClient.post('/admin/tournaments', data);
  },

  updateTournament: async (id: number, data: any) => {
    return apiClient.put(`/admin/tournaments/${id}`, data);
  },
  publish: async (id: string | number) => {
    return apiClient.put(`/admin/tournaments/${id}/publish`, {});
  },

  finalize: async (id: string | number) => {
    return apiClient.put(`/admin/tournaments/${id}/finalize`, {});
  },

  deleteDraft: async (id: string | number) => {
    return apiClient.delete(`/admin/tournaments/${id}`);
  },

  createCompetition: async (tournamentId: string | number, data: any) => {
    return apiClient.post(`/admin/tournaments/${tournamentId}`, data);
  },
  
  getAllAdmin: async (): Promise<PaginatedResponse<Tournament>> => {
    return apiClient.get('/admin/tournaments');
  },

};