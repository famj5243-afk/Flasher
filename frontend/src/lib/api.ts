import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

// Templates API
export const templatesAPI = {
  list: (params?: { category?: string; isPublic?: boolean }) =>
    api.get('/templates', { params }),
  get: (id: string) => api.get(`/templates/${id}`),
  create: (data: any) => api.post('/templates', data),
  update: (id: string, data: any) => api.patch(`/templates/${id}`, data),
  delete: (id: string) => api.delete(`/templates/${id}`),
};

// Emails API
export const emailsAPI = {
  send: (data: {
    templateId: string;
    recipientEmail: string;
    variables?: Record<string, any>;
    replyToEmail?: string;
  }) => api.post('/emails/send', data),
  getStats: () => api.get('/emails/stats'),
};

// Logs API
export const logsAPI = {
  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    templateId?: string;
  }) => api.get('/logs', { params }),
  getRecent: (limit?: number) =>
    api.get('/logs/recent', { params: { limit } }),
  get: (id: string) => api.get(`/logs/${id}`),
};

// API Keys API
export const apiKeysAPI = {
  list: () => api.get('/api-keys'),
  create: (data: { name: string; permissions?: string[]; rateLimit?: number }) =>
    api.post('/api-keys', data),
  revoke: (id: string) => api.patch(`/api-keys/${id}/revoke`),
};
