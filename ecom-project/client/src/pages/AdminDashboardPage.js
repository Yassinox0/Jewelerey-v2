import React, { useState } from 'react';
import { Container, Tab, Nav, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import UserManagement from '../components/admin/UserManagement';
import ProductManagement from '../components/admin/ProductManagement';
import CreateAdminForm from '../components/admin/CreateAdminForm';
import TokenManagerPanel from '../components/admin/TokenManagerPanel';

const AdminDashboardPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  // Check if user is admin
  if (!currentUser || !currentUser.email) {
    return <Navigate to="/login" />;
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <Button as={Link} to="/" variant="outline-secondary">
          <i className="bi bi-house-door me-2"></i>
          Return to Store
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <Card.Body>
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Row>
              <Col md={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="products" className="mb-2">
                      <i className="bi bi-box-seam me-2"></i>
                      Products Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="users" className="mb-2">
                      <i className="bi bi-people me-2"></i>
                      Users Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="settings" className="mb-2">
                      <i className="bi bi-gear me-2"></i>
                      Admin Settings
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="stats" className="mb-2">
                      <i className="bi bi-graph-up me-2"></i>
                      Dashboard Stats
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col md={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="products">
                    <ProductManagement />
                  </Tab.Pane>
                  <Tab.Pane eventKey="users">
                    <UserManagement />
                  </Tab.Pane>
                  <Tab.Pane eventKey="settings">
                    <div className="p-3">
                      <h4 className="mb-4">Admin Settings</h4>
                      <TokenManagerPanel />
                      <Row>
                        <Col lg={6}>
                          <CreateAdminForm />
                        </Col>
                        <Col lg={6}>
                          <Card className="shadow-sm h-100">
                            <Card.Body>
                              <h5 className="mb-3">Admin Instructions</h5>
                              <p>As an admin, you can:</p>
                              <ul>
                                <li>Manage products (add, edit, delete)</li>
                                <li>Manage users (view, delete)</li>
                                <li>Create other admin users</li>
                                <li>View store statistics</li>
                              </ul>
                              <p className="mb-0 text-muted">
                                <i className="bi bi-info-circle me-2"></i>
                                Admin users have full control over the store. Only create admin accounts for trusted individuals.
                              </p>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="stats">
                    <div className="p-3">
                      <h4>Dashboard Statistics</h4>
                      <p className="text-muted">Analytics and statistics feature coming soon...</p>
                      
                      <Row className="mt-4">
                        <Col md={4}>
                          <Card className="text-center mb-3 shadow-sm">
                            <Card.Body>
                              <h1 className="display-4 text-primary">0</h1>
                              <p className="text-muted mb-0">Orders Today</p>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card className="text-center mb-3 shadow-sm">
                            <Card.Body>
                              <h1 className="display-4 text-success">$0</h1>
                              <p className="text-muted mb-0">Revenue Today</p>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card className="text-center mb-3 shadow-sm">
                            <Card.Body>
                              <h1 className="display-4 text-info">0</h1>
                              <p className="text-muted mb-0">New Users Today</p>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboardPage; 