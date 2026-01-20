import { useState, useEffect, useCallback, useRef } from 'react';
import { userAPI, adminAPI } from '../services/api';

// Global cache with request deduplication
const globalCache = new Map();
const pendingRequests = new Map();

// Generic hook for API calls with request deduplication
const useApiCall = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const cacheKey = JSON.stringify(dependencies);

  const fetchData = useCallback(async () => {
    if (options.enabled === false) return;
    
    
    // Check cache first
    if (globalCache.has(cacheKey)) {
      const cachedData = globalCache.get(cacheKey);
      if (isMountedRef.current) {
        setData(cachedData);
        setLoading(false);
      }
      return;
    }
    
    // Check if request is already pending
    if (pendingRequests.has(cacheKey)) {
      try {
        const result = await pendingRequests.get(cacheKey);
        if (isMountedRef.current) {
          setData(result);
          setLoading(false);
        }
        return;
      } catch (err) {
        if (isMountedRef.current) {
          setError(err);
          setLoading(false);
        }
        return;
      }
    }
    
    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }
    
    // Create and store the pending request promise
    const requestPromise = apiFunction().then(result => {
      globalCache.set(cacheKey, result);
      // Cache for 5 minutes
      setTimeout(() => {
        globalCache.delete(cacheKey);
      }, 300000);
      pendingRequests.delete(cacheKey);
      return result;
    }).catch(err => {
      pendingRequests.delete(cacheKey);
      throw err;
    });
    
    pendingRequests.set(cacheKey, requestPromise);
    
    try {
      const result = await requestPromise;
      if (isMountedRef.current) {
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
        setLoading(false);
      }
    }
  }, dependencies);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    // Clear cache and pending requests on manual refetch
    globalCache.delete(cacheKey);
    pendingRequests.delete(cacheKey);
    fetchData();
  }, [fetchData, cacheKey]);

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

export const useCreateSubscription = () => {
  return useMutation(adminAPI.createSubscription);
};

export const useUpdateAdminSubscription = () => {
  return useMutation(({ id, data }) => adminAPI.updateAdminSubscription(id, data));
};

export const useDeleteAdminSubscription = () => {
  return useMutation(adminAPI.deleteAdminSubscription);
};

export const useUpdateUserRole = () => {
  return useMutation(({ userId, role }) => adminAPI.updateUserRole(userId, role));
};

export const useUpdateUserStatus = () => {
  return useMutation(({ userId, isActive }) => adminAPI.updateUserStatus(userId, isActive));
};

