import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

import { siteConfig } from '../config/site';

export function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!orderId) {
        setStatus('failed');
        setMessage('Invalid order ID.');
        return;
      }
      
      const queryCode = searchParams.get('code');
      // If payment was cancelled by user
      if (queryCode === 'PAYMENT_CANCELLED' || queryCode === 'CANCELLED') {
        setStatus('failed');
        setMessage('Payment was cancelled. Please try again.');
        return;
      }

      if (queryCode === 'COMPLETED' || queryCode === 'SUCCESS' || queryCode === 'PAYMENT_SUCCESS' || queryCode === 'UPI_MANUAL') {
        setStatus('success');
        clearCart();

        // Process the local mock DB update
        const sessionStr = sessionStorage.getItem('checkoutSession');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          setOrderDetails(session);
          const { shippingData, isFirstOrderEligible } = session;

          const email = shippingData?.email?.trim().toLowerCase();
          const phone = shippingData?.phone?.trim();

          const mockOrdersDB = JSON.parse(localStorage.getItem('bloom_db_orders') || '[]');
          mockOrdersDB.push({ 
            orderId, 
            email, 
            phone, 
            userId: user?.id || null,
            timestamp: new Date().toISOString() 
          });
          localStorage.setItem('bloom_db_orders', JSON.stringify(mockOrdersDB));

          if (email) {
            console.log("Found email in session, initiating order confirmation to: ", email);
            fetch('/api/contact/order-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                orderDetails: {
                  orderId,
                  cart: session.cart,
                  total: session.total || 0,
                  shippingData: session.shippingData,
                  isFirstOrderEligible: session.isFirstOrderEligible,
                }
              })
            })
            .then(async (res) => {
              const text = await res.text();
              console.log("Order confirmation API response:", res.status, text);
            })
            .catch((err) => console.error("Order confirmation API catch error:", err));
          } else {
            console.warn("No email found in shippingData, skipping order confirmation.");
          }

          if (isFirstOrderEligible && user) {
            supabase.auth.updateUser({ 
              data: { has_used_first_discount: true } 
            });
          }
          sessionStorage.removeItem('checkoutSession');
        }
      } else if (queryCode === 'FAILED' || queryCode === 'PAYMENT_ERROR') {
        setStatus('failed');
        setMessage('Payment failed. Please try again.');
      } else {
         setStatus('failed');
         setMessage('Payment could not be verified. Please contact support.');
      }
    }
    
    verifyPayment();
  }, [orderId, clearCart, user, searchParams]);

  return (
    <div className="container min-h-screen pt-32 pb-20 flex flex-col items-center justify-center space-y-8 px-4">
      {status === 'loading' ? (
        <div className="space-y-6 flex flex-col items-center">
            <Loader2 size={64} className="animate-spin text-bloom-rose" />
            <h1 className="font-serif text-3xl font-bold">{message}</h1>
        </div>
      ) : status === 'success' ? (
        <>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center p-6 shadow-xl shadow-green-100/50"
          >
            <CheckCircle2 size={64} />
          </motion.div>
          <div className="space-y-4 text-center">
            <h1 className="font-serif text-5xl font-bold">Order Confirmed!</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Thank you for shopping with The Bloom & Blossom. Your order (ID: {orderId}) has been placed successfully and we'll start preparing it soon.
            </p>
          </div>

          {orderDetails && (
             <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-3xl p-8 mt-8 shadow-sm text-left">
               <h3 className="font-bold text-xl mb-6 font-serif">Order Summary</h3>
               
               <div className="space-y-4 mb-8 border-b border-gray-100 pb-6">
                 {orderDetails.cart?.map((item: any) => (
                   <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                     <div className="flex flex-col">
                       <span className="font-medium text-gray-900">{item.name}</span>
                       <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                     </div>
                     <span className="font-bold text-bloom-rose">₹{item.price * item.quantity}</span>
                   </div>
                 ))}
               </div>
               
               <div className="pt-2">
                 <h4 className="font-bold mb-4 font-serif">Shipping Details</h4>
                 <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-6 rounded-2xl">
                   <p><span className="font-medium text-gray-900">Name:</span> {orderDetails.shippingData?.name}</p>
                   <p><span className="font-medium text-gray-900">Email:</span> {orderDetails.shippingData?.email}</p>
                   <p><span className="font-medium text-gray-900">Phone:</span> {orderDetails.shippingData?.phone}</p>
                   <p><span className="font-medium text-gray-900">Address:</span> {orderDetails.shippingData?.address}, {orderDetails.shippingData?.city}, {orderDetails.shippingData?.state} {orderDetails.shippingData?.pincode}</p>
                 </div>
               </div>
             </div>
          )}

          <div className="pt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="px-12 py-4 bg-bloom-rose text-white rounded-full font-bold shadow-xl shadow-bloom-rose/20 hover:scale-105 transition-all"
            >
              Continue Shopping
            </button>
            {user && (
              <button 
                 onClick={() => navigate('/dashboard')}
                 className="px-12 py-4 bg-white text-gray-900 border border-gray-100 rounded-full font-bold hover:bg-gray-50 transition-all"
              >
                View in Dashboard
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center p-6 shadow-xl shadow-red-100/50"
          >
            <XCircle size={64} />
          </motion.div>
          <div className="space-y-4">
            <h1 className="font-serif text-5xl font-bold">Payment Error</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              {message}
            </p>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate('/checkout')}
              className="px-12 py-4 bg-bloom-rose text-white rounded-full font-bold shadow-xl shadow-bloom-rose/20 hover:scale-105 transition-all"
            >
              Retry Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
