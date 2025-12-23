import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionAPI, userAPI } from '../services/api';

// Subscription hooks
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionAPI.getPlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMySubscriptions = () => {
  return useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: subscriptionAPI.getMySubscriptions,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useSubscribe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: subscriptionAPI.subscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: subscriptionAPI.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
    },
  });
};

// User profile hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: userAPI.getProfile,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};