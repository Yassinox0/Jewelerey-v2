import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      
      const userData = {
        name,
        email,
        password
      };
      
      const result = await register(userData);
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Failed to create account';
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
              <h2 className="text-center mb-4">Register</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    className="border-0 shadow-sm"
                  />
                </Form.Group>

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

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    minLength="6"
                    className="border-0 shadow-sm"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <><Spinner as="span" animation="border" size="sm" /> Creating Account...</>
                  ) : 'Register'}
                </Button>
                
                <div className="text-center">
                  <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage; 