import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { Container, Row, Col } from 'react-bootstrap';

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const sessionId = new URLSearchParams(location.search).get('session_id');

  useEffect(() => {
    // Clear the cart after successful checkout
    dispatch(clearCart());
    
    // Here you could also make an API call to verify the session and update your database
  }, [dispatch]);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="text-center p-5" style={{ 
            backgroundColor: 'var(--color-background)', 
            borderRadius: '8px',
            border: '1px solid var(--color-light-grey)'
          }}>
            <div className="mb-4">
              <i className="bi bi-check-circle-fill" style={{ 
                fontSize: '5rem', 
                color: 'var(--color-sage)'
              }}></i>
            </div>
            <h1 className="h3 mb-4">Payment Successful!</h1>
            <p className="mb-4">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>
            <p className="mb-4 small text-muted">
              Order reference: {sessionId}
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/products" className="btn btn-primary px-4 py-2">
                Continue Shopping
              </Link>
              <Link to="/account/orders" className="btn btn-outline-primary px-4 py-2">
                View Orders
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutSuccessPage; 