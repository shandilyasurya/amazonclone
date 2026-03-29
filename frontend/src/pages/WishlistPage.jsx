import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../slices/wishlistApiSlice';
import { useAddToCartMutation } from '../slices/cartApiSlice';
import { useState } from 'react';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const WishlistPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();
  const [message, setMessage] = useState('');

  const items = data?.data || [];

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId).unwrap();
      setMessage('Removed from wishlist');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err?.data?.message || 'Failed to remove from wishlist');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
      await removeFromWishlist(product.id).unwrap();
      setMessage('Moved to cart');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err?.data?.message || 'Failed to add to cart');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto p-6 space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse w-48 rounded mb-6" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded shadow-sm" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto p-12 flex flex-col items-center gap-6 min-h-[60vh] justify-center bg-white mt-4 rounded-sm shadow-sm border border-gray-100">
        <div className="relative">
          <Heart size={100} className="text-gray-100 fill-gray-50" />
          <ShoppingCart size={40} className="text-gray-200 absolute -bottom-2 -right-2 bg-white rounded-full p-1" />
        </div>
        <div className="text-center">
          <h2 className="text-[24px] font-bold text-[#0F1111] mb-2">Your Wish List is empty</h2>
          <p className="text-[14px] text-gray-600 mb-8 max-w-sm">Save items that you're shopping for here. We'll even notify you when the price drops!</p>
          <Link to="/" className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-medium px-8 py-2.5 rounded-full transition shadow-sm text-[14px]">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen py-6">
      <div className="max-w-[1100px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[28px] font-normal text-[#0F1111]">Your Wish List</h1>
          <Link to="/" className="text-[14px] text-[#007185] hover:text-[#C7511F] hover:underline flex items-center gap-1">
            <ArrowLeft size={14} /> Back to shopping
          </Link>
        </div>

        {message && (
          <div className={`mb-6 p-3 rounded border flex items-center gap-2 text-[14px] animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.includes('Failed') 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            {message.includes('Failed') ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            {message}
          </div>
        )}

        {/* List */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 divide-y divide-gray-100">
          {items.map((item) => {
            const product = item.Product;
            if (!product) return null;
            const imgUrl = product.images?.[0]?.image_url ||
              `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80`;

            return (
              <div key={item.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50/50 transition-colors">
                {/* Image */}
                <Link to={`/product/${product.id}`} className="w-full md:w-[150px] aspect-square flex-shrink-0 bg-[#f9f9f9] rounded-sm p-4">
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-110"
                    loading="lazy"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/product/${product.id}`} 
                    className="text-[18px] font-medium text-[#0F1111] hover:text-[#C7511F] hover:underline leading-snug line-clamp-2 mb-1"
                  >
                    {product.name}
                  </Link>
                  
                  <div className="flex items-center gap-4 text-[12px] mb-3">
                    <span className="text-[#007600] font-medium">In Stock</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">Added on {new Date().toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[20px] font-bold text-[#0F1111]">{formatPrice(product.price)}</span>
                    {product.is_prime && (
                      <span className="text-[11px] bg-[#0574F7] text-white font-bold px-1.5 py-0.5 rounded-sm">prime</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 w-full md:w-[220px]">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-medium py-1.5 rounded-full text-[13px] transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="w-full h-[32px] border border-[#a2a6ac] bg-gradient-to-b from-[#f7f8fa] to-[#e7e9ec] hover:from-[#e7e9ec] hover:to-[#d9dce1] rounded-full text-[13px] font-medium text-[#0F1111] transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Remove item
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-[13px]">
          <p>You can also share your list with friends and family!</p>
          <Link to="/search" className="text-[#007185] hover:underline">Find more items to add ›</Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
