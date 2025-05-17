import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingInfo: localStorage.getItem('shippingInfo')
    ? JSON.parse(localStorage.getItem('shippingInfo'))
    : {},
  loading: false,
  error: null
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (i) => i.id === item.id
      );

      if (existingItem) {
        state.cartItems = state.cartItems.map((i) =>
          i.id === existingItem.id ? item : i
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.id !== action.payload
      );
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem('shippingInfo', JSON.stringify(action.payload));
    }
  }
});

export const {
  addItemToCart,
  removeItemFromCart,
  clearCart,
  saveShippingInfo
} = cartSlice.actions;

export default cartSlice.reducer; 