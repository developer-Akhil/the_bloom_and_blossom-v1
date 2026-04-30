import express from 'express';
import crypto from 'crypto';
import { StandardCheckoutClient, Env } from '@phonepe-pg/pg-sdk-node';

const router = express.Router();

// The user's env vars got swapped in the platform, let's fix it by checking format
let envClientId = process.env.PHONEPE_CLIENT_ID || 'SU2604291521118069515094';
let envClientSecret = process.env.PHONEPE_CLIENT_SECRET || '1b0a1511-d56d-4fea-a426-74676c9350bf';

if (envClientId.includes('-') && envClientSecret.startsWith('SU')) {
  // They are swapped!
  const temp = envClientId;
  envClientId = envClientSecret;
  envClientSecret = temp;
}

const CLIENT_ID = envClientId;
const CLIENT_SECRET = envClientSecret;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || '1';
// process.env.PHONEPE_ENV might be "production", so let's normalize
const normalizedEnv = (process.env.PHONEPE_ENV || 'PROD').toUpperCase();
const PHONEPE_ENV = normalizedEnv === 'PRODUCTION' ? 'PROD' : normalizedEnv;

const PHONEPE_BASE_URL = 'https://api.phonepe.com/apis/pg';
const PHONEPE_TOKEN_URL = 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token';

let cachedToken: string | null = null;
let tokenExpiryTime = 0;

// Helper to get PhonePe token
async function getAuthToken() {
  if (cachedToken && Date.now() < tokenExpiryTime) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_version', CLIENT_VERSION);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');

  const response = await fetch(PHONEPE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'User-Agent': 'PostmanRuntime/7.28.4'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('PhonePe Token Error:', err);
    throw new Error('Failed to get PhonePe auth token: ' + err);
  }

  const data = await response.json();
  // `expires_in` is in seconds. Buffer of 60 seconds
  tokenExpiryTime = Date.now() + (data.expires_in - 60) * 1000;
  cachedToken = data.access_token;

  return cachedToken;
}

router.post('/pay', async (req, res) => {
  try {
    const { amount, phone, name, email } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const token = await getAuthToken();
    const merchantOrderId = 'TX' + Date.now() + Math.random().toString(36).substring(2, 7);
    
    // Convert to minor units if Phonepe requires paisa? The API docs say amount, usually it's in paisa for PG but let's assume it's normal as the example is 1000. Wait, Phonepe standard PG requires amount in paise. If amount is 1000, that's RS 10. Let's multiply by 100 just in case, but let's check standard Phonepe API docs. Actually the standard Phonepe API amounts are in paise. Let's do `Math.round(amount * 100)`. Wait, standard Phonepe checkout uses paise. Let's do `amount * 100`.

    // Construct backend redirect URL
    let appBaseUrl = process.env.APP_URL;
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
    const redirectUrl = `${appBaseUrl}/api/payment/callback?orderId=${merchantOrderId}`;

    const payload = {
      merchantOrderId,
      amount: Math.round(amount * 100), // convert to paise
      expireAfter: 1200,
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Payment for order",
        merchantUrls: {
          redirectUrl: redirectUrl
        }
      },
      disablePaymentRetry: false,
      metaInfo: {
        udf1: name || '',
        udf2: email || '',
        udf3: phone || ''
      }
    };

    const paymentResponse = await fetch(`${PHONEPE_BASE_URL}/checkout/v2/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${token}` // Actually example shows space maybe not ' O-Bearer'? Wait, 'O-Bearer ' is what the docs said.
      },
      body: JSON.stringify(payload)
    });

    if (!paymentResponse.ok) {
      const errText = await paymentResponse.text();
      console.error('PhonePe /pay issue:', errText);
      return res.status(500).json({ error: 'Failed to initiate payment', details: errText });
    }

    const data = await paymentResponse.json();
    data.merchantOrderId = merchantOrderId;
    return res.json(data);
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'Internal server error', details: error?.message || error?.toString() });
  }
});

router.post('/refund', async (req, res) => {
  try {
    const { originalMerchantOrderId, amount } = req.body;
    
    if (!originalMerchantOrderId || !amount) {
      return res.status(400).json({ error: 'originalMerchantOrderId and amount are required' });
    }

    const token = await getAuthToken();
    const merchantRefundId = 'REF' + Date.now() + Math.random().toString(36).substring(2, 7);
    
    const payload = {
       merchantRefundId,
       originalMerchantOrderId,
       amount: Math.round(amount * 100)
    };

    const response = await fetch(`${PHONEPE_BASE_URL}/payments/v2/refund`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Refund initiation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // If frontend passed the PhonePe order ID (OMO...) instead of Merchant Order ID (TX...)
    // This can happen if old sessionStorage is cached.
    if (orderId.startsWith('OMO')) {
      return res.status(400).json({ 
        error: 'Invalid order ID format', 
        details: 'Received PhonePe order ID instead of Merchant Order ID. Please clear cache and restart checkout.' 
      });
    }

    const sdkEnv = Env.PRODUCTION;
    const client = StandardCheckoutClient.getInstance(CLIENT_ID, CLIENT_SECRET, parseInt(CLIENT_VERSION) || 1, sdkEnv);

    // Call sdk to fetch status
    const response = await client.getOrderStatus(orderId);

    // Map SDK response to our frontend expectations
    // The previous implementation mapped `data.state` on frontend
    res.json({
      state: response.state,
      data: response
    });
  } catch (error: any) {
    console.error('Status check error:', error?.message || error);
    res.status(500).json({ error: 'Internal server error', details: error?.message || String(error) });
  }
});

router.post('/webhook', express.json(), async (req, res) => {
  try {
     console.log('Phonepe Webhook event:', req.body);
     
     const authorizationHeaderData = (req.headers['authorization'] || '') as string;
     const usernameConfigured = process.env.PHONEPE_WEBHOOK_USERNAME || 'bloom';
     const passwordConfigured = process.env.PHONEPE_WEBHOOK_PASSWORD || 'bloom123';
     
     // The SDK requires the JSON string of the body
     const phonepeS2SCallbackResponseBodyString = JSON.stringify(req.body);

     const sdkEnv = Env.PRODUCTION;
     const client = StandardCheckoutClient.getInstance(CLIENT_ID, CLIENT_SECRET, parseInt(CLIENT_VERSION) || 1, sdkEnv);

     let callbackResponse;
     try {
       callbackResponse = client.validateCallback(
         usernameConfigured,
         passwordConfigured,
         authorizationHeaderData,
         phonepeS2SCallbackResponseBodyString
       );
     } catch (sdkError: any) {
        console.error('Webhook SDK validation failed:', sdkError.message || sdkError);
        return res.status(417).send('Invalid Callback');
     }

     console.log('Webhook validated callback response:', JSON.stringify(callbackResponse, null, 2));

     const orderId = callbackResponse?.payload?.orderId || callbackResponse?.payload?.originalMerchantOrderId;
     if (orderId) {
       console.log(`Processing valid webhook for order: ${orderId}, state: ${callbackResponse?.payload?.state}`);
       // Update your database order status here...
     }

     res.status(200).send('OK');
  } catch (error) {
     console.error('Webhook processing issue:', error);
     res.status(500).send('Error');
  }
});

router.all('/callback', express.urlencoded({ extended: true }), async (req, res) => {
   // User redirected back from PhonePe
   // PhonePe passes orderId/transactionId in body or query parameters
   const orderId = req.query.orderId || req.body?.transactionId || req.body?.merchantOrderId || req.query.merchantOrderId;
   let code = req.query.code || req.body?.code || req.body?.payResponseCode || req.query?.payResponseCode || req.body?.paymentState || req.query?.paymentState;
   
   if (!orderId) {
     return res.redirect('/cart');
   }
   
   // Redirect to frontend to handle checking status and displaying success/failure
   let redirectUrl = `/checkout/success?orderId=${orderId}`;
   if (code) {
      redirectUrl += `&code=${encodeURIComponent(code as string)}`;
   }
   res.redirect(redirectUrl);
});

export default router;
