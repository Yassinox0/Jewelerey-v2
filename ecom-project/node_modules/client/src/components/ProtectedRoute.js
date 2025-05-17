import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute component to protect routes that require authentication
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading spinner while checking authentication
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    // Redirect to login and pass the current location
    // so we can redirect back after login
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute; 