import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const RefreshAdminPage = () => {
  const { currentUser, isAdmin, logout, refreshClaims } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        if (!currentUser) {
          setError('You must be logged in');
          setLoading(false);
          return;
        }

        console.log("Checking admin status for:", currentUser.email);
        
        // First check if already admin without refreshing token
        if (isAdmin()) {
          console.log("User is already admin, redirecting to admin dashboard");
          navigate('/admin');
          return;
        }
        
        // If not already admin and no refresh attempted yet, do a gentle refresh
        if (!refreshAttempted) {
          setRefreshAttempted(true);
          
          try {
            // Use our throttled refresh function instead of direct getIdToken
            console.log("Attempting to refresh claims...");
            const refreshSuccessful = await refreshClaims();
            
            // Wait a moment to let Firebase process the token refresh
            setTimeout(() => {
              if (isAdmin()) {
                console.log("User is admin after refresh, redirecting");
                navigate('/admin');
              } else if (!refreshSuccessful) {
                console.log("Refresh throttled or quota exceeded");
                setError('Authentication refresh limited. Please try again later or sign out and sign back in.');
                setLoading(false);
              } else {
                console.log("User is not admin after refresh");
                setError('You need admin privileges to access the admin panel');
                setLoading(false);
              }
            }, 1000);
          } catch (refreshError) {
            console.error("Token refresh error:", refreshError);
            
            if (refreshError.code === 'auth/quota-exceeded') {
              setError('Too many authentication requests. Please try again in a few minutes or sign out and sign back in.');
            } else {
              setError('Error refreshing credentials. Try signing out and signing back in.');
            }
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setError('Error checking admin status');
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [currentUser, navigate, isAdmin, refreshAttempted, refreshClaims]);

  // Manual sign out helper
  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!currentUser) {
    return (
      <Container className="py-5">
        <Card className="shadow">
          <Card.Body className="text-center p-5">
            <h1 className="mb-4">Admin Access</h1>
            <p className="mb-4">You must be logged in to access the admin panel.</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow">
        <Card.Body className="text-center p-5">
          <h1 className="mb-4">Admin Access</h1>
          
          {loading ? (
            <>
              <Spinner animation="border" className="mb-3" />
              <p>Checking admin privileges...</p>
              <p className="text-muted small">User: {currentUser.email}</p>
            </>
          ) : error ? (
            <>
              <div className="alert alert-danger mb-4">{error}</div>
              <p>If you believe you should have admin access:</p>
              <ol className="text-start">
                <li>Wait a few minutes before trying again (Firebase has request limits)</li>
                <li>Sign out and sign back in</li>
                <li>Make sure your user has admin privileges</li>
                <li>Contact the system administrator</li>
              </ol>
              <p className="text-muted small">User: {currentUser.email}</p>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="primary" onClick={handleSignOut}>
                  Sign Out
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/')}>
                  Go to Home
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="alert alert-success mb-4">Admin access confirmed!</div>
              <p>Redirecting to admin dashboard...</p>
              <p className="text-muted small">User: {currentUser.email}</p>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RefreshAdminPage; 