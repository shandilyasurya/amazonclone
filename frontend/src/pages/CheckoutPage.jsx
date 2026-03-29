import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetCartQuery } from '../slices/cartApiSlice';
import { useGetAddressesQuery, useAddAddressMutation } from '../slices/userApiSlice';
import { usePlaceOrderMutation } from '../slices/ordersApiSlice';
import { Lock } from 'lucide-react';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: cartData } = useGetCartQuery();
  const { data: addressData } = useGetAddressesQuery();
  const [placeOrder, { isLoading: placingOrder }] = usePlaceOrderMutation();
  const [addAddress, { isLoading: addingAddr }] = useAddAddressMutation();

  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
  const [error, setError] = useState('');

  const items = cartData?.data || [];
  const addresses = addressData?.data || [];
  const activeAddress = addresses.find((a) => a.id === selectedAddressId);

  const subtotal = items.reduce((acc, i) => acc + parseFloat(i.Product?.price || 0) * i.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  useEffect(() => {
    // Auto-select first address if none selected
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addAddress(addrForm).unwrap();
      if (res?.data?.id) setSelectedAddressId(res.data.id);
      setShowAddressForm(false);
      setAddrForm({ full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
    } catch (err) {
      setError(err?.data?.message || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) { setError('Please select a delivery address'); return; }
    setError('');
    try {
      const res = await placeOrder({ addressId: selectedAddressId, paymentMethod }).unwrap();
      navigate(`/order-confirmation/${res.data?.id || ''}`);
    } catch (err) {
      setError(err?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {placingOrder && (
        <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-[#FF9900] border-b-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-medium text-gray-800">Processing your order...</h2>
          <p className="text-sm text-gray-500 mt-2">Please do not refresh the page.</p>
        </div>
      )}

      <div className={`bg-white min-h-screen text-[#0F1111] font-sans pb-20 ${placingOrder ? 'pointer-events-none' : ''}`}>
        {/* ── HEADER (Authentic Secure Checkout header) ── */}
        <header className="bg-gradient-to-b from-[#f3f3f3] to-white border-b border-[#DDD] flex items-center justify-between px-4 sm:px-[10%] py-4">
        <div className="flex-1">
          <Link to="/cart">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
              alt="Amazon" 
              className="w-24 mt-1 object-contain mix-blend-multiply" 
            />
          </Link>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-[28px] font-normal hidden sm:block">Checkout (<span className="text-[#007185]">{items.length} item{items.length !== 1 && 's'}</span>)</h1>
        </div>
        <div className="flex-1 flex justify-end">
          <Lock size={24} className="text-[#999]" strokeWidth={1.5} />
        </div>
      </header>
      
      {/* ── MAIN CONTENT ── */}
      <main className="max-w-[1000px] mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column (Accordion Steps) */}
        <div className="md:col-span-8 flex flex-col gap-4">
          
          {/* STEP 1: Address */}
          <div className={`rounded-lg overflow-hidden ${step === 1 ? 'border border-[#D5D9D9] shadow-sm' : ''}`}>
            {step === 1 ? (
              // Active State
              <div className="p-5">
                <h2 className="text-[18px] font-bold text-[#c45500] mb-4">1 &nbsp; Select a delivery address</h2>
                {error && <div className="text-red-700 font-medium text-[13px] mb-3">{error}</div>}
                
                {addresses.length > 0 && !showAddressForm && (
                  <div className="space-y-3 pl-6 mb-5">
                    <h3 className="font-bold text-[14px]">Your addresses</h3>
                    <div className="border border-[#D5D9D9] rounded bg-[#f3f3f3] p-1 divide-y divide-[#D5D9D9]">
                      {addresses.map((addr) => (
                        <label key={addr.id} className="flex items-start gap-3 p-3 bg-white cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1 accent-[#e77600]"
                          />
                          <div className="text-[13px] flex-1">
                            <span className="font-bold">{addr.full_name}</span> {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state}, {addr.pincode}
                            <div className="text-[#007185] mt-1 hover:underline text-[12px]">Edit address</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pl-6">
                  {showAddressForm ? (
                    <form onSubmit={handleAddressSubmit} className="border border-[#D5D9D9] rounded p-4 bg-gray-50 space-y-3">
                      <h3 className="font-bold text-[14px] border-b border-[#D5D9D9] pb-2">Add a new address</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-1">
                          <label className="text-[13px] font-medium block">Full name</label>
                          <input type="text" required value={addrForm.full_name} onChange={(e) => setAddrForm(f => ({ ...f, full_name: e.target.value }))} className="w-full border border-[#a6a6a6] rounded px-2 py-1 mt-1 text-[13px] focus:ring-1 focus:ring-[#e77600] outline-none" />
                        </div>
                        <div className="col-span-1">
                          <label className="text-[13px] font-medium block">Mobile number</label>
                          <input type="text" required value={addrForm.phone} onChange={(e) => setAddrForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-[#a6a6a6] rounded px-2 py-1 mt-1 text-[13px] focus:ring-1 focus:ring-[#e77600] outline-none" />
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <label className="text-[13px] font-medium block">Flat, House no., Building</label>
                          <input type="text" required value={addrForm.line1} onChange={(e) => setAddrForm(f => ({ ...f, line1: e.target.value }))} className="w-full border border-[#a6a6a6] rounded px-2 py-1 mt-1 text-[13px] focus:ring-1 focus:ring-[#e77600] outline-none" />
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                          <label className="text-[13px] font-medium block">Area, Colony, Sector (optional)</label>
                          <input type="text" value={addrForm.line2} onChange={(e) => setAddrForm(f => ({ ...f, line2: e.target.value }))} className="w-full border border-[#a6a6a6] rounded px-2 py-1 mt-1 text-[13px] focus:ring-1 focus:ring-[#e77600] outline-none" />
                        </div>
                        <div className="col-span-1 sm:col-span-2 flex gap-4">
                          <div className="flex-1">
                            <label className="text-[13px] font-medium block">Town/City</label>
                            <input type="text" required value={addrForm.city} onChange={(e) => setAddrForm(f => ({ ...f, city: e.target.value }))} className="w-full border border-[#a6a6a6] rounded px-2 py-1 mt-1 text-[13px]" />
                          </div>
                          <div className="w-24 border-[#a6a6a6]">
                            <label className="text-[13px] font-medium block">Pincode</label>
                            <input type="text" required value={addrForm.pincode} onChange={(e) => setAddrForm(f => ({ ...f, pincode: e.target.value }))} className="w-full border border-[#a6a6a6] rounded px-2 py-1 mt-1 text-[13px]" />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={addingAddr} className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-4 py-1.5 text-[13px] font-medium">
                          {addingAddr ? 'Saving...' : 'Use this address'}
                        </button>
                        {addresses.length > 0 && <button type="button" onClick={() => setShowAddressForm(false)} className="text-[13px] text-[#007185] hover:underline px-2">Cancel</button>}
                      </div>
                    </form>
                  ) : (
                    <div className="border-t border-[#D5D9D9] pt-3">
                      <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 text-[#007185] hover:text-[#C7511F] hover:underline text-[13px] font-bold">
                        <span className="text-xl leading-none">+</span> Add a new address
                      </button>
                    </div>
                  )}
                  
                  {!showAddressForm && addresses.length > 0 && (
                    <div className="mt-5 bg-[#f3f3f3] p-3 -mx-5 -mb-5 border-t border-[#D5D9D9]">
                      <button onClick={() => setStep(2)} className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-4 py-1.5 text-[13px] font-medium shadow-sm">
                        Use this address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Inactive State
              <div className="px-5 py-3 border-b border-[#D5D9D9]">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <span className="font-bold text-[16px]">1</span>
                    <div>
                      <h2 className={`font-bold text-[16px] ${step > 1 ? 'text-[#0F1111]' : 'text-gray-500'}`}>Delivery address</h2>
                      {step > 1 && activeAddress && (
                        <div className="text-[13px] mt-0.5 text-[#0F1111]">
                          <p>{activeAddress.full_name}</p>
                          <p>{activeAddress.line1}{activeAddress.line2 ? `, ${activeAddress.line2}` : ''}</p>
                          <p>{activeAddress.city}, {activeAddress.state} {activeAddress.pincode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {step > 1 && (
                    <button onClick={() => setStep(1)} className="text-[13px] text-[#007185] hover:underline font-medium">Change</button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Payment */}
          <div className={`rounded-lg overflow-hidden ${step === 2 ? 'border border-[#D5D9D9] shadow-sm mt-2' : ''}`}>
            {step === 2 ? (
              <div className="p-5">
                <h2 className="text-[18px] font-bold text-[#c45500] mb-4">2 &nbsp; Select a payment method</h2>
                <div className="pl-6">
                  <div className="border border-[#D5D9D9] rounded bg-[#f3f3f3] p-1 divide-y divide-[#D5D9D9]">
                    <label className="flex items-start gap-3 p-3 bg-white cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mt-1 accent-[#e77600]" />
                      <div className="text-[13px] flex-1">
                        <span className="font-bold block">Cash on Delivery/Pay on Delivery</span>
                        <span className="text-gray-600 block mt-0.5">Scan & Pay using Amazon Pay UPI or pay cash at the time of delivery.</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#e77600]" />
                      <div className="text-[13px] flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-bold">Credit or Debit Card</span>
                        <div className="flex gap-1">
                          <div className="bg-[#111] text-white text-[10px] font-bold px-1 rounded inline-block w-8 text-center italic">VISA</div>
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="accent-[#e77600]" />
                      <div className="text-[13px] flex-1 font-bold">Other UPI Apps</div>
                    </label>
                  </div>
                  
                  <div className="mt-5 bg-[#f3f3f3] p-3 -mx-5 -mb-5 border-t border-[#D5D9D9] flex gap-3">
                    <button onClick={() => setStep(3)} className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-4 py-1.5 text-[13px] font-medium shadow-sm">
                      Use this payment method
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`px-5 py-3 ${step < 2 ? 'opacity-50 pointer-events-none' : 'border-b border-[#D5D9D9]'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <span className="font-bold text-[16px]">2</span>
                    <div>
                      <h2 className="font-bold text-[16px]">Payment method</h2>
                      {step > 2 && (
                        <div className="text-[13px] mt-0.5 text-[#0F1111] capitalize">
                          {paymentMethod === 'cod' ? 'Pay on Delivery (Cash/UPI)' : paymentMethod === 'card' ? 'Credit / Debit Card' : 'UPI'}
                        </div>
                      )}
                    </div>
                  </div>
                  {step > 2 && (
                    <button onClick={() => setStep(2)} className="text-[13px] text-[#007185] hover:underline font-medium">Change</button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Review */}
          <div className={`rounded-lg overflow-hidden ${step === 3 ? 'border border-[#D5D9D9] shadow-sm mt-2' : ''}`}>
             {step === 3 ? (
               <div className="p-5">
                 <h2 className="text-[18px] font-bold text-[#c45500] mb-4">3 &nbsp; Review items and delivery</h2>
                 
                 <div className="border border-[#D5D9D9] rounded p-4 mb-4 shadow-sm">
                   <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[14px] font-bold text-[#007600] mb-1">Guaranteed Delivery: Tomorrow</h4>
                        <span className="text-[12px] text-gray-600 block mb-3">Items shipped from Amazon</span>
                      </div>
                   </div>

                   {/* Item List */}
                   <div className="space-y-4">
                     {items.map((item) => (
                       <div key={item.id} className="flex gap-4">
                         <img src={item.Product?.images?.[0]?.image_url || 'https://via.placeholder.com/80'} alt="" className="w-16 h-16 object-contain mix-blend-multiply flex-shrink-0" />
                         <div>
                           <div className="text-[14px] font-bold text-[#0F1111] mb-1 leading-snug">{item.Product?.name}</div>
                           <div className="text-[13px] font-bold text-[#B12704]">{formatPrice(parseFloat(item.Product?.price || 0))}</div>
                           <div className="text-[12px] text-[#007185]">Qty: <span className="text-[#0F1111] font-medium">{item.quantity}</span></div>
                           {item.Product?.is_prime && (
                              <div className="text-[11px] bg-[#0574F7] text-white font-bold px-1.5 py-0.5 rounded-sm w-fit mt-1">prime</div>
                            )}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {error && <div className="text-red-700 font-medium text-[13px] mt-2 mb-2 p-3 bg-red-50 border border-[#D5D9D9] rounded">{error}</div>}

                 <div className="bg-[#f3f3f3] p-4 -mx-5 -mb-5 border-t border-[#D5D9D9] flex flex-col sm:flex-row items-center justify-between">
                    <button onClick={handlePlaceOrder} disabled={placingOrder} className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-6 py-2 text-[14px] font-medium shadow-sm w-full sm:w-auto mb-2 sm:mb-0 disabled:opacity-50">
                      {placingOrder ? 'Placing Order...' : 'Place your order'}
                    </button>
                    <div className="text-center sm:text-right">
                       <span className="text-[#B12704] font-bold text-[18px]">Order Total: {formatPrice(total)}</span>
                       <br />
                       <span className="text-[11px] text-gray-500">By placing your order, you agree to Amazon's privacy notice.</span>
                    </div>
                 </div>

               </div>
             ) : (
                <div className={`px-5 py-3 ${step < 3 ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex gap-4 items-start">
                    <span className="font-bold text-[16px]">3</span>
                    <h2 className="font-bold text-[16px]">Items and delivery</h2>
                  </div>
                </div>
             )}
          </div>
          
        </div>

        {/* Right Column (Order Summary Panel) */}
        <div className="md:col-span-4">
          <div className="border border-[#D5D9D9] rounded-lg p-5 sticky top-6 bg-white shadow-sm">
            <button 
              onClick={step === 3 ? handlePlaceOrder : () => {
                if(step === 1) { if(selectedAddressId) setStep(2); else setError("Select address"); }
                if(step === 2) setStep(3);
              }}
              disabled={placingOrder || items.length === 0}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-full py-2 text-[13px] font-medium shadow-sm disabled:opacity-50 mt-1 mb-3"
            >
              {placingOrder ? 'Processing...' : step === 3 ? 'Place your order' : step === 2 ? 'Use this payment method' : 'Use this address'}
            </button>
            
            <p className="text-[11px] text-gray-600 text-center mb-4 leading-tight border-b border-[#D5D9D9] pb-4">
              By placing your order, you agree to Amazon's privacy notice and conditions of use.
            </p>

            <h3 className="font-bold text-[16px] mb-2">Order Summary</h3>
            <div className="text-[13px] space-y-1.5 text-[#0F1111] pb-3 border-b border-[#D5D9D9]">
              <div className="flex justify-between"><span>Items:</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery:</span><span>₹0</span></div>
              <div className="flex justify-between"><span>Total:</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Promotion Applied:</span><span>-₹0</span></div>
            </div>
            
            <div className="pt-3 pb-3 border-b border-[#D5D9D9]">
              <div className="flex justify-between items-center text-[#B12704] font-bold text-[20px]">
                <span className="text-[18px] text-[#0f1111]">Order Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="pt-3">
              <span className="text-[#007185] hover:underline text-[12px] cursor-pointer">How are shipping costs calculated?</span>
            </div>
          </div>
        </div>

      </main>
      
      {/* ── FOOTER (Secure Checkout Footer) ── */}
      <footer className="mt-16 border-t border-[#DDD] pt-8 pb-4 text-center text-[#007185] text-[11px] bg-gradient-to-t from-[#f3f3f3] to-white flex flex-col items-center">
         <div className="flex gap-4 mb-2">
            <span className="hover:underline cursor-pointer">Conditions of Use</span>
            <span className="hover:underline cursor-pointer">Privacy Notice</span>
            <span className="hover:underline cursor-pointer">Help</span>
         </div>
         <p className="text-[#555]">© 1996-2026, Amazon.com, Inc. or its affiliates</p>
      </footer>
    </div>
    </div>
  );
};

export default CheckoutPage;
