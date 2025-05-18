import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Alert, Spinner, Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

/**
 * AdminAccess - A page for users to check their admin status and access admin features
 * This page does not require admin status to view, making it helpful for troubleshooting
 */
const AdminAccess = () => {
  const { currentUser, isAdmin, refreshClaims, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [directAdminCheck, setDirectAdminCheck] = useState(null);
  const [userFirebaseId, setUserFirebaseId] = useState('');
  const [directCheckResponse, setDirectCheckResponse] = useState(null);
  const navigate = useNavigate();

  // Force refresh claims when page loads
  useEffect(() => {
    const refreshOnLoad = async () => {
      if (currentUser) {
        setRefreshing(true);
        await refreshClaims();
        setRefreshing(false);
        
        // Get Firebase UID if available
        if (currentUser.uid) {
          setUserFirebaseId(currentUser.uid);
        } else if (currentUser.firebaseUid) {
          setUserFirebaseId(currentUser.firebaseUid);
        }
      }
    };
    refreshOnLoad();
  }, [currentUser, refreshClaims]);

  // Handle refresh button click
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshClaims();
    setRefreshing(false);
  };

  // Handle direct MongoDB check
  const handleDirectCheck = async () => {
    if (!currentUser) return;
    
    try {
      setDirectAdminCheck('checking');
      const token = await currentUser.getIdToken(true);
      
      const response = await axios.get('http://localhost:7777/api/auth/check-admin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setDirectCheckResponse(response.data);
      setDirectAdminCheck(response.data.isAdmin ? 'admin' : 'not-admin');
    } catch (error) {
      console.error('Direct check error:', error);
      setDirectAdminCheck('error');
    }
  };

  // Handle logout and login redirection
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle script execution
  const handleRunAdminScript = async () => {
    if (!userFirebaseId) {
      alert('Please enter a Firebase UID');
      return;
    }
    
    try {
      setLoading(true);
      // Show alert about running script
      alert(`To make this user an admin, run the following command in your server directory:
      
node scripts/createAdminDirectly.js "${userFirebaseId}" "${currentUser?.name || 'Admin User'}"
      
This will set the user's role to 'admin' directly in MongoDB.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white">
              <h4 className="mb-0">Admin Access Center</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {!currentUser ? (
                <Alert variant="warning">
                  <Alert.Heading>Not Logged In</Alert.Heading>
                  <p>
                    You need to log in first to check your admin status.
                  </p>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                    <Button as={Link} to="/login" variant="primary">
                      Go to Login
                    </Button>
                    <Button as={Link} to="/" variant="secondary">
                      Return Home
                    </Button>
                  </div>
                </Alert>
              ) : (
                <>
                  <div className="mb-4">
                    <h5>User Information</h5>
                    <div className="mb-3 p-3 bg-light rounded">
                      <div className="mb-2">
                        <strong>Name:</strong> {currentUser.name || 'Not set'}
                      </div>
                      <div className="mb-2">
                        <strong>Email:</strong> {currentUser.email}
                      </div>
                      <div className="mb-2">
                        <strong>Role:</strong> <span className={currentUser.role === 'admin' ? 'text-success fw-bold' : 'text-muted'}>{currentUser.role || 'Not set'}</span>
                      </div>
                      {currentUser.uid && (
                        <div className="mb-2">
                          <strong>Firebase UID:</strong> <small className="text-muted">{currentUser.uid}</small>
                        </div>
                      )}
                      {currentUser.firebaseUid && (
                        <div className="mb-2">
                          <strong>DB Firebase UID:</strong> <small className="text-muted">{currentUser.firebaseUid}</small>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5>Admin Status</h5>
                    {refreshing ? (
                      <div className="text-center p-3">
                        <Spinner animation="border" variant="primary" size="sm" />
                        <span className="ms-2">Checking admin status...</span>
                      </div>
                    ) : isAdmin() ? (
                      <Alert variant="success">
                        <Alert.Heading>
                          <i className="bi bi-check-circle-fill me-2"></i>
                          Admin Access Confirmed
                        </Alert.Heading>
                        <p>
                          You have administrator privileges on this site. You can access the admin dashboard 
                          and manage the e-commerce platform.
                        </p>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                          <Button as={Link} to="/admin" variant="primary">
                            <i className="bi bi-speedometer2 me-2"></i>
                            Go to Admin Dashboard
                          </Button>
                        </div>
                      </Alert>
                    ) : (
                      <Alert variant="danger">
                        <Alert.Heading>
                          <i className="bi bi-x-circle-fill me-2"></i>
                          No Admin Access
                        </Alert.Heading>
                        <p>
                          Your account does not have administrator privileges. If you believe this is 
                          an error, please contact the site administrator or use the troubleshooting
                          section below.
                        </p>
                      </Alert>
                    )}
                  </div>
                  
                  {/* Direct Admin Check */}
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">Direct Admin Check</h5>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        This will check your admin status directly from the database, bypassing any caching issues.
                      </p>
                      <Button 
                        onClick={handleDirectCheck}
                        disabled={directAdminCheck === 'checking'}
                      >
                        {directAdminCheck === 'checking' ? (
                          <><Spinner animation="border" size="sm" /> Checking...</>
                        ) : 'Check Status Directly'}
                      </Button>
                      
                      {directAdminCheck && directAdminCheck !== 'checking' && (
                        <Alert
                          variant={directAdminCheck === 'admin' ? 'success' : directAdminCheck === 'error' ? 'warning' : 'danger'}
                          className="mt-3"
                        >
                          {directAdminCheck === 'admin' ? (
                            <>
                              <strong>Success!</strong> You are confirmed as an admin user in the database.
                            </>
                          ) : directAdminCheck === 'error' ? (
                            <>
                              <strong>Error!</strong> There was a problem checking your admin status.
                            </>
                          ) : (
                            <>
                              <strong>Not Admin!</strong> You are not marked as an admin in the database.
                            </>
                          )}
                          
                          {directCheckResponse && (
                            <div className="mt-2">
                              <small>
                                <pre className="p-2 bg-light rounded">
                                  {JSON.stringify(directCheckResponse, null, 2)}
                                </pre>
                              </small>
                            </div>
                          )}
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                  
                  {/* Admin Troubleshooting */}
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">Admin Troubleshooting</h5>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        If you should be an admin but your role is not set correctly, you can run the admin script:
                      </p>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Firebase UID (for admin script)</Form.Label>
                        <Form.Control
                          type="text"
                          value={userFirebaseId}
                          onChange={(e) => setUserFirebaseId(e.target.value)}
                          placeholder="Enter your Firebase UID"
                        />
                        <Form.Text className="text-muted">
                          This should be automatically populated from your user data.
                        </Form.Text>
                      </Form.Group>
                      
                      <Button
                        variant="warning"
                        onClick={handleRunAdminScript}
                        disabled={!userFirebaseId}
                      >
                        <i className="bi bi-terminal me-2"></i>
                        Run Admin Script
                      </Button>
                    </Card.Body>
                  </Card>

                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="outline-primary" 
                      onClick={handleRefresh}
                      disabled={refreshing}
                    >
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Refresh Admin Status
                    </Button>
                    <div>
                      <Button 
                        variant="outline-secondary" 
                        as={Link} 
                        to="/" 
                        className="me-2"
                      >
                        Return Home
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        onClick={handleLogout}
                        disabled={loading}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminAccess; 