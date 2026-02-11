// src/features/auth/services/admin-account-service.ts
import apiClient from "@/lib/api-client";

export const adminAccountService = {
  getAll: () => apiClient.get('/admin/accounts'),
  getById: (id: string) => apiClient.get(`/admin/accounts/${id}`),
  create: (data: any) => apiClient.post('/admin/accounts', data),
  update: (id: string, data: any) => apiClient.put(`/admin/accounts/${id}`, data),
  activate: (id: string) => apiClient.put(`/admin/accounts/${id}/activate`),
  deactivate: (id: string) => apiClient.put(`/admin/accounts/${id}/deactivate`),
};