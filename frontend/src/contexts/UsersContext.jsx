import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from './AuthContext';

const UsersContext = createContext();

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

export const UsersProvider = ({ children }) => {
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchUsers = async () => {
    // Only fetch users for admin users
    if (user?.role !== 'admin') {
      return;
    }

    if (loading || usersData) {
      return; // Don't fetch if already loading or data exists
    }

    setLoading(true);
    setError(null);

    try {
      const data = await adminAPI.getAllUsers(1, 100);
      setUsersData(data);
    } catch (err) {
      setError(err);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user?.role]);

  const searchUsers = (query) => {
    if (!usersData?.users || !query.trim()) {
      return [];
    }

    return usersData.users.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email.toLowerCase();
      const queryLower = query.toLowerCase();
      
      return fullName.includes(queryLower) || email.includes(queryLower);
    });
  };

  const value = {
    usersData,
    loading,
    error,
    searchUsers,
    refetch: () => {
      setUsersData(null); // Clear cache
      fetchUsers();
    }
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

export default UsersContext;