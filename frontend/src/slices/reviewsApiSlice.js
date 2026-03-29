import { apiSlice } from './apiSlice';

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (productId) => ({
        url: `/reviews/${productId}`,
      }),
      providesTags: ['Review'],
    }),
    addReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Review', 'Product'],
    }),
  }),
});

export const { useGetReviewsQuery, useAddReviewMutation } = reviewsApiSlice;
