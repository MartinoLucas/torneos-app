import apiClient from "@/lib/api-client";

export interface InscriptionRequest {
  tournamentId: number;
  competitionId: number;
}

export const inscriptionService = {
  /**
   * Crea una nueva inscripción.
   * El endpoint según tu controlador es POST /tournament/{tId}/competitions/{cId}/inscription
   */
  create: async (tournamentId: string | number, competitionId: string | number, userId: string | number) => {    
    return apiClient.post(`/tournaments/${tournamentId}/competitions/${competitionId}/inscriptions`,
       {
        competenciaId: competitionId, 
        participanteId: userId, 
        fechaInscripcion: new Date().toISOString()
      }
    );
  },

  /**
   * Obtiene las inscripciones del participante actual
   */
  getMyInscriptions: async (id: string | number) => {
    return apiClient.get(`/inscriptions-participant/${id}`);
  }
};