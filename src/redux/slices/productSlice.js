import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    productsRequest: (state) => {
      state.loading = true;
    },
    productsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.data;
      state.totalPages = action.payload.pagination.totalPages;
      state.currentPage = action.payload.pagination.currentPage;
      state.error = null;
    },
    productsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    productDetailsRequest: (state) => {
      state.loading = true;
    },
    productDetailsSuccess: (state, action) => {
      state.loading = false;
      state.product = action.payload;
      state.error = null;
    },
    productDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    }
  }
});

export const {
  productsRequest,
  productsSuccess,
  productsFail,
  productDetailsRequest,
  productDetailsSuccess,
  productDetailsFail,
  clearErrors
} = productSlice.actions;

export default productSlice.reducer; 