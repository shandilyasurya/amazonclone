import { apiSlice } from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'Cart', 'Order'],
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Cart', 'Order'],
    }),
    getAddresses: builder.query({
      query: () => '/addresses',
      providesTags: ['User'],
    }),
    addAddress: builder.mutation({
      query: (data) => ({
        url: '/addresses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    })
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetAddressesQuery, useAddAddressMutation } = userApiSlice;
