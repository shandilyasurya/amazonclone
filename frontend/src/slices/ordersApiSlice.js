import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order', 'Cart', 'Product'],
    }),
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ['Order'],
    }),
  }),
});

export const { usePlaceOrderMutation, useGetOrdersQuery, useGetOrderByIdQuery } = ordersApiSlice;
