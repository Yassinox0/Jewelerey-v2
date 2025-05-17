import axios from 'axios';

// Get cart
export const getCart = async (token) => {
  try {
    const response = await axios.get('/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch cart'
    };
  }
};

// Add item to cart
export const addToCart = async (productId, quantity, token) => {
  try {
    const response = await axios.post('/api/cart/items', 
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to add item to cart'
    };
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (itemId, quantity, token) => {
  try {
    const response = await axios.put(`/api/cart/items/${itemId}`, 
      { quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to update cart item'
    };
  }
};

// Remove item from cart
export const removeFromCart = async (itemId, token) => {
  try {
    const response = await axios.delete(`/api/cart/items/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to remove item from cart'
    };
  }
};

// Clear cart
export const clearCart = async (token) => {
  try {
    const response = await axios.delete('/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to clear cart'
    };
  }
}; 