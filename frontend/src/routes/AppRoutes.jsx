import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { routesConfig } from '../utils/routesConfig';

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if authenticated)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export function AppContent() {
  const LayoutComponent = routesConfig.protected.layout;
  
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Routes>
        {/* Public routes */}
        {routesConfig.public.map((route) => {
          const Component = route.component;
          return (
            <Route 
              key={route.key}
              path={route.path} 
              element={
                <PublicRoute>
                  <Component />
                </PublicRoute>
              } 
            />
          );
        })}
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <LayoutComponent />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          {routesConfig.protected.children.map((route) => {
            const Component = route.component;
            return (
              <Route 
                key={route.key}
                path={route.path} 
                element={<Component />} 
              />
            );
          })}
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}