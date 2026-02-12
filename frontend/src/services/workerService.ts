import api from './api';
import type { ApiResponse, Worker, WorkerProfile, WorkerStats, PaginatedResponse } from '../types';

/**
 * Worker Service
 */
export const workerService = {
  /**
   * Get all workers
   */
  getAll: async (params?: any): Promise<PaginatedResponse<Worker>> => {
    const response = await api.get('/workers', { params });
    return response.data;
  },

  /**
   * Get workers near location
   */
  getNearby: async (lat: number, lng: number, profession?: string, maxDistance?: number) => {
    const response = await api.get('/workers/nearby', {
      params: { lat, lng, profession, maxDistance },
    });
    return response.data.data;
  },

  /**
   * Get worker by ID
   */
  getById: async (id: string): Promise<WorkerProfile> => {
    const response = await api.get<ApiResponse<WorkerProfile>>(`/workers/${id}`);
    return response.data.data!;
  },

  /**
   * Create worker profile
   */
  create: async (data: any): Promise<Worker> => {
    const response = await api.post<ApiResponse<Worker>>('/workers', data);
    return response.data.data!;
  },

  /**
   * Update worker profile
   */
  update: async (id: string, data: any): Promise<Worker> => {
    const response = await api.put<ApiResponse<Worker>>(`/workers/${id}`, data);
    return response.data.data!;
  },

  /**
   * Update worker location
   */
  updateLocation: async (lat: number, lng: number): Promise<void> => {
    await api.put('/workers/location', { coordinates: [lng, lat] });
  },

  /**
   * Toggle availability
   */
  toggleAvailability: async (available: boolean): Promise<void> => {
    await api.put('/workers/availability', { available });
  },

  /**
   * Upload KYC documents
   */
  uploadKYC: async (formData: FormData): Promise<void> => {
    await api.post('/workers/kyc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Get worker stats
   */
  getStats: async (): Promise<WorkerStats> => {
    const response = await api.get<ApiResponse<WorkerStats>>('/workers/stats');
    return response.data.data!;
  },

  /**
   * Get worker reviews
   */
  getReviews: async (workerId: string) => {
    const response = await api.get(`/workers/${workerId}/reviews`);
    return response.data.data;
  },

  /**
   * Get earnings
   */
  getEarnings: async (period?: 'week' | 'month' | 'year') => {
    const response = await api.get('/workers/earnings', { params: { period } });
    return response.data.data;
  },

  /**
   * Request withdrawal
   */
  requestWithdrawal: async (amount: number, bankDetails: any) => {
    const response = await api.post('/workers/withdraw', { amount, bankDetails });
    return response.data.data;
  },

  /**
   * Delete worker profile
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/workers/${id}`);
  },
};

export default workerService;
