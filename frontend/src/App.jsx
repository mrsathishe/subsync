import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { UsersProvider } from './contexts/UsersContext';
import { AppContent } from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <UsersProvider>
        <AppContent />
      </UsersProvider>
    </AuthProvider>
  );
}

export default App;