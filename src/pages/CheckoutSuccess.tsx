import React, { useEffect, useState, useRef } from 'react';
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
  const [emailStatus, setEmailStatus] = useState<'pending' | 'sending' | 'sent' | 'failed' | 'skipped'>('pending');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    async function verifyPayment() {
      if (hasRun.current) return;
      hasRun.current = true;

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

        try {
          // Attempt to load from localStorage first as primary data for now due to missing DB
          let dbOrderDetails: any = null;
          let emailToUse = '';
          const sessionStr = localStorage.getItem('checkoutSession');
          let session: any = null;
          if (sessionStr) {
             session = JSON.parse(sessionStr);
             dbOrderDetails = {
               orderId: orderId,
               cart: session.cart,
               total: session.total || 0,
               shippingData: session.shippingData,
               isFirstOrderEligible: session.isFirstOrderEligible
             };
             emailToUse = session.shippingData?.email;
          }

          try {
            const res = await fetch(`/api/orders/${orderId}`);
            if (res.ok) {
              const data = await res.json();
              const { order, items } = data;
              dbOrderDetails = {
                orderId: order.id,
                cart: items.map((i: any) => ({
                  id: i.product_id || i.id,
                  name: i.product_name,
                  price: i.price,
                  quantity: i.quantity
                })),
                total: order.final_amount,
                shippingData: order.shipping_address,
              };
              emailToUse = order.guest_email || order.shipping_address?.email;
            }
          } catch(err) {
             console.warn("DB order fetch failed, using local session data", err);
          }

          if (!dbOrderDetails) {
            throw new Error("No order details found in DB or local session");
          }
          
          setOrderDetails(dbOrderDetails);

          if (emailToUse && emailToUse !== 'youremail@example.com' && !emailToUse.includes('testcall')) {
            console.log("Initiating order confirmation to email: ", emailToUse);
            setEmailStatus('sending');
            fetch('/api/contact/order-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: emailToUse,
                orderDetails: dbOrderDetails
              })
            })
            .then(async (r) => {
              if (!r.ok) {
                console.error("Order confirmation failed:", await r.text());
                setEmailStatus('failed');
              } else {
                setEmailStatus('sent');
              }
            })
            .catch((err) => {
               console.error("Order confirmation API catch error:", err);
               setEmailStatus('failed');
            });
          } else {
             console.warn("No valid email found, skipping confirmation");
             setEmailStatus('skipped');
          }

          // Mark first discount used if previously tracked locally
          if (sessionStr && session) {
            if (session.isFirstOrderEligible && user) {
               supabase.auth.updateUser({ 
                 data: { has_used_first_discount: true } 
               });
            }
            // Removed localStorage.removeItem to prevent StrictMode bugs!
          }
        } catch (e) {
          console.error("Failed to sequence order success:", e);
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
            {emailStatus === 'sending' && <p className="text-sm text-blue-500">Sending confirmation email...</p>}
            {emailStatus === 'sent' && <p className="text-sm text-green-500">A confirmation email has been sent to {orderDetails?.shippingData?.email}</p>}
            {emailStatus === 'failed' && <p className="text-sm text-red-500">Failed to send confirmation email. Please check your order details below.</p>}
            {emailStatus === 'skipped' && <p className="text-sm text-gray-500">No email was provided, skipping confirmation email.</p>}
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
