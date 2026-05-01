import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProductContext } from '../context/ProductContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, QrCode, CheckCircle2, Loader2, CreditCard, Copy, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OptimizedImage } from '../components/common/OptimizedImage';
import { supabase } from '../lib/supabase';
import { siteConfig } from '../config/site';
import QRCode from 'react-qr-code';

export function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { products } = useProductContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const hasOutofStockItems = useMemo(() => {
    return cart.some(cartItem => {
       const p = products.find(prod => prod.id === cartItem.id);
       return p && p.inStock === false;
    });
  }, [cart, products]);

  if (hasOutofStockItems) {
    return <Navigate to="/cart" replace />;
  }
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'upi_qr'>('phonepe');
  const [shippingData, setShippingData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  const [isExistingCustomer, setIsExistingCustomer] = useState(false);

  useEffect(() => {
    const validateCustomer = async () => {
      const email = shippingData.email.trim().toLowerCase();
      const phone = shippingData.phone.trim();
      
      if (!email && !phone) {
        setIsExistingCustomer(false);
        return;
      }

      // Check user object if authenticated matches inputs
      if (user && (user.email === email || user.phone === phone) && user.user_metadata?.has_used_first_discount) {
        setIsExistingCustomer(true);
        return;
      }

      // Check DB via local storage mockup proxy (robust for prototype without direct DB backend code)
      const mockOrdersDB = JSON.parse(localStorage.getItem('bloom_db_orders') || '[]');
      const hasOrdered = mockOrdersDB.some((o: any) => 
        (email && o.email === email) || (phone && o.phone === phone)
      );

      if (hasOrdered) {
        setIsExistingCustomer(true);
        return;
      }

      // We could add an actual supabase fetch here if an actual orders table was structured
      // await supabase.from('orders').select('id').or(`email.eq.${email},phone.eq.${phone}`).limit(1)

      setIsExistingCustomer(false);
    };

    // Debounce to avoid validating on every keystroke
    const timer = setTimeout(validateCustomer, 500);
    return () => clearTimeout(timer);
  }, [shippingData.email, shippingData.phone, user]);

  const isFirstOrderEligible = !isExistingCustomer && cartTotal >= 500 && (shippingData.email !== '' || shippingData.phone !== '');
  const discountAmount = isFirstOrderEligible ? cartTotal * 0.05 : 0;
  const shippingCost = cartTotal > 2000 ? 0 : 80;
  const finalTotal = cartTotal - discountAmount + shippingCost;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const initiatePayment = async () => {
    setIsProcessing(true);
    try {
      const email = shippingData.email.trim().toLowerCase();
      const phone = shippingData.phone.trim();
      
      const payload = {
        amount: finalTotal,
        email: email,
        phone: phone,
        name: shippingData.name
      };

      const res = await fetch('/api/payment/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        let errText = 'Failed to initiate payment';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errJson = await res.json();
            errText = errJson.details || errJson.error || errText;
          } else {
            errText = await res.text();
          }
        } catch(e) {}
        throw new Error(errText);
      }
      
      const responseText = await res.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON, received this instead:', responseText.substring(0, 500));
        throw new Error('Received invalid JSON from server: ' + responseText.substring(0, 100));
      }
      
      // Store checkout context locally to retrieve after callback
      sessionStorage.setItem('currentOrderId', data.merchantOrderId || data.orderId);
      sessionStorage.setItem('checkoutSession', JSON.stringify({
        shippingData,
        cart,
        isFirstOrderEligible
      }));
      
      if (data.redirectUrl) {
        setPaymentUrl(data.redirectUrl);
        window.open(data.redirectUrl, '_blank');
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (e) {
      console.error('Payment initiation error', e);
      setIsProcessing(false);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  // Poll for payment status if paymentUrl is set
  useEffect(() => {
    if (!paymentUrl) return;
    
    const currentOrderId = sessionStorage.getItem('currentOrderId');
    if (!currentOrderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status/${currentOrderId}`);
        if (res.status === 400) {
           clearInterval(interval);
           sessionStorage.removeItem('currentOrderId');
           window.location.href = `/cart`;
           return;
        }
        if (res.ok) {
          const data = await res.json();
          const paymentState = data.state || data.data?.state || data.code;
          if (paymentState === 'COMPLETED' || paymentState === 'SUCCESS' || paymentState === 'PAYMENT_SUCCESS') {
            clearInterval(interval);
            // Verify payment and redirect to success
            window.location.href = `/checkout/success?orderId=${currentOrderId}&code=${paymentState}`;
          } else if (paymentState === 'FAILED' || paymentState === 'PAYMENT_ERROR' || paymentState === 'PAYMENT_DECLINED' || paymentState === 'CANCELLED' || paymentState === 'PAYMENT_CANCELLED') {
             clearInterval(interval);
             window.location.href = `/checkout/success?orderId=${currentOrderId}&code=${paymentState}`;
          }
        }
      } catch (err) {
        // ignore polling errors
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [paymentUrl]);

  if (step === 'success') {
    return (
      <div className="container py-32 flex flex-col items-center justify-center space-y-8 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center p-6 shadow-xl shadow-green-100/50"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        <div className="space-y-4">
          <h1 className="font-serif text-5xl font-bold">Order Confirmed!</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Thank you for shopping with The Bloom & Blossom. Your order has been placed successfully and we'll start preparing it soon.
          </p>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="px-12 py-4 bg-bloom-rose text-white rounded-full font-bold shadow-xl shadow-bloom-rose/20 hover:scale-105 transition-all"
          >
            Back to Home
          </button>
          <button 
             onClick={() => navigate('/dashboard')}
             className="px-12 py-4 bg-white text-gray-900 border border-gray-100 rounded-full font-bold hover:bg-gray-50 transition-all"
          >
            View Order Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <button 
          onClick={() => step === 'payment' ? setStep('details') : navigate('/cart')}
          className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-bloom-rose transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          {step === 'payment' ? 'Back to Details' : 'Back to Cart'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Form Side */}
          <div className="space-y-12">
            <h1 className="font-serif text-4xl font-bold">
              {step === 'details' ? 'Shipping Details' : 'Payment Integration'}
            </h1>

            {step === 'details' ? (
              <form onSubmit={handleDetailsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Full Name" value={shippingData.name} required onChange={v => setShippingData({...shippingData, name: v})} />
                  <Input label="Email Address" type="email" value={shippingData.email} required onChange={v => setShippingData({...shippingData, email: v})} />
                </div>
                <Input label="Phone Number" value={shippingData.phone} required onChange={v => setShippingData({...shippingData, phone: v})} />
                <Input label="Apartment, Street Address" value={shippingData.address} required onChange={v => setShippingData({...shippingData, address: v})} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="City" value={shippingData.city} required onChange={v => setShippingData({...shippingData, city: v})} />
                  <Input label="Zip Code" value={shippingData.zip} required onChange={v => setShippingData({...shippingData, zip: v})} />
                </div>
                <button 
                  type="submit"
                  className="w-full h-16 bg-bloom-rose text-white rounded-full font-bold text-lg hover:bg-bloom-rose/90 transition-all shadow-xl shadow-bloom-rose/20"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="flex bg-gray-50 p-1.5 rounded-2xl w-full mb-8">
                  <button
                    onClick={() => setPaymentMethod('phonepe')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${paymentMethod === 'phonepe' ? 'bg-white shadow-sm text-bloom-rose' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <CreditCard size={18} />
                    <span>PhonePe Gateway</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi_qr')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${paymentMethod === 'upi_qr' ? 'bg-white shadow-sm text-bloom-rose' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <QrCode size={18} />
                    <span>Direct UPI QR</span>
                  </button>
                </div>

                {paymentMethod === 'phonepe' ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-8 bg-pink-50 rounded-[2.5rem] border-2 border-dashed border-bloom-rose/30 flex flex-col items-center text-center space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg">Pay securely using PhonePe</h3>
                        <p className="text-sm text-gray-500">You will be redirected to the PhonePe payment gateway to complete your transaction.</p>
                        <p className="text-xs text-bloom-rose/80 font-medium pt-2">Note: During test mode, PhonePe simulates the payment page instead of showing a real QR code.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Payment Steps</h4>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-bloom-rose text-white flex items-center justify-center text-[10px] font-bold">1</div>
                          <span>Click 'Proceed to PhonePe' below.</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-bloom-rose text-white flex items-center justify-center text-[10px] font-bold">2</div>
                          <span>Complete the payment of ₹{finalTotal} on the secure payment gateway.</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-bloom-rose text-white flex items-center justify-center text-[10px] font-bold">3</div>
                          <span>You will be redirected back here upon completion to view your order.</span>
                        </li>
                      </ul>
                    </div>

                    {paymentUrl ? (
                      <div className="space-y-4">
                        <a 
                          href={paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-16 bg-[#5e2c9d] text-white rounded-full font-bold text-lg hover:bg-purple-800 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-purple-600/20"
                        >
                          <img src="https://phonepe.com/webapp-assets/images/logo.svg" className="h-6 w-auto mr-2 filter brightness-0 invert" alt="PhonePe" />
                          <span>Proceed to PhonePe</span>
                        </a>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="w-4 h-4 rounded-full border-2 border-bloom-rose border-t-transparent animate-spin"></div>
                          <span>Waiting for payment confirmation... Do not close this tab.</span>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={initiatePayment}
                        disabled={isProcessing}
                        className="w-full h-16 bg-bloom-rose text-white rounded-full font-bold text-lg hover:bg-bloom-rose/90 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-bloom-rose/20 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={24} className="animate-spin" />
                            <span>Redirecting to PhonePe...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard size={24} />
                            <span>Proceed to PhonePe</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-200 flex flex-col items-center text-center space-y-6">
                      <div className="space-y-2 mb-4">
                        <h3 className="font-bold text-lg">Scan to Pay via UPI</h3>
                        <p className="text-sm text-gray-500">Scan this code using Google Pay, PhonePe, Paytm, or any UPI app.</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-2">
                        <QRCode
                          value={`upi://pay?pa=8076323737@ybl&pn=${siteConfig.name}&am=${finalTotal}&cu=INR`}
                          size={180}
                          level="M"
                        />
                      </div>
                      
                      <div className="text-center w-full">
                        <p className="text-sm text-gray-500 font-medium mb-1">Amount to pay</p>
                        <p className="text-3xl font-mono font-bold text-bloom-rose">₹{finalTotal.toFixed(2)}</p>
                      </div>

                      <div className="w-full h-px bg-gray-200 my-2"></div>

                      <div className="space-y-4 w-full text-left">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Next Steps</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                          <li className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-bloom-rose text-white flex items-center justify-center text-[10px] font-bold">1</div>
                            <span>Scan the QR code and complete the payment of ₹{finalTotal}.</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-bloom-rose text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                            <span>Take a screenshot of the successful payment.</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0"><Smartphone size={12}/></div>
                            <span>Click the button below to share the screenshot on WhatsApp to confirm your order.</span>
                          </li>
                        </ul>
                      </div>
                      
                      <a 
                        href={`https://wa.me/918076323737?text=${encodeURIComponent(`Hello, I've made the payment of Rs ${finalTotal} for my order using Manual UPI. I am sharing the payment screenshot below.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-16 bg-[#25D366] text-white rounded-full font-bold text-lg hover:bg-[#128C7E] transition-all flex items-center justify-center space-x-3 shadow-xl shadow-green-600/20"
                      >
                        <span>Confirm via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Summary Side */}
          <div className="bg-gray-50 rounded-[3rem] p-10 h-fit space-y-8 border border-white">
            <h3 className="font-serif text-2xl font-bold">Your Order</h3>
            <div className="space-y-6 max-h-[400px] overflow-auto pr-2">
              {cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0">
                    <OptimizedImage src={item.images[0].includes('unsplash.com') ? `${item.images[0]}&w=200` : item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.customizationName && (
                        <span className="text-[9px] text-bloom-rose bg-bloom-pink/50 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
                          {item.customizationName}
                        </span>
                      )}
                      {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, value]) => (
                        <span key={key} className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-sm text-bloom-rose">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>
            
            <div className="h-px bg-gray-200" />
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-bloom-rose font-medium">
                  <span>First Order Discount (5%)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {cartTotal > 0 && cartTotal < 500 && !isExistingCustomer && (
                <div className="text-xs text-gray-400 bg-gray-100 p-2 rounded-lg">
                  Add ₹{500 - cartTotal} more to unlock 5% off your first order!
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                   {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4">
                <span>Total</span>
                <span className="text-bloom-rose font-mono text-2xl">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center space-x-3">
               <ShieldCheck size={20} className="text-bloom-rose" />
               <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-relaxed">
                  Your data is protected. All transactions are encrypted and secure.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, type="text", required=false, onChange }: { label: string, value: string, type?: string, required?: boolean, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">{label}</label>
      <input 
        type={type} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-bloom-rose/20 focus:border-bloom-rose transition-all"
      />
    </div>
  );
}
