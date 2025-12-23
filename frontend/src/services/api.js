import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  },
};

export const subscriptionAPI = {
  getPlans: async () => {
    const response = await apiClient.get('/api/subscriptions/plans');
    return response.data;
  },
  
  getMySubscriptions: async () => {
    const response = await apiClient.get('/api/subscriptions/my-subscriptions');
    return response.data;
  },
  
  subscribe: async (planId) => {
    const response = await apiClient.post('/api/subscriptions/subscribe', { planId });
    return response.data;
  },
  
  cancelSubscription: async (subscriptionId) => {
    const response = await apiClient.put(`/api/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/api/users/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/api/users/profile', profileData);
    return response.data;
  },
};

export const healthAPI = {
  check: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;