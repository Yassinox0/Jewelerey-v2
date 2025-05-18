import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FiEye, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrdersPage = () => {
  const { currentUser } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.get(
          'http://localhost:7777/api/orders',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError('Failed to load orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error loading orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);
  
  const generateReceipt = (order) => {
    const doc = new jsPDF();
    
    // Add company logo or name
    doc.setFontSize(20);
    doc.text('Elegance Jewels', 105, 20, { align: 'center' });
    
    // Add receipt title
    doc.setFontSize(16);
    doc.text('Order Receipt', 105, 30, { align: 'center' });
    
    // Add order information
    doc.setFontSize(12);
    doc.text(`Order #: ${order._id}`, 20, 40);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 50);
    doc.text(`Payment Method: ${order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Credit Card'}`, 20, 60);
    
    // Add customer information
    doc.text('Shipping Address:', 20, 75);
    doc.setFontSize(10);
    const address = order.shippingAddress;
    doc.text(`${address.fullName}`, 25, 85);
    doc.text(`${address.addressLine1}`, 25, 90);
    if (address.addressLine2) doc.text(`${address.addressLine2}`, 25, 95);
    doc.text(`${address.city}, ${address.state} ${address.postalCode}`, 25, address.addressLine2 ? 100 : 95);
    doc.text(`${address.country}`, 25, address.addressLine2 ? 105 : 100);
    doc.text(`Phone: ${address.phoneNumber}`, 25, address.addressLine2 ? 110 : 105);
    
    // Add items table
    doc.setFontSize(12);
    doc.text('Order Items:', 20, address.addressLine2 ? 125 : 120);
    
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows = [];
    
    order.items.forEach(item => {
      const tableRow = [
        item.name,
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${(item.price * item.quantity).toFixed(2)}`
      ];
      tableRows.push(tableRow);
    });
    
    // Generate the table using autoTable directly
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: address.addressLine2 ? 130 : 125,
      theme: 'striped',
      headStyles: { fillColor: [75, 75, 75] }
    });
    
    // Add totals
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.text(`Subtotal: $${order.total.toFixed(2)}`, 150, finalY, { align: 'right' });
    doc.text(`Shipping: Free`, 150, finalY + 7, { align: 'right' });
    doc.setFontSize(14);
    doc.text(`Total: $${order.total.toFixed(2)}`, 150, finalY + 15, { align: 'right' });
    
    // Add footer
    doc.setFontSize(10);
    doc.text('Thank you for shopping with Elegance Jewels!', 105, finalY + 30, { align: 'center' });
    doc.text('For any questions, please contact customer service at support@elegancejewels.com', 105, finalY + 35, { align: 'center' });
    
    // Save the PDF
    doc.save(`EleganceJewels-Receipt-${order._id}.pdf`);
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'processing':
        return <Badge bg="info">Processing</Badge>;
      case 'shipped':
        return <Badge bg="primary">Shipped</Badge>;
      case 'delivered':
        return <Badge bg="success">Delivered</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading your orders...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }
  
  if (orders.length === 0) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <h3>No Orders Yet</h3>
            <p className="mb-4">You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">My Orders</h1>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <Link to={`/order/${order._id}`} className="text-decoration-none">
                        #{order._id.substring(0, 8)}...
                      </Link>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.items.length} item(s)</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>{getStatusBadge(order.status || 'processing')}</td>
                    <td>
                      <div className="d-flex">
                        <Link 
                          to={`/order/${order._id}`}
                          className="btn btn-sm btn-outline-secondary me-2" 
                          title="View Order"
                        >
                          <FiEye />
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => generateReceipt(order)}
                          title="Download Receipt"
                        >
                          <FiDownload />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrdersPage; 