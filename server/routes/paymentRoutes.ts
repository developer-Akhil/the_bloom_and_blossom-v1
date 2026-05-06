import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { siteConfig } from '../../src/config/site.js';

const router = express.Router();

const getRazorpayClient = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys not configured');
  }
  return new Razorpay({ key_id, key_secret });
};

router.post('/create-order', async (req, res) => {
  try {
    const { amount, phone, name, email } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const amountInPaise = Math.round(amount * 100);
    if (amountInPaise < 100) {
      return res.status(400).json({ error: 'Amount must be at least ₹1 (100 paise)' });
    }

    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (e: any) {
      return res.status(401).json({ error: 'Gateway Not Configured', details: e.message });
    }

    const receipt = 'RECEIPT_' + Date.now() + Math.random().toString(36).substring(2, 7);
    
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receipt
    };

    const order = await razorpay.orders.create(options);
    
    return res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error: any) {
    console.error('Payment initiation error:', error);
    if (error.statusCode === 401 || error.statusCode === '401') {
      return res.status(401).json({ error: 'Gateway Authentication Failed', details: error?.error?.description || error?.message });
    }
    res.status(500).json({ error: 'Internal server error', details: error?.message || error?.toString() });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification details' });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error: any) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Internal server error', details: error?.message || String(error) });
  }
});

router.post('/refund', async (req, res) => {
   res.status(501).json({ error: 'Refund endpoint needs standard verification logic mapping' });
});

export default router;

