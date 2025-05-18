import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Spinner, Alert, Form, Row, Col, Badge, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAllOrders, updateOrderStatus } from '../../services/adminService';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Open details modal
  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    setSubmitting(true);
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated successfully');
      
      // Update order in state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD'
    }).format(price);
  };

  // Filter orders by search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      searchTerm === '' || 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="orders-management p-3">
      <h4 className="mb-4">Orders Management</h4>

      {/* Search and filters */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by order ID, customer name, email or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <Button variant="outline-primary" onClick={fetchOrders}>
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
          {filteredOrders.length === 0 ? (
            <Alert variant="info">No orders found.</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 8)}...</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <div>{order.customer.name}</div>
                        <small className="text-muted">{order.customer.email}</small>
                      </td>
                      <td>{order.items.length} items</td>
                      <td>{formatPrice(order.totalAmount)}</td>
                      <td>
                        <Badge bg={getStatusBadge(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          className="me-1"
                          onClick={() => openDetailsModal(order)}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Form.Select 
                          size="sm" 
                          style={{ width: '130px', display: 'inline-block' }}
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={submitting}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      <Modal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Order Information</h5>
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p>
                    <strong>Status:</strong> 
                    <Badge bg={getStatusBadge(selectedOrder.status)} className="ms-2">
                      {selectedOrder.status}
                    </Badge>
                  </p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Total Amount:</strong> {formatPrice(selectedOrder.totalAmount)}</p>
                </Col>
                <Col md={6}>
                  <h5>Customer Information</h5>
                  <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                  {selectedOrder.customer.phone && (
                    <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                  )}
                  <h6 className="mt-3">Shipping Address</h6>
                  <p className="mb-0">{selectedOrder.shippingAddress.street}</p>
                  <p className="mb-0">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </Col>
              </Row>
              
              <h5>Order Items</h5>
              <Table responsive className="mt-2">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              className="me-2"
                            />
                          )}
                          <div>
                            <div>{item.name}</div>
                            {item.variant && <small className="text-muted">{item.variant}</small>}
                          </div>
                        </div>
                      </td>
                      <td>{formatPrice(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                    <td>{formatPrice(selectedOrder.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Shipping:</strong></td>
                    <td>{formatPrice(selectedOrder.shippingCost)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Tax:</strong></td>
                    <td>{formatPrice(selectedOrder.taxAmount)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                    <td><strong>{formatPrice(selectedOrder.totalAmount)}</strong></td>
                  </tr>
                </tfoot>
              </Table>
              
              {selectedOrder.notes && (
                <>
                  <h5 className="mt-3">Notes</h5>
                  <p>{selectedOrder.notes}</p>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {selectedOrder && (
            <Form.Select 
              style={{ width: '200px' }}
              value={selectedOrder.status}
              onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
              disabled={submitting}
            >
              <option value="pending">Change to Pending</option>
              <option value="processing">Change to Processing</option>
              <option value="shipped">Change to Shipped</option>
              <option value="delivered">Change to Delivered</option>
              <option value="cancelled">Change to Cancelled</option>
            </Form.Select>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrdersManagement; 