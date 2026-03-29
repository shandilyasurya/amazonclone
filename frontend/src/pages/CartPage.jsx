import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from '../slices/cartApiSlice';
import QuantitySelector from '../components/QuantitySelector';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const CartPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();

  const items = data?.data || [];

  const subtotal = items.reduce((acc, item) => {
    const price = parseFloat(item.Product?.price || 0);
    return acc + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleQtyChange = async (itemId, quantity) => {
    try {
      await updateItem({ itemId, quantity }).unwrap();
    } catch {}
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId).unwrap();
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="max-w-[1500px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-200 animate-pulse rounded" />)}
        </div>
        <div className="lg:col-span-4 h-48 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1500px] mx-auto p-10 flex flex-col items-center gap-4 min-h-[60vh] justify-center">
        <ShoppingBag size={80} className="text-gray-300" />
        <h2 className="text-2xl font-medium text-gray-700">Your Amazon Cart is empty</h2>
        <p className="text-gray-500 text-sm">Shop today's deals</p>
        <Link to="/" className="mt-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium px-6 py-2 rounded-full transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen py-4">
      <div className="max-w-[1500px] mx-auto px-2 md:px-4 flex flex-col lg:grid lg:grid-cols-12 gap-4">
        {/* ── Cart Items ── */}
        <div className="lg:col-span-9 order-2 lg:order-1">
          <div className="bg-white p-4 md:p-6 rounded-sm shadow-sm">
            <h1 className="text-[28px] font-normal border-b border-[#DDD] pb-4 mb-4">Shopping Cart</h1>
            <div className="text-right text-[12px] text-gray-500 hidden md:block mb-2">Price</div>

            <div className="divide-y divide-[#DDD]">
              {items.map((item) => {
                const product = item.Product;
                if (!product) return null;
                const imgUrl = product.images?.[0]?.image_url ||
                  `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80`;

                return (
                  <div key={item.id} className="py-4 grid grid-cols-12 gap-4">
                    {/* Image */}
                    <div className="col-span-3 md:col-span-2">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={imgUrl}
                          alt={product.name}
                          className="w-full aspect-square object-contain mix-blend-multiply"
                          loading="lazy"
                        />
                      </Link>
                    </div>

                    {/* Info */}
                    <div className="col-span-7 md:col-span-8 flex flex-col gap-2">
                      <Link to={`/product/${product.id}`} className="text-[16px] text-[#0F1111] hover:text-[#C7511F] leading-snug line-clamp-2">
                        {product.name}
                      </Link>
                      <p className="text-[12px] text-[#007600]">In Stock</p>
                      {product.is_prime && (
                        <span className="text-[11px] bg-[#0574F7] text-white font-bold px-1.5 py-0.5 rounded-sm w-fit">prime</span>
                      )}
                      <div className="flex items-center gap-4 mt-1">
                        <QuantitySelector
                          quantity={item.quantity}
                          setQuantity={(q) => handleQtyChange(item.id, q)}
                          max={product.stock}
                        />
                        <span className="text-[#564E4E] text-[12px]">|</span>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-[12px] text-[#007185] hover:text-[#C7511F] hover:underline flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                        <span className="text-[#564E4E] text-[12px]">|</span>
                        <button className="text-[12px] text-[#007185] hover:underline">Save for later</button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-right font-bold text-[16px]">
                      {formatPrice(parseFloat(product.price) * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-right text-[16px] pt-4 border-t border-[#DDD] mt-4">
              Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items):{' '}
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="bg-white p-4 rounded-sm shadow-sm lg:sticky top-20">
            {items.some((i) => i.Product?.is_prime) && (
              <div className="flex items-center gap-1 text-[13px] text-[#007600] mb-3">
                <span className="text-[#007600]">✓</span>
                Your order qualifies for FREE Delivery.
              </div>
            )}
            <div className="text-[18px] mb-4">
              Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items):{' '}
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </div>
            <div className="text-[13px] text-gray-500 mb-1 flex justify-between">
              <span>Tax (18% GST):</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="text-[16px] font-bold flex justify-between border-t border-[#DDD] pt-2 mt-2">
              <span>Order Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 rounded-full text-[14px] transition"
            >
              Proceed to Buy ({items.reduce((a, i) => a + i.quantity, 0)} items)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
