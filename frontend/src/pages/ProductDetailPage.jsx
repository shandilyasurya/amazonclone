import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { useAddToCartMutation } from '../slices/cartApiSlice';
import { useAddToWishlistMutation } from '../slices/wishlistApiSlice';
import { useGetReviewsQuery } from '../slices/reviewsApiSlice';
import { toast } from 'react-toastify';
import StarRating from '../components/StarRating';
import QuantitySelector from '../components/QuantitySelector';
import { ShoppingCart, Zap, Heart, Shield, Truck, RotateCcw, CheckCircle, ChevronRight, AlertCircle, Pencil, ThumbsUp } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: response, isLoading, isError } = useGetProductDetailsQuery(id);
  const [addToCart, { isLoading: addingCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: addingWishlist }] = useAddToWishlistMutation();
  const { data: reviewsData } = useGetReviewsQuery(id);

  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [cartMsg, setCartMsg] = useState('');

  if (isLoading) {
    return (
      <div className="max-w-[1500px] mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 animate-pulse">
        <div className="md:col-span-5 bg-gray-200 aspect-square rounded" />
        <div className="md:col-span-4 flex flex-col gap-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="md:col-span-3 bg-gray-200 rounded h-64" />
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-xl text-gray-600">Product not found.</p>
        <button onClick={() => navigate('/')} className="text-[#007185] hover:underline">
          ← Back to Home
        </button>
      </div>
    );
  }

  const product = response.data;
  const images = product.images?.length
    ? product.images.map((img) => img.image_url)
    : [`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80`];

  const handleAddToCart = async () => {
    if (!userInfo) { navigate('/login'); return; }
    try {
      await addToCart({ productId: product.id, quantity: qty }).unwrap();
      setCartMsg('Added to Cart!');
      setTimeout(() => setCartMsg(''), 2000);
    } catch (err) {
      setCartMsg('Failed to add item');
    }
  };

  const handleBuyNow = async () => {
    if (!userInfo) { navigate('/login'); return; }
    try {
      await addToCart({ productId: product.id, quantity: qty }).unwrap();
      navigate('/checkout');
    } catch {}
  };

  const handleAddToWishlist = async () => {
    if (!userInfo) { navigate('/login'); return; }
    try {
      await addToWishlist({ productId: product.id }).unwrap();
      toast.success('Added to your Wish List');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add to Wish List');
    }
  };

  const inStock = product.stock > 0;
  const mrp = Math.round(product.price * 1.2);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1500px] mx-auto px-4 py-2 flex items-center gap-1 text-[12px] text-[#007185]">
        <a href="/" className="hover:underline hover:text-[#C7511F]">Home</a>
        <ChevronRight size={12} />
        {product.Category && (
          <>
            <a href={`/search?category=${product.Category.slug}`} className="hover:underline hover:text-[#C7511F]">
              {product.Category.name}
            </a>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* ── Image Panel ── */}
        <div className="md:col-span-5 flex flex-col md:flex-row gap-2 md:gap-3">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-2 w-16">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImg(i)}
                className={`w-14 h-14 border-2 cursor-pointer rounded overflow-hidden flex-shrink-0 transition-all ${
                  selectedImg === i ? 'border-[#FF9900]' : 'border-[#DDD] hover:border-[#aaa]'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 sticky top-20 bg-white border border-gray-200 flex items-center justify-center p-4 max-h-[550px]">
            <img
              src={images[selectedImg]}
              alt={product.name}
              className="w-full max-h-[500px] object-contain transition-all duration-300"
              loading="lazy"
            />
          </div>

          {/* Mobile thumbnails */}
          <div className="flex md:hidden gap-2 mt-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setSelectedImg(i)}
                className={`w-14 h-14 object-cover border-2 rounded cursor-pointer flex-shrink-0 ${selectedImg === i ? 'border-[#FF9900]' : 'border-[#DDD]'}`}
                loading="lazy"
              />
            ))}
          </div>
        </div>

        {/* ── Product Info ── */}
        <div className="md:col-span-4">
          <p className="text-link text-[13px] mb-1 inline-block">
            Brand: <span className="font-semibold">{product.brand || 'Generic'}</span>
          </p>
          <h1 className="text-[22px] font-medium leading-snug text-[#0F1111] mb-3">{product.name}</h1>

          {/* Stars */}
          <div className="flex items-center gap-2 mb-2">
            <StarRating value={product.rating} size={16} />
            <span className="text-[13px] text-[#007185] hover:underline cursor-pointer">
              {product.review_count?.toLocaleString('en-IN')} ratings
            </span>
          </div>

          <div className="border-t border-[#e7e7e7] my-3" />

          {/* Price */}
          <div className="mb-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="price-block">
                <span className="price-symbol">₹</span>
                <span className="price-int-lg">{Math.floor(product.price).toLocaleString('en-IN')}</span>
              </div>
              <span className="text-price-mrp">M.R.P.: ₹{mrp.toLocaleString('en-IN')}</span>
              <span className="text-[13px] text-amz-green font-medium">
                ({Math.round(((mrp - product.price) / mrp) * 100)}% off)
              </span>
            </div>
            <p className="text-[12px] text-amz-gray-4 mt-0.5">Inclusive of all taxes</p>
          </div>

          {/* Prime badge */}
          {product.is_prime && (
            <div className="flex items-center gap-2 mb-3 text-[13px]">
              <span className="bg-[#0574F7] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">prime</span>
              <span className="text-[#007185]">FREE Delivery by <strong>Tomorrow</strong></span>
            </div>
          )}

          {/* Services icons */}
          <div className="flex gap-4 text-[12px] text-gray-600 mb-4">
            <div className="flex flex-col items-center gap-1"><Truck size={18} className="text-[#232F3E]" /><span>Free Delivery</span></div>
            <div className="flex flex-col items-center gap-1"><RotateCcw size={18} className="text-[#232F3E]" /><span>10 Day Returns</span></div>
            <div className="flex flex-col items-center gap-1"><Shield size={18} className="text-[#232F3E]" /><span>1 Year Warranty</span></div>
          </div>

          {/* Tab navigation */}
          <div className="border-t border-[#e7e7e7] pt-4">
            <div className="flex gap-4 mb-3 border-b border-[#e7e7e7]">
              {['description', 'specifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-[13px] font-medium capitalize ${activeTab === tab ? 'border-b-2 border-[#FF9900] text-[#0F1111]' : 'text-[#007185] hover:text-[#C7511F]'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'description' ? (
              <ul className="text-[14px] text-[#0F1111] leading-relaxed list-disc pl-4 space-y-1.5">
                <li>{product.description}</li>
                <li>Designed for everyday use with premium materials.</li>
                <li>Backed by a manufacturer warranty for reliable performance.</li>
                <li>Ships from Amazon's dedicated fulfillment center.</li>
              </ul>
            ) : (
              <table className="text-[13px] w-full">
                <tbody>
                  {[
                    ['Brand', product.brand || 'Generic'],
                    ['Model', product.name?.split(' ').slice(0, 3).join(' ')],
                    ['In Stock', product.stock > 0 ? `Yes (${product.stock} units)` : 'No'],
                    ['Rating', `${product.rating} / 5`],
                    ['Reviews', product.review_count],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-[#e7e7e7]">
                      <td className="py-2 text-gray-600 w-1/3">{k}</td>
                      <td className="py-2 font-medium">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Buy Box ── */}
        <div className="md:col-span-3 self-start sticky top-20">
          <div className="border border-[#D5D9D9] rounded-lg p-5 bg-white shadow-sm flex flex-col gap-3">
            <div className="text-[24px] font-bold text-[#B12704]">{formatPrice(product.price)}</div>

            {product.is_prime && (
              <div className="flex items-center gap-1 text-[13px]">
                <span className="bg-[#0574F7] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">prime</span>
                <span className="text-[#007185]">FREE delivery</span>
              </div>
            )}

            <div className="text-[13px]">
              <span className="text-[#007185]">FREE delivery</span> <strong>Tomorrow, 29 March.</strong>
              <br />Order within <span className="font-bold">12 hrs 30 mins</span>
            </div>

            <div>
              <span className={`text-[16px] font-medium ${inStock ? 'text-[#007600]' : 'text-[#B12704]'}`}>
                {inStock ? 'In Stock' : 'Currently unavailable'}
              </span>
            </div>

            {inStock && (
              <div className="flex items-center gap-2 text-[13px]">
                <span className="text-gray-600">Quantity:</span>
                <QuantitySelector quantity={qty} setQuantity={setQty} max={Math.min(product.stock, 10)} />
              </div>
            )}

            {cartMsg && (
              <div className={`flex items-center gap-1 text-[13px] ${cartMsg.includes('Failed') ? 'text-[#B12704]' : 'text-[#007600]'}`}>
                {cartMsg.includes('Failed') ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                {cartMsg}
              </div>
            )}

            <button onClick={handleAddToCart} disabled={!inStock || addingCart} className="btn-primary w-full !rounded-full py-2">
              <ShoppingCart size={15} />
              {addingCart ? 'Adding…' : 'Add to Cart'}
            </button>

            <button onClick={handleBuyNow} disabled={!inStock} className="btn-secondary w-full !rounded-full py-2">
              <Zap size={15} />
              Buy Now
            </button>

            <div className="text-[12px] text-gray-600 flex flex-col gap-1 border-t border-[#e7e7e7] pt-3">
              <div className="flex justify-between"><span>Ships from</span><span className="font-medium">Amazon</span></div>
              <div className="flex justify-between"><span>Sold by</span><span className="font-medium text-[#007185]">{product.brand || 'Cloudtail India'}</span></div>
              <div className="flex justify-between"><span>Payment</span><span className="font-medium">EMI available</span></div>
            </div>

            <button 
              onClick={handleAddToWishlist}
              disabled={addingWishlist}
              className="text-[13px] text-[#007185] hover:text-[#C7511F] hover:underline flex items-center gap-1 justify-center mt-2 group transition-colors"
            >
              <Heart size={13} className={addingWishlist ? 'animate-pulse' : 'group-hover:fill-[#C7511F] group-hover:text-[#C7511F]'} />
              {addingWishlist ? 'Adding…' : 'Add to Wish List'}
            </button>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════
          CUSTOMER REVIEWS SECTION
      ══════════════════════════════════════ */}
      <div className="max-w-[1500px] mx-auto px-4 pb-14">
        <div className="border-t border-[#ddd] pt-8 grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Left: Rating summary + Write Review CTA */}
          <div className="md:col-span-3">
            <h2 className="text-[22px] font-medium text-[#0F1111] mb-4">Customer reviews</h2>

            {/* Overall Stars */}
            <div className="flex items-center gap-2 mb-1">
              <StarRating value={product.rating} size={18} />
              <span className="text-[16px] font-medium text-[#0F1111]">{product.rating} out of 5</span>
            </div>
            <p className="text-[13px] text-[#565959] mb-4">
              {product.review_count?.toLocaleString('en-IN')} global ratings
            </p>

            {/* Rating breakdown bars */}
            {[5, 4, 3, 2, 1].map((star) => {
              const reviews = reviewsData?.data || [];
              const count = reviews.filter((r) => Math.round(r.rating) === star).length;
              const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2 mb-1.5 text-[13px]">
                  <span className="text-[#007185] hover:underline w-10 shrink-0">{star} star</span>
                  <div className="flex-1 bg-[#f0f0f0] rounded-full h-[14px] overflow-hidden">
                    <div
                      className="bg-[#FF9900] h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[#007185] w-8 text-right">{pct}%</span>
                </div>
              );
            })}

            {/* Write a review CTA */}
            <div className="border-t border-[#ddd] mt-5 pt-5">
              <h3 className="text-[16px] font-medium text-[#0F1111] mb-1">Review this product</h3>
              <p className="text-[13px] text-[#565959] mb-3">Share your thoughts with other customers</p>
              <button
                onClick={() => {
                  if (!userInfo) { navigate('/login'); return; }
                  navigate(`/review/create-review/${id}`);
                }}
                className="w-full border border-[#D5D9D9] rounded-lg bg-white hover:bg-[#f7f8f8] text-[#0F1111] text-[13px] font-medium py-2 px-4 flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Pencil size={14} />
                Write a product review
              </button>
            </div>
          </div>

          {/* Right: Individual reviews */}
          <div className="md:col-span-9">
            {(() => {
              const reviews = reviewsData?.data || [];
              if (reviews.length === 0) {
                return (
                  <div className="text-[14px] text-[#565959] pt-4 border-t border-[#ddd]">
                    <p className="font-medium text-[#0F1111] mb-1">There are no customer reviews yet</p>
                    <p>Be the first to review this product.</p>
                  </div>
                );
              }
              return (
                <div className="space-y-6">
                  {reviews.map((review) => {
                    const initials = (review.User?.name || 'A')
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();
                    const dateStr = new Date(review.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    });
                    return (
                      <div key={review.id} className="border-b border-[#ddd] pb-5">
                        {/* Reviewer name + avatar */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-[#232F3E] text-white flex items-center justify-center text-[12px] font-bold flex-shrink-0">
                            {initials}
                          </div>
                          <span className="text-[13px] font-bold text-[#0F1111]">
                            {review.User?.name || 'Anonymous'}
                          </span>
                        </div>

                        {/* Stars + title */}
                        <div className="flex items-center gap-2 mb-1">
                          <StarRating value={review.rating} size={14} />
                          <span className="text-[14px] font-bold text-[#0F1111]">{review.title}</span>
                        </div>

                        {/* Date + Verified */}
                        <p className="text-[12px] text-[#565959] mb-2">
                          Reviewed in India on {dateStr} &nbsp;|&nbsp;
                          <span className="text-[#C7511F] font-medium">Verified Purchase</span>
                        </p>

                        {/* Body */}
                        {review.body && (
                          <p className="text-[14px] text-[#0F1111] leading-relaxed mb-3">{review.body}</p>
                        )}

                        {/* Review photo */}
                        {review.image_url && (
                          <img
                            src={review.image_url}
                            alt="Review photo"
                            className="w-24 h-24 object-cover rounded border border-[#DDD] mb-3 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(review.image_url, '_blank')}
                          />
                        )}

                        {/* Helpful */}
                        <div className="flex items-center gap-3 text-[12px] text-[#565959]">
                          <span>Helpful?</span>
                          <button className="border border-[#D5D9D9] rounded px-2 py-0.5 hover:bg-[#f7f8f8] flex items-center gap-1 transition-colors">
                            <ThumbsUp size={12} /> Yes
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
