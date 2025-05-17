import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  authError: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      // Use _id for MongoDB products or fallback to id for compatibility
      const productId = product._id || product.id;
      
      const existingItemIndex = state.items.findIndex(item => {
        // Check both _id and id for compatibility
        const itemId = item._id || item.id;
        return itemId === productId;
      });
      
      if (existingItemIndex >= 0) {
        // Item already in cart, update quantity
        state.items[existingItemIndex].quantity += quantity;
        state.items[existingItemIndex].totalPrice = 
          state.items[existingItemIndex].price * state.items[existingItemIndex].quantity;
      } else {
        // Add new item to cart
        state.items.push({
          id: productId,
          _id: product._id, // Store both ID formats for compatibility
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          totalPrice: product.price * quantity
        });
      }
      
      // Update cart totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      
      // Clear any auth errors
      state.authError = null;
    },
    
    setAuthError: (state, action) => {
      state.authError = action.payload;
    },
    
    clearAuthError: (state) => {
      state.authError = null;
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => {
        // Check both _id and id for compatibility
        const itemId = item._id || item.id;
        return itemId !== id;
      });
      
      // Update cart totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
    },
    
    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => {
        // Check both _id and id for compatibility
        const itemId = item._id || item.id;
        return itemId === id;
      });
      
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity = quantity;
        state.items[itemIndex].totalPrice = state.items[itemIndex].price * quantity;
        
        // Update cart totals
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateCartItem, 
  clearCart, 
  setAuthError, 
  clearAuthError 
} = cartSlice.actions;

export default cartSlice.reducer; 