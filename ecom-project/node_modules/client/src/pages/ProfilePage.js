import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="display-name mb-3">
                  <h2>{currentUser.name}</h2>
                  <p className="text-muted">{currentUser.email}</p>
                </div>
                <div className="member-since mb-4">
                  <p className="mb-0">Role: {currentUser.role}</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          <div className="d-grid gap-2">
            <Button
              variant="outline-primary"
              onClick={() => navigate('/orders')}
              className="mb-2"
            >
              My Orders
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage; 