import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from 'react-bootstrap';

const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin, refreshClaims } = useAuth();
  
  // Refresh claims when accessing admin route
  useEffect(() => {
    if (currentUser) {
      console.log("Refreshing claims for admin route");
      refreshClaims();
    }
  }, [currentUser, refreshClaims]);
  
  // Check if still loading authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  
  // Check if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Log attempt to access admin route
  console.log("Attempting to access admin route as:", currentUser.email);
  console.log("Is admin?", isAdmin());
  
  // Redirect if not admin
  if (!isAdmin()) {
    console.log("Access denied - not an admin");
    return <Navigate to="/" />;
  }
  
  console.log("Access granted - user is admin");
  return children;
};

export default AdminRoute; 