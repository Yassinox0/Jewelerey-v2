import axios from 'axios';

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get('/api/products');
    return { 
      success: response.data.success, 
      data: response.data.data 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch products'
    };
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`/api/products/${id}`);
    return { 
      success: response.data.success, 
      data: response.data.data 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch product'
    };
  }
};

// Get products by category
export const getProductsByCategory = async (categorySlug) => {
  try {
    const response = await axios.get(`/api/products/category/slug/${categorySlug}`);
    return { 
      success: response.data.success,
      category: response.data.category,
      data: response.data.data 
    };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch products by category'
    };
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await axios.get('/api/categories');
    return { 
      success: response.data.success, 
      data: response.data.data 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch categories'
    };
  }
};

// Admin functions
export const createProduct = async (productData, token) => {
  try {
    const response = await axios.post('/api/admin/products', productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { 
      success: response.data.success, 
      data: response.data.data 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to create product'
    };
  }
};

export const updateProduct = async (id, productData, token) => {
  try {
    const response = await axios.put(`/api/admin/products/${id}`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { 
      success: response.data.success, 
      data: response.data.data 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to update product'
    };
  }
};

export const deleteProduct = async (id, token) => {
  try {
    const response = await axios.delete(`/api/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { 
      success: response.data.success, 
      data: response.data.data 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to delete product'
    };
  }
}; 