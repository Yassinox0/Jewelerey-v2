import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAdmin, currentUser, refreshClaims } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Login successful!');
        console.log('Login successful. User:', result.user);
        
        // Force a claims refresh to ensure admin status is up-to-date
        await refreshClaims();
        
        // Check if user is admin and redirect to admin dashboard with a longer delay
        setTimeout(() => {
          console.log("Current user after login:", currentUser);
          console.log("Admin status check:", isAdmin());
          console.log("User role:", currentUser?.role);
          
          if (isAdmin()) {
            console.log("Redirecting to admin dashboard...");
            navigate('/admin');
          } else {
            console.log("Redirecting to:", from);
            // Redirect back to the page they were trying to access or home
            navigate(from, { replace: true });
          }
        }, 1000); // Longer timeout to ensure auth state is updated
      } else {
        setError(result.error || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Failed to sign in';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4">Login</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="border-0 shadow-sm"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="border-0 shadow-sm"
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-4" 
                  disabled={loading}
                >
                  {loading ? (
                    <><Spinner as="span" animation="border" size="sm" /> Loading...</>
                  ) : 'Login'}
                </Button>
                
                <div className="text-center">
                  <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage; 