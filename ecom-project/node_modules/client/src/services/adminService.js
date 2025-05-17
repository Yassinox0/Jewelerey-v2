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