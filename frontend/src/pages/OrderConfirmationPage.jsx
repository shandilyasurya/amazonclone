import { Link, useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../slices/ordersApiSlice';
import { CheckCircle, Copy } from 'lucide-react';
import { useState } from 'react';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(p || 0));

const formatDate = (dateStr) =>
  new Date(new Date(dateStr).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderByIdQuery(id, { skip: !id });
  const [copied, setCopied] = useState(false);

  const order = data?.data;

  const handleCopy = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9900]"></div></div>;
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen py-8">
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-pop { animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-fade-up { opacity: 0; animation: fade-in-up 0.5s ease-out forwards; }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
      `}</style>

      <div className="max-w-[800px] mx-auto px-4">
        <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-[#DDD]">
          
          {/* Success header */}
          <div className="flex flex-col items-center text-center mb-8 pb-6 border-b border-[#DDD]">
            <div className="animate-pop opacity-0">
              <CheckCircle size={72} strokeWidth={1.5} className="text-[#007600] mb-4" />
            </div>
            <h1 className="text-[24px] font-bold text-[#007600] mb-1 animate-fade-up">Order placed, thank you!</h1>
            <p className="text-gray-600 text-[14px] animate-fade-up delay-1">Confirmation will be sent to your email address.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Order Details Column */}
            <div className="animate-fade-up delay-1">
              <h3 className="font-bold text-[14px] mb-3 uppercase tracking-wide text-gray-500">Order Details</h3>
              <div className="bg-[#F7FAFE] border border-[#D5D9D9] rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-gray-500 font-medium">Order Number</span>
                  <button onClick={handleCopy} className="text-[11px] text-[#007185] hover:underline flex items-center gap-1">
                    <Copy size={11} /> {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="font-mono text-[13px] font-bold break-all mb-4">{id || 'N/A'}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-[#B12704]">{order ? formatPrice(order.total) : '---'}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium capitalize">{order?.status || 'Pending'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Progress Column */}
            <div className="animate-fade-up delay-2">
              <h3 className="font-bold text-[14px] mb-3 uppercase tracking-wide text-gray-500">Shipping Status</h3>
              <div className="bg-white border border-[#D5D9D9] rounded p-4 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#007600] animate-pulse"></div>
                  <span className="text-[13px] font-bold text-[#007600]">Arriving Tomorrow</span>
                </div>
                
                {/* Status Bar */}
                <div className="relative mt-6 mb-8">
                  <div className="h-1 bg-gray-200 rounded absolute w-full top-1/2 -translate-y-1/2"></div>
                  <div className="h-1 bg-[#007600] rounded absolute w-[15%] top-1/2 -translate-y-1/2 transition-all duration-1000"></div>
                  <div className="flex justify-between relative">
                    <div className="w-3 h-3 rounded-full bg-[#007600] border-2 border-white ring-1 ring-[#007600]"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-200 border-2 border-white ring-1 ring-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-200 border-2 border-white ring-1 ring-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-200 border-2 border-white ring-1 ring-gray-300"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-medium">
                    <span>Ordered</span>
                    <span>Shipped</span>
                    <span>Out for delivery</span>
                    <span>Arriving</span>
                  </div>
                </div>

                {order?.placed_at && (
                  <p className="text-[12px] text-gray-600 bg-[#EAF7EA] px-3 py-2 rounded border border-[#B3DEB3]">
                    Estimated Delivery: <strong>{formatDate(order.placed_at)}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="animate-fade-up delay-3">
             <h3 className="font-bold text-[14px] mb-3 uppercase tracking-wide text-gray-500">Order Items</h3>
             <div className="border border-[#DDD] rounded divide-y divide-[#EEE] overflow-hidden">
                {order?.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <img 
                      src={item.Product?.images?.[0]?.image_url || 'https://via.placeholder.com/80'} 
                      className="w-12 h-12 object-contain mix-blend-multiply flex-shrink-0"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#007185] hover:underline cursor-pointer truncate">{item.Product?.name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[14px]">{formatPrice(item.unit_price)}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-up delay-3">
            <Link
              to="/"
              className="flex-1 text-center bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-3 rounded-full text-[14px] shadow-sm transition-all hover:scale-[1.01]"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="flex-1 text-center bg-white hover:bg-gray-50 border border-[#D5D9D9] text-[#0F1111] font-medium py-3 rounded-full text-[14px] shadow-sm transition-all hover:scale-[1.01]"
            >
              Track your order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
