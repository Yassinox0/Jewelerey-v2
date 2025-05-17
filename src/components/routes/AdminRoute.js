import React from 'react';
import { Navigate } from 'react-router-dom';

// In a real app, we would get the authentication state from Redux
const AdminRoute = ({ children }) => {
  // For demonstration purposes - will be replaced with Redux state
  const isAuthenticated = false;
  const user = null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default AdminRoute; 