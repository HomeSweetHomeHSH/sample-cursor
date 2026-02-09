import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const taskApi = {
  getAll: (params) => api.get('/tasks', { params }).then((r) => r.data),
  create: (data) => api.post('/tasks', data).then((r) => r.data),
  toggle: (id) => api.patch(`/tasks/${id}/toggle`).then((r) => r.data),
  remove: (id) => api.delete(`/tasks/${id}`),
};

export const categoryApi = {
  getAll: () => api.get('/categories').then((r) => r.data),
  create: (name) => api.post('/categories', { name }).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`),
};
