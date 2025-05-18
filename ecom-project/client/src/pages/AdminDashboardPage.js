import React, { useState, useEffect } from 'react';
import { Container, Tab, Nav, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import UserManagement from '../components/admin/UserManagement';
import ProductManagement from '../components/admin/ProductManagement';
import DashboardHome from '../components/admin/DashboardHome';
import OrdersManagement from '../components/admin/OrdersManagement';
import CustomerManagement from '../components/admin/CustomerManagement';
import InventoryManagement from '../components/admin/InventoryManagement';
import SalesReport from '../components/admin/SalesReport';
import CreateAdminForm from '../components/admin/CreateAdminForm';
import TokenManagerPanel from '../components/admin/TokenManagerPanel';
import '../styles/AdminDashboard.css';

const AdminDashboardPage = () => {
  const { currentUser, isAdmin, refreshClaims } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDebug, setShowDebug] = useState(true);

  // Force refresh claims on load
  useEffect(() => {
    refreshClaims();
  }, [refreshClaims]);

  // Check if user is authenticated and admin
  if (!currentUser || !currentUser.email) {
    return <Navigate to="/login" />;
  }

  // Check if user is admin
  if (!isAdmin()) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <Container fluid className="py-4 px-lg-4 admin-dashboard">
      {/* Debug section for admin status */}
      {showDebug && (
        <Card className="mb-3 border-0 shadow-sm">
          <Card.Body className="bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Admin Status Debug</h6>
                <small className="text-muted">User: {currentUser.email}</small>
                <div>
                  <strong>Role:</strong> {currentUser.role || "Not set"}
                </div>
                <div>
                  <strong>Admin Check:</strong> {isAdmin() ? "✓ Is Admin" : "✗ Not Admin"}
                </div>
                <div>
                  <small className="text-muted">Firebase UID: {currentUser.uid || "Not available"}</small>
                </div>
              </div>
              <div className="d-flex">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => refreshClaims()}
                >
                  <i className="bi bi-arrow-repeat me-1"></i> Refresh Claims
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => setShowDebug(false)}
                >
                  <i className="bi bi-x me-1"></i> Close
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <Button as={Link} to="/" variant="outline-secondary">
          <i className="bi bi-house-door me-2"></i>
          Return to Store
        </Button>
      </div>
      
      <Card className="dashboard-card shadow-sm">
        <Card.Body className="p-0">
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Row className="g-0">
              <Col md={3} lg={2} className="admin-sidebar">
                <div className="p-3 border-bottom">
                  <div className="d-flex align-items-center mb-2">
                    <div className="admin-avatar me-2">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <h6 className="mb-0">{currentUser.name || currentUser.email}</h6>
                      <small className="text-muted">Administrator</small>
                    </div>
                  </div>
                </div>
                <Nav variant="pills" className="flex-column mt-3">
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="dashboard" 
                      className="admin-nav-link"
                      active={activeTab === 'dashboard'}
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="orders" 
                      className="admin-nav-link"
                      active={activeTab === 'orders'}
                    >
                      <i className="bi bi-cart me-2"></i>
                      Orders
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="products" 
                      className="admin-nav-link"
                      active={activeTab === 'products'}
                    >
                      <i className="bi bi-box-seam me-2"></i>
                      Products
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="customers" 
                      className="admin-nav-link"
                      active={activeTab === 'customers'}
                    >
                      <i className="bi bi-people me-2"></i>
                      Customers
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="inventory" 
                      className="admin-nav-link"
                      active={activeTab === 'inventory'}
                    >
                      <i className="bi bi-archive me-2"></i>
                      Inventory
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="reports" 
                      className="admin-nav-link"
                      active={activeTab === 'reports'}
                    >
                      <i className="bi bi-graph-up me-2"></i>
                      Sales Reports
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="users" 
                      className="admin-nav-link"
                      active={activeTab === 'users'}
                    >
                      <i className="bi bi-person-badge me-2"></i>
                      User Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="settings" 
                      className="admin-nav-link"
                      active={activeTab === 'settings'}
                    >
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col md={9} lg={10} className="admin-content">
                <Tab.Content>
                  <Tab.Pane eventKey="dashboard">
                    <DashboardHome />
                  </Tab.Pane>
                  <Tab.Pane eventKey="orders">
                    <OrdersManagement />
                  </Tab.Pane>
                  <Tab.Pane eventKey="products">
                    <ProductManagement />
                  </Tab.Pane>
                  <Tab.Pane eventKey="customers">
                    <CustomerManagement />
                  </Tab.Pane>
                  <Tab.Pane eventKey="inventory">
                    <InventoryManagement />
                  </Tab.Pane>
                  <Tab.Pane eventKey="reports">
                    <SalesReport />
                  </Tab.Pane>
                  <Tab.Pane eventKey="users">
                    <UserManagement />
                  </Tab.Pane>
                  <Tab.Pane eventKey="settings">
                    <div className="p-3">
                      <h4 className="mb-4">Admin Settings</h4>
                      <TokenManagerPanel />
                      <Row className="mt-4">
                        <Col lg={6}>
                          <CreateAdminForm />
                        </Col>
                        <Col lg={6}>
                          <Card className="shadow-sm h-100">
                            <Card.Body>
                              <h5 className="mb-3">Admin Instructions</h5>
                              <p>As an admin, you have the following capabilities:</p>
                              <ul>
                                <li>View sales metrics and store performance on the Dashboard</li>
                                <li>Manage orders and update their status</li>
                                <li>Manage products (add, edit, delete)</li>
                                <li>View customer information and their order history</li>
                                <li>Manage inventory and receive low stock alerts</li>
                                <li>Generate sales reports and view bestsellers</li>
                                <li>Manage users (view, delete)</li>
                                <li>Create other admin users</li>
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