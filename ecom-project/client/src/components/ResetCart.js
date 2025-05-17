import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const ResetCart = () => {
  const dispatch = useDispatch();
  
  const handleResetCart = () => {
    dispatch(clearCart());
    toast.success('Shopping cart has been reset successfully');
    
    // Clear any local storage cart data as well
    localStorage.removeItem('cart');
  };
  
  return (
    <Button 
      variant="outline-danger" 
      size="sm"
      onClick={handleResetCart}
      className="ms-2"
    >
      Reset Cart
    </Button>
  );
};

export default ResetCart; 