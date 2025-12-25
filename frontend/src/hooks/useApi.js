import { useState, useEffect, useCallback } from 'react';
import { subscriptionAPI, userAPI, adminAPI, ottAPI } from '../services/api';

// Generic hook for API calls
const useApiCall = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (options.enabled === false) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// Generic mutation hook
const useMutation = (apiFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (variables) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(variables);
      if (options.onSuccess) {
        options.onSuccess(result, variables);
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err, variables);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  return { mutate, loading, error };
};

// Subscription hooks
export const useSubscriptionPlans = (category = null) => {
  return useApiCall(
    () => subscriptionAPI.getPlans(category),
    [category]
  );
};

export const useSubscriptionPlansByCategory = () => {
  return useApiCall(subscriptionAPI.getPlansByCategory);
};

export const useMySubscriptions = () => {
  return useApiCall(subscriptionAPI.getMySubscriptions);
};

export const useSubscribe = () => {
  return useMutation(subscriptionAPI.subscribe);
};

export const useCancelSubscription = () => {
  return useMutation(subscriptionAPI.cancelSubscription);
};

// User profile hooks
export const useUserProfile = () => {
  return useApiCall(userAPI.getProfile);
};

export const useUpdateProfile = () => {
  return useMutation(userAPI.updateProfile);
};

// Admin hooks
export const useAdminUsers = (page = 1, limit = 20) => {
  return useApiCall(
    () => adminAPI.getAllUsers(page, limit),
    [page, limit]
  );
};

export const useUpdateUserRole = () => {
  return useMutation(({ userId, role }) => adminAPI.updateUserRole(userId, role));
};

export const useUpdateUserStatus = () => {
  return useMutation(({ userId, isActive }) => adminAPI.updateUserStatus(userId, isActive));
};

export const useSearchUsers = () => {
  return useMutation(adminAPI.searchUsers);
};

export const useAdminPlans = () => {
  return useApiCall(adminAPI.getAllPlans);
};

export const useCreatePlan = () => {
  return useMutation(adminAPI.createPlan);
};

export const useUpdatePlan = () => {
  return useMutation(({ planId, planData }) => adminAPI.updatePlan(planId, planData));
};

// OTT Details hooks
export const useProviders = (type = null) => {
  return useApiCall(
    () => ottAPI.getProviders(type),
    [type]
  );
};

export const useOttDetails = (subscriptionId) => {
  return useApiCall(
    () => ottAPI.getOttDetails(subscriptionId),
    [subscriptionId],
    { enabled: !!subscriptionId }
  );
};

export const useSaveOttDetails = () => {
  return useMutation(ottAPI.saveOttDetails);
};

export const useDeleteOttDetails = () => {
  return useMutation(ottAPI.deleteOttDetails);
};

// Admin Subscription Management hooks
export const useAdminSubscriptions = (page = 1, limit = 20, filters = {}) => {
  return useApiCall(
    () => adminAPI.getAdminSubscriptions(page, limit, filters),
    [page, limit, JSON.stringify(filters)]
  );
};

export const useAdminSubscription = (id) => {
  return useApiCall(
    () => adminAPI.getAdminSubscription(id),
    [id],
    { enabled: !!id }
  );
};

export const useCreateAdminSubscription = () => {
  return useMutation(adminAPI.createAdminSubscription);
};

export const useUpdateAdminSubscription = () => {
  return useMutation(({ id, data }) => adminAPI.updateAdminSubscription(id, data));
};

export const useDeleteAdminSubscription = () => {
  return useMutation(adminAPI.deleteAdminSubscription);
};

export const useUpdateSubscriptionSharing = () => {
  return useMutation(({ id, sharingDetails }) => adminAPI.updateSubscriptionSharing(id, sharingDetails));
};

export const useAdminDashboard = () => {
  return useApiCall(adminAPI.getAdminDashboard);
};