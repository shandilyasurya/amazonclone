import { Link, useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(p || 0));

const STATUS_STYLES = {
  pending:    { label: 'Pending',    bg: '#FFF8E7', text: '#856404',  dot: '#F0A500' },
  processing: { label: 'Processing', bg: '#E8F0FE', text: '#1A73E8',  dot: '#1A73E8' },
  shipped:    { label: 'Shipped',    bg: '#E6F4EA', text: '#137333',  dot: '#34A853' },
  delivered:  { label: 'Delivered',  bg: '#E6F4EA', text: '#137333',  dot: '#34A853' },
  cancelled:  { label: 'Cancelled',  bg: '#FCE8E6', text: '#C5221F',  dot: '#EA4335' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-medium"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {s.label}
    </span>
  );
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetOrdersQuery();
  const orders = data?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-10 space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="border border-[#DDD] rounded-lg animate-pulse">
            <div className="bg-[#f7f8f8] px-5 py-3 h-12 rounded-t-lg" />
            <div className="p-5 h-24" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-16 text-center">
        <p className="text-[#B12704] text-[16px] font-medium">Failed to load orders.</p>
        <button onClick={() => navigate('/')} className="text-[#007185] hover:underline mt-2 text-[14px]">
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#EAEDED]"
      style={{ fontFamily: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif" }}
    >
      <div className="max-w-[900px] mx-auto px-4 py-6">

        {/* Page Header */}
        <div className="flex items-baseline justify-between mb-5">
          <h1 className="text-[28px] font-normal text-[#0F1111]">Your Orders</h1>
          <span className="text-[14px] text-[#565959]">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#DDD] p-16 text-center">
            <ShoppingBag size={60} className="mx-auto text-[#DDD] mb-4" strokeWidth={1} />
            <h2 className="text-[20px] font-medium text-[#0F1111] mb-2">You haven't placed any orders yet</h2>
            <p className="text-[14px] text-[#565959] mb-5">
              Once you place an order, it will appear here.
            </p>
            <Link
              to="/"
              className="inline-block bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-medium rounded-full px-8 py-2 text-[14px] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = order.items || [];
              const firstItem = items[0];
              const placedDate = new Date(order.placed_at || order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric',
              });

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg border border-[#DDD] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order header bar */}
                  <div className="bg-[#f7f8f8] border-b border-[#DDD] px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-6 text-[13px]">
                      <div>
                        <p className="text-[#565959] uppercase text-[10px] font-bold tracking-wider">ORDER PLACED</p>
                        <p className="text-[#0F1111] font-medium mt-0.5">{placedDate}</p>
                      </div>
                      <div>
                        <p className="text-[#565959] uppercase text-[10px] font-bold tracking-wider">TOTAL</p>
                        <p className="text-[#0F1111] font-medium mt-0.5">{formatPrice(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-[#565959] uppercase text-[10px] font-bold tracking-wider">SHIP TO</p>
                        <p className="text-[#007185] font-medium mt-0.5 hover:underline cursor-pointer">
                          {order.Address?.full_name || 'Address on file'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#565959] uppercase text-[10px] font-bold tracking-wider">ORDER # {order.id.slice(0, 8).toUpperCase()}</p>
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="inline-flex items-center gap-1 text-[#007185] hover:text-[#C7511F] hover:underline text-[12px] mt-0.5"
                      >
                        View order details <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>

                  {/* Order body */}
                  <div className="px-5 py-4 flex flex-col sm:flex-row items-start gap-4">
                    {/* Status */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={16} className="text-[#232F3E]" />
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-[13px] text-[#565959]">
                        {order.status === 'delivered'
                          ? 'Delivered'
                          : order.status === 'shipped'
                          ? 'On its way'
                          : 'Preparing your order'}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block w-px bg-[#DDD] self-stretch mx-2" />

                    {/* Items preview */}
                    <div className="flex-1 min-w-0">
                      <div className="space-y-3">
                        {items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-start gap-3">
                            <div className="text-[13px] flex-1 min-w-0">
                              <p className="text-[#0F1111] font-medium truncate leading-snug">
                                {item.Product?.name || 'Product'}
                              </p>
                              <p className="text-[#565959] text-[12px]">
                                Qty: {item.quantity} · {formatPrice(item.unit_price)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {items.length > 3 && (
                          <p className="text-[13px] text-[#007185] hover:underline cursor-pointer">
                            + {items.length - 3} more item{items.length - 3 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-40">
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="text-center border border-[#D5D9D9] rounded-lg bg-white hover:bg-[#f7f8f8] text-[#0F1111] text-[12px] font-medium py-1.5 px-3 transition-colors"
                      >
                        View order details
                      </Link>
                      {firstItem?.Product?.id && (
                        <Link
                          to={`/product/${firstItem.Product.id}`}
                          className="text-center border border-[#D5D9D9] rounded-lg bg-white hover:bg-[#f7f8f8] text-[#0F1111] text-[12px] font-medium py-1.5 px-3 transition-colors"
                        >
                          Buy it again
                        </Link>
                      )}
                      {order.status === 'delivered' && firstItem?.Product?.id && (
                        <Link
                          to={`/review/create-review/${firstItem.Product.id}`}
                          className="text-center border border-[#D5D9D9] rounded-lg bg-white hover:bg-[#f7f8f8] text-[#007185] text-[12px] font-medium py-1.5 px-3 transition-colors"
                        >
                          Write a review
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
