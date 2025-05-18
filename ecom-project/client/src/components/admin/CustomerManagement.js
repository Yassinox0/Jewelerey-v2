import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Spinner, Alert, Form, Row, Col, Badge, InputGroup, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAllCustomers, getCustomerOrders } from '../../services/adminService';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch all customers
  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllCustomers();
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers. Please try again.');
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  // Open customer details modal
  const openDetailsModal = async (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
    await fetchCustomerOrders(customer.id);
  };

  // Fetch customer orders
  const fetchCustomerOrders = async (customerId) => {
    setLoadingOrders(true);
    try {
      const response = await getCustomerOrders(customerId);
      setCustomerOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      toast.error('Failed to load customer orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD'
    }).format(price);
  };

  // Handle sort change
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Sort and filter customers
  const filteredCustomers = customers
    .filter(customer => {
      return searchTerm === '' || 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'orders':
          comparison = (a.orderCount || 0) - (b.orderCount || 0);
          break;
        case 'spent':
          comparison = (a.totalSpent || 0) - (b.totalSpent || 0);
          break;
        case 'joinDate':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="customer-management p-3">
      <h4 className="mb-4">Customer Management</h4>

      {/* Search bar */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name, email or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="orders">Sort by Orders</option>
            <option value="spent">Sort by Amount Spent</option>
            <option value="joinDate">Sort by Join Date</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <Button variant="outline-primary" onClick={fetchCustomers}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {filteredCustomers.length === 0 ? (
            <Alert variant="info">No customers found.</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="customers-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')} className="sortable">
                      Name {sortBy === 'name' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>}
                    </th>
                    <th onClick={() => handleSort('email')} className="sortable">
                      Email {sortBy === 'email' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>}
                    </th>
                    <th onClick={() => handleSort('orders')} className="sortable text-center">
                      Orders {sortBy === 'orders' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>}
                    </th>
                    <th onClick={() => handleSort('spent')} className="sortable text-end">
                      Total Spent {sortBy === 'spent' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>}
                    </th>
                    <th onClick={() => handleSort('joinDate')} className="sortable">
                      Joined {sortBy === 'joinDate' && <i className={`bi bi-caret-${sortOrder === 'asc' ? 'up' : 'down'}-fill ms-1`}></i>}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(customer => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td className="text-center">
                        <Badge bg="info">{customer.orderCount || 0}</Badge>
                      </td>
                      <td className="text-end">{formatPrice(customer.totalSpent || 0)}</td>
                      <td>{formatDate(customer.createdAt)}</td>
                      <td>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => openDetailsModal(customer)}
                        >
                          <i className="bi bi-person-lines-fill me-1"></i> Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Customer Details Modal */}
      <Modal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <h5 className="card-title">Personal Information</h5>
                      <p><strong>Name:</strong> {selectedCustomer.name}</p>
                      <p><strong>Email:</strong> {selectedCustomer.email}</p>
                      {selectedCustomer.phone && (
                        <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                      )}
                      <p><strong>Member Since:</strong> {formatDate(selectedCustomer.createdAt)}</p>
                      {selectedCustomer.lastLogin && (
                        <p><strong>Last Login:</strong> {formatDate(selectedCustomer.lastLogin)}</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <h5 className="card-title">Customer Statistics</h5>
                      <div className="d-flex flex-column h-100 justify-content-around">
                        <div className="text-center">
                          <h2 className="text-primary">{selectedCustomer.orderCount || 0}</h2>
                          <p>Total Orders</p>
                        </div>
                        <div className="text-center">
                          <h2 className="text-success">{formatPrice(selectedCustomer.totalSpent || 0)}</h2>
                          <p>Total Spent</p>
                        </div>
                        {selectedCustomer.avgOrderValue && (
                          <div className="text-center">
                            <h4>{formatPrice(selectedCustomer.avgOrderValue)}</h4>
                            <p>Average Order Value</p>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <h5>Customer Orders</h5>
              {loadingOrders ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : (
                <>
                  {customerOrders.length === 0 ? (
                    <Alert variant="info">No orders found for this customer.</Alert>
                  ) : (
                    <Table responsive hover className="mt-3">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerOrders.map(order => (
                          <tr key={order._id}>
                            <td>{order._id.substring(0, 8)}...</td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>{order.items.length} items</td>
                            <td>{formatPrice(order.totalAmount)}</td>
                            <td>
                              <Badge bg={
                                order.status === 'delivered' ? 'success' :
                                order.status === 'shipped' ? 'primary' :
                                order.status === 'processing' ? 'info' :
                                order.status === 'cancelled' ? 'danger' : 'warning'
                              }>
                                {order.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </>
              )}

              {selectedCustomer.shippingAddresses && selectedCustomer.shippingAddresses.length > 0 && (
                <>
                  <h5 className="mt-4">Shipping Addresses</h5>
                  <Row>
                    {selectedCustomer.shippingAddresses.map((address, index) => (
                      <Col md={6} key={index} className="mb-3">
                        <Card>
                          <Card.Body>
                            {address.isDefault && (
                              <Badge bg="success" className="mb-2">Default</Badge>
                            )}
                            <p className="mb-1">{address.street}</p>
                            <p className="mb-1">{address.city}, {address.state} {address.zip}</p>
                            <p className="mb-0">{address.country}</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerManagement; 