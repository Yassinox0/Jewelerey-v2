import { toast } from 'react-toastify';
import axios from 'axios';
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setAuthError
} from '../redux/slices/cartSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Checks if the user is authenticated
 * If not, shows an error message and redirects to login
 * 
 * @param {Object} currentUser - The current user object
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} navigate - React router navigate function
 * @param {String} action - The action being performed
 * @returns {boolean} - Whether the user is authenticated
 */
export const checkAuth = (currentUser, dispatch, navigate, action = 'perform this action') => {
  if (!currentUser) {
    const errorMessage = `Please login to ${action}`;
    dispatch(setAuthError(errorMessage));
    toast.error(errorMessage, {
      onClick: () => navigate('/login')
    });
    navigate('/login');
    return false;
  }
  return true;
};

/**
 * Adds a product to the cart if the user is authenticated
 * If the user is not authenticated, redirects to login
 * 
 * @param {Object} product - The product to add to cart
 * @param {Number} quantity - The quantity to add
 * @param {Object} currentUser - The current user object
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} navigate - React router navigate function
 */
export const addToCartWithAuth = async (product, quantity, currentUser, dispatch, navigate) => {
  if (!checkAuth(currentUser, dispatch, navigate, 'add items to your cart')) {
    return;
  }

  // Make sure we're using the correct product object format with _id for MongoDB
  const productWithCorrectId = {
    ...product,
    id: product._id || product.id // Ensure we have id field for compatibility
  };

  // Add to cart in Redux state first for immediate UI feedback
  dispatch(addToCart({ product: productWithCorrectId, quantity }));
  toast.success(`${product.name} added to cart!`);

  try {
    // Sync with backend
    await axios.post(`${API_URL}/api/cart`, { product: productWithCorrectId, quantity });
  } catch (error) {
    console.error('Error syncing cart with server:', error);
    // Don't show error to user since the item appears in the cart from their perspective
    // Just log it for debugging purposes
  }
};

/**
 * Removes a product from the cart if the user is authenticated
 * If the user is not authenticated, redirects to login
 * 
 * @param {Number} productId - The ID of the product to remove
 * @param {Object} currentUser - The current user object
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} navigate - React router navigate function
 */
export const removeFromCartWithAuth = async (productId, currentUser, dispatch, navigate) => {
  if (!checkAuth(currentUser, dispatch, navigate, 'remove items from your cart')) {
    return;
  }

  // Remove from cart in Redux state first for immediate UI feedback
  dispatch(removeFromCart(productId));
  toast.success('Item removed from cart');

  try {
    // Sync with backend
    await axios.delete(`${API_URL}/api/cart/${productId}`);
  } catch (error) {
    console.error('Error syncing item removal with server:', error);
    // Don't show error to user since the item is removed from the cart from their perspective
    // Just log it for debugging purposes
  }
};

/**
 * Updates the quantity of a product in the cart if the user is authenticated
 * If the user is not authenticated, redirects to login
 * 
 * @param {Number} productId - The ID of the product to update
 * @param {Number} quantity - The new quantity
 * @param {Object} currentUser - The current user object
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} navigate - React router navigate function
 */
export const updateCartQuantityWithAuth = async (productId, quantity, currentUser, dispatch, navigate) => {
  if (!checkAuth(currentUser, dispatch, navigate, 'update your cart')) {
    return;
  }

  // Update cart in Redux state first for immediate UI feedback
  dispatch(updateCartItem({ id: productId, quantity }));
  toast.success('Cart updated');

  try {
    // Sync with backend
    await axios.put(`${API_URL}/api/cart/${productId}`, { quantity });
  } catch (error) {
    console.error('Error syncing cart update with server:', error);
    // Don't show error to user since the cart appears updated from their perspective
    // Just log it for debugging purposes
  }
};

/**
 * Clears the cart if the user is authenticated
 * If the user is not authenticated, redirects to login
 * 
 * @param {Object} currentUser - The current user object
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} navigate - React router navigate function
 * @returns {boolean} - Whether the cart was cleared successfully
 */
export const clearCartWithAuth = async (currentUser, dispatch, navigate) => {
  if (!checkAuth(currentUser, dispatch, navigate, 'clear your cart')) {
    return false;
  }

  // Clear the cart in Redux state first for immediate UI feedback
  dispatch(clearCart());
  toast.success('Cart cleared successfully');

  try {
    // Sync with backend
    await axios.delete(`${API_URL}/api/cart`);
    return true;
  } catch (error) {
    console.error('Error syncing cart clear with server:', error);
    // Don't show error to user since the cart is already cleared on the client side
    // This provides a better user experience while still logging the error
    return true; // Return true since the action appeared successful to the user
  }
};

/**
 * Fetches the user's cart from the server and updates the Redux store
 * 
 * @param {Object} currentUser - The current user object
 * @param {Function} dispatch - Redux dispatch function
 */
export const syncCartWithServer = async (currentUser, dispatch) => {
  if (!currentUser) return;
  
  try {
    const response = await axios.get(`${API_URL}/api/cart`);
    const serverCart = response.data.data;
    
    // Replace local cart with server cart
    if (serverCart && serverCart.items) {
      dispatch(clearCart());
      serverCart.items.forEach(item => {
        dispatch(addToCart({
          product: {
            id: item.id,
            _id: item._id, // Include MongoDB _id if available
            name: item.name,
            price: item.price,
            image: item.image
          },
          quantity: item.quantity
        }));
      });
    }
  } catch (error) {
    console.error('Error syncing cart with server:', error);
  }
}; 