import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  removeFromCartWithAuth, 
  updateCartQuantityWithAuth, 
  clearCartWithAuth 
} from '../utils/cartUtils';
import { toast } from 'react-toastify';
import ResetCart from '../components/ResetCart';

const CartPage = () => {
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRemoveItem = (id, name) => {
    removeFromCartWithAuth(id, currentUser, dispatch, navigate);
  };

  const handleQuantityChange = (id, quantity) => {
    updateCartQuantityWithAuth(id, quantity, currentUser, dispatch, navigate);
  };

  const handleClearCart = () => {
    clearCartWithAuth(currentUser, dispatch, navigate);
  };

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h1 className="mb-5">Your Shopping Cart</h1>
          <div className="p-5 mb-4" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="my-5 py-4">
              <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: 'var(--color-taupe)' }}></i>
              <h3 className="mt-4 mb-3">Your cart is empty</h3>
              <p className="text-muted mb-4">Browse our collection and add items to your cart.</p>
              <Link to="/products" className="btn btn-primary px-4 py-2">
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Your Shopping Cart</h1>
      
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="mb-4" style={{ backgroundColor: 'var(--color-background)', borderRadius: '2px' }}>
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h5 className="mb-0 fw-normal">Items in Your Cart ({totalQuantity})</h5>
              <div>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleClearCart}
                >
                  Clear All
                </button>
                <ResetCart />
              </div>
            </div>
            <div className="p-4">
              {items.map(item => (
                <div key={item.id} className="row mb-4 pb-4 border-bottom align-items-center">
                  <div className="col-md-2">
                    <div style={{ 
                      height: '100px', 
                      width: '100px', 
                      overflow: 'hidden', 
                      borderRadius: '2px',
                      border: '1px solid var(--color-light-grey)'
                    }}>
                      <img 
                        src={item.image || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        className="img-fluid"
                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h6 className="mb-2 fw-normal" style={{ fontFamily: 'var(--font-heading)' }}>{item.name}</h6>
                    <p className="text-muted small mb-0">${item.price.toFixed(2)} per item</p>
                  </div>
                  <div className="col-md-3">
                    <div className="input-group">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ borderRadius: '2px 0 0 2px' }}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input 
                        type="text" 
                        className="form-control text-center"
                        value={item.quantity}
                        readOnly
                        style={{ borderRadius: '0' }}
                      />
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        style={{ borderRadius: '0 2px 2px 0' }}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2 text-end">
                    <p className="mb-0 fw-bold" style={{ color: 'var(--color-burgundy)' }}>
                      ${item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="col-md-1 text-end">
                    <button 
                      className="btn btn-sm text-danger"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      style={{ border: 'none', background: 'none' }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Link to="/products" className="btn btn-outline-primary px-4">
              <i className="bi bi-arrow-left me-2"></i> Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div style={{ 
            backgroundColor: 'var(--color-background)', 
            borderRadius: '2px',
            padding: '2rem'
          }}>
            <h5 className="mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Order Summary</h5>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Subtotal ({totalQuantity} items)</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Shipping</span>
              <span style={{ color: 'var(--color-sage)' }}>Free</span>
            </div>
            <hr className="my-4" />
            <div className="d-flex justify-content-between mb-4">
              <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>Total</strong>
              <strong style={{ 
                fontFamily: 'var(--font-heading)', 
                color: 'var(--color-burgundy)',
                fontSize: '1.1rem'
              }}>
                ${totalAmount.toFixed(2)}
              </strong>
            </div>
            <button
              className="btn btn-primary w-100 py-3"
              disabled={!currentUser || isProcessing}
              onClick={handleCheckout}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
          </div>
          
          <div style={{ 
            backgroundColor: 'var(--color-background)', 
            borderRadius: '2px',
            padding: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <h6 className="mb-3 text-muted letter-spacing-1 text-uppercase small">We Accept</h6>
            <div className="d-flex gap-3">
              <i className="bi bi-credit-card-2-front fs-4" style={{ color: 'var(--color-navy)' }}></i>
              <i className="bi bi-paypal fs-4" style={{ color: 'var(--color-navy)' }}></i>
              <i className="bi bi-wallet2 fs-4" style={{ color: 'var(--color-navy)' }}></i>
              <i className="bi bi-bank fs-4" style={{ color: 'var(--color-navy)' }}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 