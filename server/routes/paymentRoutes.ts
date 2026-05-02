import express from 'express';
import crypto from 'crypto';
import { siteConfig } from '../../src/config/site.js';

const router = express.Router();

let envClientId = process.env.PHONEPE_MERCHANT_ID || process.env.PHONEPE_CLIENT_ID;
let envClientSecret = process.env.PHONEPE_CLIENT_SECRET || process.env.PHONEPE_SALT_KEY;

if (envClientId && envClientSecret && envClientId.includes('-') && envClientSecret.startsWith('SU')) {
  const temp = envClientId;
  envClientId = envClientSecret;
  envClientSecret = temp;
}

const MERCHANT_ID = envClientId;
const SALT_KEY = envClientSecret;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || process.env.PHONEPE_SALT_VERSION || process.env.PHONEPE_CLIENT_VERSION || '1';

const normalizedEnv = (process.env.PHONEPE_ENV || 'SANDBOX').toUpperCase();
const PHONEPE_ENV = normalizedEnv === 'PRODUCTION' || normalizedEnv === 'PROD' ? 'PROD' : 'SANDBOX';

const PHONEPE_HOST = PHONEPE_ENV === 'PROD' 
  ? siteConfig.api.phonepe.prodUrl 
  : siteConfig.api.phonepe.sandboxUrl;

router.post('/pay', async (req, res) => {
  try {
    const { amount, phone, name, email } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    if (!MERCHANT_ID) {
       return res.status(400).json({ 
         error: 'Gateway Not Configured', 
         details: 'PhonePe Merchant ID is missing. Please set PHONEPE_MERCHANT_ID in Settings -> Secrets.' 
       });
    }

    if (!SALT_KEY) {
       return res.status(400).json({ 
         error: 'Gateway Not Configured', 
         details: 'PhonePe Salt Key is missing. Please set PHONEPE_CLIENT_SECRET or PHONEPE_SALT_KEY in Settings -> Secrets.' 
       });
    }

    const merchantTransactionId = 'TX' + Date.now() + Math.random().toString(36).substring(2, 7);
    const merchantUserId = 'MUID' + Date.now();
    
    let appBaseUrl = process.env.APP_URL || process.env.FRONTEND_URL;
    if (!appBaseUrl) {
      if (req.headers.origin) {
        appBaseUrl = req.headers.origin;
      } else if (req.headers.referer) {
        appBaseUrl = new URL(req.headers.referer).origin;
      } else {
        const proto = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('host');
        appBaseUrl = `${proto}://${host}`;
      }
    }
    const redirectUrl = `${appBaseUrl}/api/payment/callback?orderId=${merchantTransactionId}`;

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: merchantUserId,
      amount: Math.round(amount * 100),
      redirectUrl: redirectUrl,
      redirectMode: "POST",
      callbackUrl: `${appBaseUrl}/api/payment/webhook`,
      mobileNumber: phone || '9999999999',
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString).toString("base64");

    const endpoint = "/pg/v1/pay";
    const checksumString = base64Payload + endpoint + SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(checksumString).digest('hex');
    const checksum = sha256 + "###" + SALT_INDEX;

    const paymentResponse = await fetch(`${PHONEPE_HOST}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      body: JSON.stringify({ request: base64Payload })
    });

    let data;
    try {
      const textResponse = await paymentResponse.text();
      data = JSON.parse(textResponse);
    } catch (e) {
      console.error('PhonePe /pay non-JSON response');
      return res.status(500).json({ error: 'Failed to initiate payment', details: 'Non-JSON response from PhonePe' });
    }

    if (!paymentResponse.ok || !data.success) {
      console.error('PhonePe /pay issue:', data);
      
      if (data.code === '404' || data.code === 'KEY_NOT_CONFIGURED') {
         return res.status(400).json({ 
           error: 'Payment gateway configuration issue', 
           details: `PhonePe returned ${data.code}. This occurs if your Merchant ID (${MERCHANT_ID}) is not recognized OR if your PHONEPE_CLIENT_SECRET / SALT_INDEX is incorrect for the ${PHONEPE_ENV} environment. Please verify your credentials.` 
         });
      }

      return res.status(400).json({ error: 'Failed to initiate payment', details: data });
    }

    if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
      return res.json({
         merchantOrderId: merchantTransactionId,
         redirectUrl: data.data.instrumentResponse.redirectInfo.url,
         state: 'PENDING'
      });
    }

    return res.status(400).json({ error: 'Invalid response from PhonePe', details: data });
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'Internal server error', details: error?.message || error?.toString() });
  }
});

router.post('/refund', async (req, res) => {
   res.status(501).json({ error: 'Refund endpoint needs standard verification logic mapping' });
});

router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (orderId.startsWith('OMO')) {
      return res.status(400).json({ 
        error: 'Invalid order ID format', 
        details: 'Received old PhonePe order ID instead of Merchant Order ID. Please clear cache and restart checkout.' 
      });
    }

    const endpoint = `/pg/v1/status/${MERCHANT_ID}/${orderId}`;
    const checksumString = endpoint + SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(checksumString).digest('hex');
    const checksum = sha256 + "###" + SALT_INDEX;

    const response = await fetch(`${PHONEPE_HOST}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": MERCHANT_ID
      }
    });

    const data = await response.json();
    
    // Map SDK response to our frontend expectations
    // state -> COMPLETED / SUCCESS / FAILED / PENDING etc
    let paymentState = data.code || 'PENDING';
    if (paymentState === 'PAYMENT_SUCCESS') paymentState = 'COMPLETED';
    
    res.json({
      state: paymentState,
      data: data
    });
  } catch (error: any) {
    console.error('Status check error:', error?.message || error);
    res.status(500).json({ error: 'Internal server error', details: error?.message || String(error) });
  }
});

router.post('/webhook', express.json(), async (req, res) => {
  try {
     const xVerify = req.headers['x-verify'] as string;
     const responseBase64 = req.body?.response;
     
     if (!xVerify || !responseBase64) {
       return res.status(400).send('Invalid webhook payload');
     }
     
     const checksumString = responseBase64 + SALT_KEY;
     const sha256 = crypto.createHash('sha256').update(checksumString).digest('hex');
     const expectedChecksum = sha256 + "###" + SALT_INDEX;
     
     if (xVerify !== expectedChecksum) {
        console.error('Webhook checksum failed');
        return res.status(417).send('Invalid Checksum');
     }
     
     const payloadString = Buffer.from(responseBase64, 'base64').toString('utf-8');
     const callbackResponse = JSON.parse(payloadString);

     console.log('Webhook validated callback response:', JSON.stringify(callbackResponse, null, 2));

     const orderId = callbackResponse?.data?.merchantTransactionId;
     if (orderId) {
       console.log(`Processing valid webhook for order: ${orderId}, state: ${callbackResponse?.code}`);
       // Update your database order status here...
     }

     res.status(200).send('OK');
  } catch (error) {
     console.error('Webhook processing issue:', error);
     res.status(500).send('Error');
  }
});

router.all('/callback', express.urlencoded({ extended: true }), async (req, res) => {
   const orderId = req.query.orderId || req.body?.transactionId || req.body?.merchantOrderId || req.query.merchantOrderId || req.query.transactionId;
   let code = req.query.code || req.body?.code || req.body?.payResponseCode || req.query?.payResponseCode || req.body?.paymentState || req.query?.paymentState;
   
   if (!orderId) {
     return res.redirect('/cart');
   }
   
   let redirectUrl = `/checkout/success?orderId=${orderId}`;
   if (code) {
      redirectUrl += `&code=${encodeURIComponent(code as string)}`;
   }
   res.redirect(redirectUrl);
});

export default router;

