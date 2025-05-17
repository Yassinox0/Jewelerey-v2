import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const TokenManagerPanel = () => {
  const { currentUser, refreshToken, userClaims } = useAuth();
  const [tokenInfo, setTokenInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quotaWarning, setQuotaWarning] = useState(false);
  const [tokenAge, setTokenAge] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState('Never');

  // Refresh token info every 30 seconds to show age
  useEffect(() => {
    const getTokenDetails = async () => {
      if (!currentUser) return;
      
      try {
        // Get token without forcing refresh
        const token = await currentUser.getIdToken(false);
        // Decode token payload (basic JWT decoding)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        setTokenInfo({
          issued: new Date(payload.iat * 1000).toLocaleString(),
          expires: new Date(payload.exp * 1000).toLocaleString(),
          expiresAt: payload.exp * 1000, // milliseconds
          claims: {
            admin: payload.admin || false,
            role: payload.role || 'user'
          }
        });
        
        // Calculate token age as percentage of its lifespan
        const now = Date.now();
        const issued = payload.iat * 1000;
        const expires = payload.exp * 1000;
        const age = (now - issued) / (expires - issued) * 100;
        setTokenAge(Math.min(Math.max(age, 0), 100)); // Ensure between 0-100
      } catch (err) {
        console.error("Error getting token details:", err);
        setError("Could not retrieve token details");
      }
    };
    
    getTokenDetails();
    const interval = setInterval(getTokenDetails, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleForceRefresh = async () => {
    setLoading(true);
    setError(null);
    setQuotaWarning(false);
    
    try {
      // Force token refresh
      await refreshToken(currentUser, true);
      setLastRefreshTime(new Date().toLocaleString());
    } catch (err) {
      console.error("Error refreshing token:", err);
      if (err.code === 'auth/quota-exceeded') {
        setError("Token refresh quota exceeded. Wait before trying again.");
        setQuotaWarning(true);
      } else {
        setError(`Error refreshing token: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <Card className="mb-4">
      <Card.Body>
        <Card.Title>Token Manager</Card.Title>
        <Alert variant="warning">Not logged in</Alert>
      </Card.Body>
    </Card>;
  }

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Token Manager</h5>
        <Button 
          size="sm" 
          onClick={handleForceRefresh} 
          disabled={loading || quotaWarning}
          variant={quotaWarning ? "danger" : "primary"}
        >
          {loading ? "Refreshing..." : "Force Refresh Token"}
        </Button>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {quotaWarning && (
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Firebase quota exceeded. Please wait before refreshing again to avoid being temporarily blocked.
          </Alert>
        )}
        
        <div className="mb-3">
          <strong>User:</strong> {currentUser.email}
        </div>
        
        <div className="mb-3">
          <strong>Admin Status:</strong> {' '}
          {userClaims && (userClaims.admin || userClaims.role === 'admin') ? (
            <span className="badge bg-success">Admin</span>
          ) : (
            <span className="badge bg-secondary">Regular User</span>
          )}
        </div>

        <div className="mb-3">
          <strong>Last Manual Refresh:</strong> {lastRefreshTime}
        </div>
        
        {tokenInfo && (
          <>
            <div className="mb-3">
              <strong>Token Age:</strong>
              <ProgressBar 
                now={tokenAge} 
                variant={tokenAge > 80 ? "danger" : tokenAge > 50 ? "warning" : "success"}
                className="mt-1"
              />
              <div className="d-flex justify-content-between">
                <small>Issued: {tokenInfo.issued}</small>
                <small>Expires: {tokenInfo.expires}</small>
              </div>
            </div>
            
            <div className="mb-3">
              <strong>Claims:</strong>
              <pre className="mt-1 p-2 bg-light rounded">
                {JSON.stringify(tokenInfo.claims, null, 2)}
              </pre>
            </div>
          </>
        )}
        
        <div className="text-muted mt-3">
          <small>
            <i className="bi bi-info-circle me-1"></i>
            Firebase has limits on token refresh operations. Use sparingly to avoid quota exceeded errors.
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TokenManagerPanel; 