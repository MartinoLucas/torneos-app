import apiClient from "@/lib/api-client";

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
  precio: number;
  cupo: number;
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
};