import axios from 'axios';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

interface STKPushResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const initiateSTKPush = async ({
  phoneNumber,
  amount,
  accountReference,
  transactionDesc,
}: {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}): Promise<STKPushResponse> => {
  const shortCode = process.env.SHORTCODE!;
  const passkey = process.env.PASSKEY!;
  const consumerKey = process.env.CONSUMER_KEY!;
  const consumerSecret = process.env.CONSUMER_SECRET!;
  const callbackURL = process.env.CALLBACK_URL!;

  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');

  // ✅ Debug logs before token request
  console.log('================== ENV & REQUEST DATA ==================');
  console.log('Phone:', phoneNumber);
  console.log('Amount:', amount);
  console.log('ShortCode:', shortCode);
  console.log('AccountReference:', accountReference);
  console.log('TransactionDesc:', transactionDesc);
  console.log('CALLBACK_URL:', callbackURL);
  console.log('Timestamp:', timestamp);
  console.log('Base64 Password:', password);
  console.log('========================================================');

  try {
    // Get access token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const { data: tokenRes } = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    const access_token = tokenRes.access_token;

    // Initiate STK Push
    const { data: stkRes } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: shortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackURL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      },
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    // Return success response
    return {
      success: true,
      transactionId: stkRes.CheckoutRequestID, // Extract transaction ID
    };
  } catch (error: any) {
    console.error('STK Push Error:', error.response ? error.response.data : error.message);

    // Return failure response
    return {
      success: false,
      error: error.response?.data?.errorMessage || error.message,
    };
  }
};
