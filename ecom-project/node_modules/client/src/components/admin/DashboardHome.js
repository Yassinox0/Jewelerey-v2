import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Alert, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDashboardStats, getLowStockAlerts, getRecentOrders } from '../../services/adminService';

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({});
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Get dashboard statistics
      const statsResponse = await getDashboardStats();
      setStats(statsResponse.data || {});
      
      // Get low stock alerts
      const alertsResponse = await getLowStockAlerts();
      setLowStockAlerts(alertsResponse.data || []);
      
      // Get recent orders
      const ordersResponse = await getRecentOrders();
      setRecentOrders(ordersResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  // Calculate revenue change percentage
  const calculateChangePercentage = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="dashboard-home p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Dashboard</h4>
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={fetchDashboardData}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh Data
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading dashboard data...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Top stats cards */}
          <Row className="mb-4 g-3">
            <Col lg={3} sm={6}>
              <Card className="h-100 dashboard-card revenue-card">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-uppercase text-muted mb-2">Today's Revenue</h6>
                      <h2 className="mb-1">{formatCurrency(stats.todayRevenue || 0)}</h2>
                      
                      {stats.yesterdayRevenue !== undefined && (
                        <div className="small mt-2">
                          {calculateChangePercentage(stats.todayRevenue, stats.yesterdayRevenue) >= 0 ? (
                            <span className="text-success">
                              <i className="bi bi-arrow-up"></i> {Math.abs(calculateChangePercentage(stats.todayRevenue, stats.yesterdayRevenue)).toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-danger">
                              <i className="bi bi-arrow-down"></i> {Math.abs(calculateChangePercentage(stats.todayRevenue, stats.yesterdayRevenue)).toFixed(1)}%
                            </span>
                          )}
                          <span className="text-muted ms-1">from yesterday</span>
                        </div>
                      )}
                    </div>
                    <div className="dashboard-icon revenue-icon">
                      <i className="bi bi-wallet2"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} sm={6}>
              <Card className="h-100 dashboard-card orders-card">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-uppercase text-muted mb-2">Orders Today</h6>
                      <h2 className="mb-1">{stats.todayOrders || 0}</h2>
                      
                      {stats.yesterdayOrders !== undefined && (
                        <div className="small mt-2">
                          {calculateChangePercentage(stats.todayOrders, stats.yesterdayOrders) >= 0 ? (
                            <span className="text-success">
                              <i className="bi bi-arrow-up"></i> {Math.abs(calculateChangePercentage(stats.todayOrders, stats.yesterdayOrders)).toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-danger">
                              <i className="bi bi-arrow-down"></i> {Math.abs(calculateChangePercentage(stats.todayOrders, stats.yesterdayOrders)).toFixed(1)}%
                            </span>
                          )}
                          <span className="text-muted ms-1">from yesterday</span>
                        </div>
                      )}
                    </div>
                    <div className="dashboard-icon orders-icon">
                      <i className="bi bi-box-seam"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} sm={6}>
              <Card className="h-100 dashboard-card customers-card">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-uppercase text-muted mb-2">Total Customers</h6>
                      <h2 className="mb-1">{stats.totalCustomers || 0}</h2>
                      
                      {stats.newCustomers !== undefined && (
                        <div className="small mt-2">
                          <span className="text-success">
                            <i className="bi bi-person-plus"></i> {stats.newCustomers}
                          </span>
                          <span className="text-muted ms-1">new today</span>
                        </div>
                      )}
                    </div>
                    <div className="dashboard-icon customers-icon">
                      <i className="bi bi-people"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} sm={6}>
              <Card className="h-100 dashboard-card alerts-card">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-uppercase text-muted mb-2">Low Stock Items</h6>
                      <h2 className="mb-1">{lowStockAlerts.length || 0}</h2>
                      
                      {lowStockAlerts.some(item => item.stock <= 0) && (
                        <div className="small mt-2">
                          <span className="text-danger">
                            <i className="bi bi-exclamation-triangle"></i> {lowStockAlerts.filter(item => item.stock <= 0).length}
                          </span>
                          <span className="text-muted ms-1">out of stock</span>
                        </div>
                      )}
                    </div>
                    <div className="dashboard-icon alerts-icon">
                      <i className="bi bi-exclamation-circle"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent orders and alerts */}
          <Row className="g-3 mb-4">
            <Col lg={7}>
              <Card>
                <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Orders</h5>
                  <Button 
                    as={Link} 
                    to="#" // Replace with proper route to orders page
                    variant="outline-primary" 
                    size="sm"
                  >
                    View All
                  </Button>
                </Card.Header>
                <Card.Body>
                  {recentOrders.length === 0 ? (
                    <Alert variant="info">No recent orders found.</Alert>
                  ) : (
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map(order => (
                            <tr key={order._id}>
                              <td>{order._id.substring(0, 8)}...</td>
                              <td>{order.customer.name}</td>
                              <td>{formatDate(order.createdAt)}</td>
                              <td>{formatCurrency(order.totalAmount)}</td>
                              <td>
                                <Badge bg={getStatusBadge(order.status)}>
                                  {order.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5}>
              <Card>
                <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Low Stock Alerts</h5>
                  <Button 
                    as={Link} 
                    to="#" // Replace with proper route to inventory page
                    variant="outline-primary" 
                    size="sm"
                  >
                    View Inventory
                  </Button>
                </Card.Header>
                <Card.Body>
                  {lowStockAlerts.length === 0 ? (
                    <Alert variant="info">No low stock alerts at the moment.</Alert>
                  ) : (
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStockAlerts.map(product => (
                            <tr key={product.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {product.image && (
                                    <img 
                                      src={product.image} 
                                      alt={product.name} 
                                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                      className="me-2 rounded"
                                    />
                                  )}
                                  <span>{product.name}</span>
                                </div>
                              </td>
                              <td>{product.category}</td>
                              <td>{product.stock}</td>
                              <td>
                                <Badge bg={product.stock <= 0 ? 'danger' : 'warning'}>
                                  {product.stock <= 0 ? 'Out of Stock' : 'Low Stock'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashboardHome; 