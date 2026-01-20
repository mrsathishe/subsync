import axios from 'axios';

// Use relative paths in production, absolute URL in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
      // Don't redirect if we're already on the login page to preserve error messages
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Immediate redirect on 401
        window.location.href = '/login';
      }
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
  getPlans: async (category = null) => {
    let url = '/api/subscriptions/plans';
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },
  
  getPlansByCategory: async () => {
    const response = await apiClient.get('/api/subscriptions/plans/categories');
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

// Admin APIs
export const adminAPI = {
  // User management
  getAllUsers: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/api/users?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  updateUserRole: async (userId, role) => {
    const response = await apiClient.put(`/api/users/${userId}/role`, { role });
    return response.data;
  },
  
  updateUserStatus: async (userId, isActive) => {
    const response = await apiClient.put(`/api/users/${userId}/status`, { isActive });
    return response.data;
  },

  // Subscription plan management
  getAllPlans: async () => {
    const response = await apiClient.get('/api/subscriptions/admin/plans');
    return response.data;
  },
  
  createPlan: async (planData) => {
    const response = await apiClient.post('/api/subscriptions/admin/plans', planData);
    return response.data;
  },
  
  updatePlan: async (planId, planData) => {
    const response = await apiClient.put(`/api/subscriptions/admin/plans/${planId}`, planData);
    return response.data;
  },
  

  // Admin Subscription Management
  getAdminSubscriptions: async (page = 1, limit = 20, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    const response = await apiClient.get(`/api/subscriptions?${params}`);
    return response.data;
  },

  getAdminSubscription: async (id) => {
    const response = await apiClient.get(`/api/subscriptions/${id}`);
    return response.data;
  },

  createSubscription: async (subscriptionData) => {
    const response = await apiClient.post('/api/subscriptions', subscriptionData);
    return response.data;
  },

  updateAdminSubscription: async (id, subscriptionData) => {
    // Include the ID in the request body for update operations
    const response = await apiClient.post('/api/subscriptions', { ...subscriptionData, id });
    return response.data;
  },

  deleteAdminSubscription: async (id) => {
    const response = await apiClient.delete(`/api/subscriptions/${id}`);
    return response.data;
  },

  updateSubscriptionSharing: async (id, sharingDetails) => {
    const response = await apiClient.put(`/api/subscriptions/${id}/sharing`, { sharingDetails });
    return response.data;
  },
};

export default apiClient;