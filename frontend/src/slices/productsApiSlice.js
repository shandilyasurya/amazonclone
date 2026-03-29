import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ['Product'],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } = productsApiSlice;
