import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FiCheckCircle, FiTruck, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { currentUser } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!currentUser || !orderId) return;
      
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.get(
          `http://localhost:7777/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError('Failed to load order details');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Error loading order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, currentUser]);
  
  const generateReceipt = () => {
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
    doc.save(`EleganceJewels-Receipt-${orderId}.pdf`);
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading order details...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
        <div className="text-center mt-4">
          <Link to="/orders" className="btn btn-primary">View All Orders</Link>
        </div>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Order not found.
        </Alert>
        <div className="text-center mt-4">
          <Link to="/orders" className="btn btn-primary">View All Orders</Link>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-md-5">
              <div className="text-center mb-4">
                <FiCheckCircle size={60} className="text-success mb-3" />
                <h1>Thank You for Your Order!</h1>
                <p className="lead">Your order has been received and is being processed.</p>
              </div>
              
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <h4>Order Information</h4>
                  <p><strong>Order Number:</strong> {order._id}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Credit Card'}</p>
                  {order.paymentMethod === 'card' && order.paymentDetails && (
                    <p><strong>Card Details:</strong> **** **** **** {order.paymentDetails.lastFourDigits} ({order.paymentDetails.cardHolder})</p>
                  )}
                  <p><strong>Status:</strong> <span className="badge bg-info">Processing</span></p>
                </Col>
                
                <Col md={6}>
                  <h4>Shipping Address</h4>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p>Phone: {order.shippingAddress.phoneNumber}</p>
                </Col>
              </Row>
              
              <h4>Order Items</h4>
              <div className="table-responsive mb-4">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item._id || item.productId}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Subtotal</strong></td>
                      <td>${order.total.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Shipping</strong></td>
                      <td>Free</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Total</strong></td>
                      <td><strong>${order.total.toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="d-flex flex-column flex-md-row justify-content-between">
                <Button 
                  variant="outline-primary" 
                  className="mb-3 mb-md-0"
                  onClick={generateReceipt}
                >
                  <FiDownload className="me-2" />
                  Download Receipt
                </Button>
                
                <Link to="/orders" className="btn btn-primary">
                  <FiTruck className="me-2" />
                  Track My Order
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmationPage; 