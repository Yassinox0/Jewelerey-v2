import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Set up axios with credentials
axios.defaults.withCredentials = true;

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
};

//-----------------------------
// User Management
//-----------------------------

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/users`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/admin/users/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//-----------------------------
// Product Management
//-----------------------------

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/products`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/api/admin/products`, productData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`${API_URL}/api/admin/products/${productId}`, productData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/admin/products/${productId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update product stock
export const updateProductStock = async (productId, stockData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/api/admin/products/${productId}/stock`, 
      stockData, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//-----------------------------
// Order Management
//-----------------------------

// Get all orders
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/orders`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get recent orders
export const getRecentOrders = async (limit = 5) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/orders/recent?limit=${limit}`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/api/admin/orders/${orderId}/status`, 
      statusData, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//-----------------------------
// Customer Management
//-----------------------------

// Get all customers
export const getAllCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/customers`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get customer orders
export const getCustomerOrders = async (customerId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/customers/${customerId}/orders`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//-----------------------------
// Inventory Management
//-----------------------------

// Get low stock alerts
export const getLowStockAlerts = async (threshold = 5) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/inventory/low-stock?threshold=${threshold}`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get material usage
export const getMaterialUsage = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/inventory/materials`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//-----------------------------
// Dashboard & Reports
//-----------------------------

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/dashboard/stats`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get sales data for reports
export const getSalesData = async (days = 7, groupBy = 'daily') => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/reports/sales?days=${days}&groupBy=${groupBy}`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get bestseller products
export const getBestsellers = async (days = 30, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/reports/bestsellers?days=${days}&limit=${limit}`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 