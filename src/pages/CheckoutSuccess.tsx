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

  useEffect(() => {
    async function verifyPayment() {
      if (!orderId) {
        setStatus('failed');
        setMessage('Invalid order ID.');
        return;
      }
      
      const queryCode = searchParams.get('code');
      // If payment was cancelled by user on Phonepe, do not treat as a backend error right away
      if (queryCode === 'PAYMENT_CANCELLED' || queryCode === 'CANCELLED') {
        setStatus('failed');
        setMessage('Payment was cancelled. Please try again.');
        return;
      }

      try {
        const res = await fetch(siteConfig.api.payment.status(orderId));
        if (!res.ok) {
           throw new Error('Failed to verify payment status');
        }
        
        const data = await res.json();
        const paymentState = data.state || data.data?.state || data.code || queryCode; // Support both flat and nested PhonePe responses

        if (paymentState === 'COMPLETED' || paymentState === 'SUCCESS' || paymentState === 'PAYMENT_SUCCESS') {
          setStatus('success');
          clearCart();

          // Process the local mock DB update
          const sessionStr = sessionStorage.getItem('checkoutSession');
          if (sessionStr) {
            const session = JSON.parse(sessionStr);
            const { shippingData, isFirstOrderEligible } = session;

            const email = shippingData?.email?.trim().toLowerCase();
            const phone = shippingData?.phone?.trim();

            const mockOrdersDB = JSON.parse(localStorage.getItem('bloom_db_orders') || '[]');
            mockOrdersDB.push({ orderId, email, phone, timestamp: new Date().toISOString() });
            localStorage.setItem('bloom_db_orders', JSON.stringify(mockOrdersDB));

            if (isFirstOrderEligible && user) {
              await supabase.auth.updateUser({ 
                data: { has_used_first_discount: true } 
              });
            }
            sessionStorage.removeItem('checkoutSession');
          }
        } else if (paymentState === 'FAILED' || paymentState === 'PAYMENT_ERROR') {
          setStatus('failed');
          setMessage('Payment failed. Please try again.');
        } else if (paymentState === 'PAYMENT_DECLINED' || paymentState === 'CANCELLED' || paymentState === 'PAYMENT_CANCELLED') {
          setStatus('failed');
          setMessage('Payment was cancelled. Please try again.');
        } else if (paymentState === 'PENDING') {
          setStatus('failed');
          setMessage('Payment is currently pending. Please check back later. Do not retry if the amount was deducted.');
        } else {
          setStatus('failed');
          setMessage(`Payment status is ${paymentState}. Please contact support if amount was deducted.`);
        }

      } catch (err) {
        console.error('Error verifying payment:', err);
        const fallbackCode = searchParams.get('code');
        if (fallbackCode === 'PAYMENT_ERROR' || fallbackCode === 'PAYMENT_DECLINED' || fallbackCode === 'PAYMENT_FAILED' || fallbackCode === 'FAILED') {
           setStatus('failed');
           setMessage('Payment failed. Please try again.');
        } else if (fallbackCode === 'PAYMENT_CANCELLED' || fallbackCode === 'CANCELLED') {
           setStatus('failed');
           setMessage('Payment was cancelled. Please try again.');
        } else {
           setStatus('failed');
           setMessage('Could not verify payment status. Please check your dashboard or contact support.');
        }
      }
    }
    
    verifyPayment();
  }, [orderId, clearCart, user]);

  return (
    <div className="container min-h-screen pt-32 pb-20 flex flex-col items-center justify-center space-y-8 text-center px-4">
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
          <div className="space-y-4">
            <h1 className="font-serif text-5xl font-bold">Order Confirmed!</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Thank you for shopping with The Bloom & Blossom. Your order (ID: {orderId}) has been placed successfully and we'll start preparing it soon.
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
