import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAddToCartMutation } from '../slices/cartApiSlice';
import StarRating from './StarRating';
import { ShoppingCart, Heart, Loader2 } from 'lucide-react';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetWishlistQuery } from '../slices/wishlistApiSlice';
import { toast } from 'react-toastify';

const formatINR = (price) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(price);

const ProductCard = ({ product, compact = false, showBestSellerBadge = false }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [addToCart, { isLoading: addingCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: addingWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: removingWishlist }] = useRemoveFromWishlistMutation();
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !userInfo });

  if (!product) return null;

  const mainImage =
    product?.images?.[0]?.image_url ||
    product?.image_url ||
    `https://picsum.photos/seed/${product?.id || 'default'}/400/400`;

  const price = parseFloat(product.price);
  const mrp = Math.round(price * 1.25);
  const discount = Math.round(((mrp - price) / mrp) * 100);
  const inStock = product.stock > 0;
  const hasDiscount = discount >= 5;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) { navigate('/login'); return; }
    try { 
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
      toast.success('Added to Cart');
    } catch {}
  };

  const isInWishlist = wishlistData?.data?.some(item => item.product_id === product.id);

  const handleWishlist = async (e) => { 
    e.preventDefault(); 
    e.stopPropagation();
    if (!userInfo) { navigate('/login'); return; }

    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id).unwrap();
        toast.info('Removed from Wish List');
      } else {
        await addToWishlist({ productId: product.id }).unwrap();
        toast.success('Added to Wish List');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Wishlist update failed');
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="amz-card flex flex-col group relative overflow-hidden h-full"
    >
      {/* ── Image Zone ── */}
      <div className={`relative flex items-center justify-center bg-white overflow-hidden flex-shrink-0 ${compact ? 'h-[160px]' : 'h-[200px] sm:h-[220px]'}`}>
        <img
          src={mainImage}
          alt={product.name}
          className="max-h-full max-w-full object-contain p-3 group-hover:scale-[1.04] transition-transform duration-300 mix-blend-multiply"
          loading="lazy"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/400`; }}
        />

        {/* Best Seller ribbon */}
        {showBestSellerBadge && (
          <div className="badge-best-seller absolute top-0 left-0">
            #1 Best Seller
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && !compact && (
          <div className="badge-discount absolute top-2 right-2">
            -{discount}%
          </div>
        )}

        {/* Wishlist hover button */}
        <button
          onClick={handleWishlist}
          disabled={addingWishlist || removingWishlist}
          className={`absolute bottom-2 right-2 transition-all duration-200 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md border border-amz-gray-3 ${
            isInWishlist ? 'opacity-100 scale-110 !border-red-100 shadow-red-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          title={isInWishlist ? 'Remove from Wish List' : 'Add to Wish List'}
        >
          {addingWishlist || removingWishlist ? (
            <Loader2 size={13} className="animate-spin text-amz-gray-4" />
          ) : (
            <Heart 
              size={13} 
              className={`transition-colors ${
                isInWishlist ? 'text-red-500 fill-red-500' : 'text-amz-gray-4 hover:text-red-500'
              }`} 
            />
          )}
        </button>
      </div>

      {/* ── Content Zone ── */}
      <div className="flex flex-col flex-1 px-3 pt-2 pb-3">

        {/* Brand */}
        <p className="text-link text-[12px] truncate mb-0.5">
          {product.brand || 'AmazonBasics'}
        </p>

        {/* Title */}
        <h3 className={compact ? 'text-card-title mb-1' : 'text-card-title-3 mb-1.5'}>
          {product.name}
        </h3>

        {/* Star rating */}
        {!compact && (
          <div className="flex items-center gap-1 mb-1.5">
            <StarRating value={product.rating} size={12} />
            <span className="text-meta">
              ({(product.review_count || 0).toLocaleString('en-IN')})
            </span>
          </div>
        )}

        {/* Price block — pushes to bottom */}
        <div className="mt-auto">
          {/* Current price */}
          <div className="price-block mb-0.5">
            <span className="price-symbol">₹</span>
            <span className={compact ? 'text-[18px] font-bold' : 'price-int'}>
              {formatINR(price)}
            </span>
          </div>

          {/* MRP line */}
          {hasDiscount && (
            <p className="text-[12px] text-amz-gray-4">
              M.R.P.: <span className="text-price-mrp">₹{formatINR(mrp)}</span>
              {' '}<span className="text-amz-green font-medium">({discount}% off)</span>
            </p>
          )}

          {/* Prime or free delivery */}
          {product.is_prime ? (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="badge-prime">prime</span>
              <span className="text-[11px] text-amz-gray-4">FREE Delivery</span>
            </div>
          ) : (
            <p className="text-[11px] text-amz-blue mt-1">FREE Delivery on eligible orders</p>
          )}

          {/* Stock status */}
          {!inStock ? (
            <p className="text-[11px] text-amz-red font-medium mt-1">Currently unavailable</p>
          ) : product.stock < 10 ? (
            <p className="text-[11px] text-amz-red font-medium mt-1">Only {product.stock} left in stock</p>
          ) : null}

          {/* Add to Cart — full cards only */}
          {!compact && (
            <button
              onClick={handleAddToCart}
              disabled={!inStock || addingCart}
              className="btn-primary w-full mt-2.5"
            >
              <ShoppingCart size={13} strokeWidth={2} />
              {!inStock ? 'Out of Stock' : addingCart ? 'Adding…' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
