import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { clearCart } from '../redux/slices/cartSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Store total in a local variable with a fallback to 0
  const total = totalAmount || 0;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: ''
  });
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Handle shipping address input change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle payment details input change
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Handle credit card payment
  const handleCardPayment = async () => {
    if (!validateForm() || !validateCreditCardForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = await currentUser.getIdToken();
      
      // Create the order with payment details
      const response = await axios.post(
        'http://localhost:7777/api/orders',
        {
          items,
          shippingAddress,
          paymentMethod: 'card',
          paymentDetails: {
            lastFourDigits: paymentDetails.cardNumber.slice(-4),
            cardHolder: paymentDetails.cardHolder
          },
          total
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        dispatch(clearCart());
        toast.success('Payment successful! Order placed.');
        navigate(`/order-confirmation/${response.data.order._id}`);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Cash on Delivery order
  const handleCashOnDelivery = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = await currentUser.getIdToken();
      
      const response = await axios.post(
        'http://localhost:7777/api/orders',
        {
          items,
          shippingAddress,
          paymentMethod: 'cash_on_delivery',
          total
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${response.data.order._id}`);
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Form validation for shipping address
  const validateForm = () => {
    const requiredFields = ['fullName', 'addressLine1', 'city', 'state', 'postalCode', 'country', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    
    if (missingFields.length > 0) {
      setError('Please fill in all required shipping address fields');
      return false;
    }
    
    return true;
  };

  // Credit card form validation
  const validateCreditCardForm = () => {
    if (paymentMethod !== 'card') {
      return true;
    }

    const { cardNumber, cardHolder, expiryDate, cvv } = paymentDetails;
    
    // Simple validations
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    
    if (!cardHolder) {
      setError('Please enter the card holder name');
      return false;
    }
    
    if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      setError('Please enter a valid CVV code');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleCheckout = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      handleCardPayment();
    } else {
      handleCashOnDelivery();
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">Checkout</h1>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h3 className="mb-3">Shipping Information</h3>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleCheckout}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Full Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleAddressChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Address Line 1*</Form.Label>
                      <Form.Control
                        type="text"
                        name="addressLine1"
                        value={shippingAddress.addressLine1}
                        onChange={handleAddressChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Address Line 2</Form.Label>
                      <Form.Control
                        type="text"
                        name="addressLine2"
                        value={shippingAddress.addressLine2}
                        onChange={handleAddressChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>City*</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>State/Province*</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Postal/ZIP Code*</Form.Label>
                      <Form.Control
                        type="text"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleAddressChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Country*</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleAddressChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Phone Number*</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={shippingAddress.phoneNumber}
                        onChange={handleAddressChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <h3 className="mt-4 mb-3">Payment Method</h3>
                <Form.Group className="mb-4">
                  <div className="mb-3">
                    <Form.Check
                      type="radio"
                      label="Credit Card"
                      name="paymentMethod"
                      id="card"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={handlePaymentMethodChange}
                    />
                  </div>
                  
                  <div>
                    <Form.Check
                      type="radio"
                      label="Cash on Delivery"
                      name="paymentMethod"
                      id="cod"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery' || paymentMethod === 'cod'}
                      onChange={handlePaymentMethodChange}
                    />
                    <small className="text-muted d-block ml-4">Pay when you receive your order</small>
                  </div>
                </Form.Group>
                
                {paymentMethod === 'card' && (
                  <div className="mt-4 p-3 border rounded">
                    <h4 className="mb-3">Credit Card Information</h4>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Card Number*</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Card Holder Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardHolder"
                        value={paymentDetails.cardHolder}
                        onChange={handlePaymentChange}
                        placeholder="John Doe"
                        required
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Expiry Date*</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            value={paymentDetails.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>CVV*</Form.Label>
                          <Form.Control
                            type="text"
                            name="cvv"
                            value={paymentDetails.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="mt-2 d-flex gap-3">
                      <i className="bi bi-credit-card-2-front fs-4"></i>
                      <i className="bi bi-credit-card fs-4"></i>
                      <i className="bi bi-credit-card-fill fs-4"></i>
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg" 
                  className="w-100 mt-4"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : paymentMethod === 'card' ? 'Pay Now' : 'Place Order'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-4">Order Summary</h3>
              
              {items.map((item) => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <hr />
              
                            <div className="d-flex justify-content-between mb-2">                <span>Subtotal</span>                <span>${(total || 0).toFixed(2)}</span>              </div>                            <div className="d-flex justify-content-between mb-2">                <span>Shipping</span>                <span>Free</span>              </div>                            <hr />                            <div className="d-flex justify-content-between mb-2 fw-bold">                <span>Total</span>                <span>${(total || 0).toFixed(2)}</span>              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage; 