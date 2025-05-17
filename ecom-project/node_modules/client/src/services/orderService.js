import axios from 'axios';

// Get all orders for a user
export const getUserOrders = async (token) => {
  try {
    const response = await axios.get('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch orders'
    };
  }
};

// Get order by ID
export const getOrderById = async (orderId, token) => {
  try {
    const response = await axios.get(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch order'
    };
  }
};

// Create new order
export const createOrder = async (orderData, token) => {
  try {
    const response = await axios.post('/api/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to create order'
    };
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId, status, token) => {
  try {
    const response = await axios.put(`/api/admin/orders/${orderId}`, 
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to update order status'
    };
  }
};

// Get all orders (admin only)
export const getAllOrders = async (token) => {
  try {
    const response = await axios.get('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch all orders'
    };
  }
}; 