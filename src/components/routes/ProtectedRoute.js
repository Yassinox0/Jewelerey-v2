import React from 'react';
import { Navigate } from 'react-router-dom';

// In a real app, we would get the authentication state from Redux
const ProtectedRoute = ({ children }) => {
  // For demonstration purposes - will be replaced with Redux state
  const isAuthenticated = false;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute; 