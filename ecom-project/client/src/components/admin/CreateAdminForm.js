import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CreateAdminForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    secretKey: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/create-admin`, formData);
      
      setSuccess(`Admin account created successfully: ${response.data.data.email}`);
      toast.success('Admin account created!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        secretKey: ''
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      setError(error.response?.data?.error || 'Failed to create admin account');
      toast.error('Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h5 className="mb-4">Create New Admin User</h5>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Admin Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter admin name"
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Secret Key</Form.Label>
            <Form.Control
              type="password"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              placeholder="Enter secret key (goyna-admin-secret)"
              required
            />
            <Form.Text className="text-muted">
              Default secret key is: goyna-admin-secret
            </Form.Text>
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Creating Admin...
              </>
            ) : 'Create Admin User'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateAdminForm; 