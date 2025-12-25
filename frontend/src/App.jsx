import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppContent } from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;