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
      // If payment was cancelled by user
      if (queryCode === 'PAYMENT_CANCELLED' || queryCode === 'CANCELLED') {
        setStatus('failed');
        setMessage('Payment was cancelled. Please try again.');
        return;
      }

      if (queryCode === 'COMPLETED' || queryCode === 'SUCCESS' || queryCode === 'PAYMENT_SUCCESS') {
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
