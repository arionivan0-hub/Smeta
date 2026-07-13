import axios from 'axios';
import type { Estimate, EstimateListItem, Chapter, Position, CatalogItem, Template, Categories } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// ============================================
// Request/Response interceptor for logging
// ============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: `API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} -> ${error.response?.status || 'network'}`,
      context: 'api',
      url: window.location.href,
      details: {
        status: error.response?.status,
        data: error.response?.data,
        method: error.config?.method,
        endpoint: error.config?.url,
      },
    };

    console.error('[Smeta API]', logEntry);

    // Send to backend logging endpoint (fire and forget)
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry),
    }).catch(() => {});

    return Promise.reject(error);
  }
);

export const estimatesApi = {
  list: () => api.get<EstimateListItem[]>('/estimates/').then(r => r.data),
  get: (id: number) => api.get<Estimate>(`/estimates/${id}`).then(r => r.data),
  create: (data: { name: string; project_name?: string; client_name?: string; location?: string }) =>
    api.post<Estimate>('/estimates/', data).then(r => r.data),
  update: (id: number, data: Partial<Estimate>) =>
    api.put<Estimate>(`/estimates/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/estimates/${id}`),
  listChapters: (estimateId: number) =>
    api.get<Chapter[]>(`/estimates/${estimateId}/chapters`).then(r => r.data),
  createChapter: (estimateId: number, data: { code: string; name: string; order: number }) =>
    api.post<Chapter>(`/estimates/${estimateId}/chapters`, data).then(r => r.data),
  updateChapter: (chapterId: number, data: Partial<Chapter>) =>
    api.put<Chapter>(`/estimates/chapters/${chapterId}`, data).then(r => r.data),
  deleteChapter: (chapterId: number) =>
    api.delete(`/estimates/chapters/${chapterId}`),
  listPositions: (chapterId: number) =>
    api.get<Position[]>(`/estimates/chapters/${chapterId}/positions`).then(r => r.data),
  createPosition: (chapterId: number, data: Omit<Position, 'id' | 'chapter_id'>) =>
    api.post<Position>(`/estimates/chapters/${chapterId}/positions`, data).then(r => r.data),
  updatePosition: (positionId: number, data: Partial<Position>) =>
    api.put<Position>(`/estimates/positions/${positionId}`, data).then(r => r.data),
  deletePosition: (positionId: number) =>
    api.delete(`/estimates/positions/${positionId}`),
};

export const catalogApi = {
  list: (params?: { category?: string; search?: string }) =>
    api.get<CatalogItem[]>('/catalog/', { params }).then(r => r.data),
  search: (q: string) =>
    api.get<CatalogItem[]>('/catalog/search', { params: { q } }).then(r => r.data),
  getCategories: () =>
    api.get<Categories>('/catalog/categories').then(r => r.data),
  get: (id: number) =>
    api.get<CatalogItem>(`/catalog/${id}`).then(r => r.data),
  create: (data: Omit<CatalogItem, 'id' | 'last_updated'>) =>
    api.post<CatalogItem>('/catalog/', data).then(r => r.data),
  update: (id: number, data: Partial<CatalogItem>) =>
    api.put<CatalogItem>(`/catalog/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/catalog/${id}`),
};

export const templatesApi = {
  list: () => api.get<Template[]>('/templates/').then(r => r.data),
  get: (id: number) => api.get<Template>(`/templates/${id}`).then(r => r.data),
  create: (data: { name: string; description?: string; category?: string; chapters_json?: any[] }) =>
    api.post<Template>('/templates/', data).then(r => r.data),
  delete: (id: number) => api.delete(`/templates/${id}`),
  apply: (id: number, name: string) =>
    api.post<{ estimate_id: number }>(`/templates/${id}/apply`, null, { params: { name } }).then(r => r.data),
};

export const importExportApi = {
  exportExcel: (estimateId: number) =>
    api.get(`/export/${estimateId}/excel`, { responseType: 'blob' }),
  exportPdf: (estimateId: number) =>
    api.get(`/export/${estimateId}/pdf`, { responseType: 'blob' }),
  importExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/import/excel', formData);
  },
};
