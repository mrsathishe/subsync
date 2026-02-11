import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configure API base URL - matches backend server port
const API_BASE_URL = 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token from secure store:', error);
  }
  return config;
});

// Handle auth errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth data on 401
      try {
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('user');
      } catch (secureStoreError) {
        console.error('Error clearing auth data:', secureStoreError);
      }
      // Navigation to login would be handled by the auth context
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
};

export const subscriptionAPI = {
  getPlans: async (category = null) => {
    let url = '/subscriptions/plans';
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },
  
  getPlansByCategory: async () => {
    const response = await apiClient.get('/subscriptions/plans/categories');
    return response.data;
  },
  
  getMySubscriptions: async () => {
    const response = await apiClient.get('/subscriptions/my-subscriptions');
    return response.data;
  },
  
  subscribe: async (planId) => {
    const response = await apiClient.post('/subscriptions/subscribe', { planId });
    return response.data;
  },
  
  cancelSubscription: async (subscriptionId) => {
    const response = await apiClient.put(`/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },
};

// Admin APIs
export const adminAPI = {
  // User management
  getAllUsers: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  updateUserRole: async (userId, role) => {
    const response = await apiClient.put(`/users/${userId}/role`, { role });
    return response.data;
  },
  
  updateUserStatus: async (userId, isActive) => {
    const response = await apiClient.put(`/users/${userId}/status`, { isActive });
    return response.data;
  },

  // Subscription plan management
  getAllPlans: async () => {
    const response = await apiClient.get('/subscriptions/admin/plans');
    return response.data;
  },
  
  createPlan: async (planData) => {
    const response = await apiClient.post('/subscriptions/admin/plans', planData);
    return response.data;
  },
  
  updatePlan: async (planId, planData) => {
    const response = await apiClient.put(`/subscriptions/admin/plans/${planId}`, planData);
    return response.data;
  },

  // Admin Subscription Management
  getAdminSubscriptions: async (page = 1, limit = 20, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    const response = await apiClient.get(`/subscriptions?${params}`);
    return response.data;
  },

  getAdminSubscription: async (id) => {
    const response = await apiClient.get(`/subscriptions/${id}`);
    return response.data;
  },

  createSubscription: async (subscriptionData) => {
    const response = await apiClient.post('/subscriptions', subscriptionData);
    return response.data;
  },

  updateAdminSubscription: async (id, subscriptionData) => {
    const response = await apiClient.post('/subscriptions', { ...subscriptionData, id });
    return response.data;
  },

  deleteAdminSubscription: async (id) => {
    const response = await apiClient.delete(`/subscriptions/${id}`);
    return response.data;
  },

  updateSubscriptionSharing: async (id, sharingDetails) => {
    const response = await apiClient.put(`/subscriptions/${id}/sharing`, { sharingDetails });
    return response.data;
  },
};

export default apiClient;