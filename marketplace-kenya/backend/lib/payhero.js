const axios = require('axios');

const BASE_URL = 'https://backend.payhero.co.ke/api/v2';
const PAYHERO_USERNAME = process.env.PAYHERO_USERNAME;
const PAYHERO_PASSWORD = process.env.PAYHERO_PASSWORD;
const CALLBACK_URL = process.env.PAYHERO_CALLBACK_URL;

// Generate Basic Auth token
const getAuthToken = () => {
  return Buffer.from(`${PAYHERO_USERNAME}:${PAYHERO_PASSWORD}`).toString('base64');
};

// Initiate STK Push
const initiateSTKPush = async (phone, amount, externalReference) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/wallet/request-payment`,
      {
        amount,
        phone_number: phone,
        network_code: '63902', // M-Pesa network code
        external_reference: externalReference,
        callback_url: CALLBACK_URL,
      },
      {
        headers: {
          Authorization: `Basic ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('PayHero STK Push error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to initiate STK Push');
  }
};

// Verify transaction
const verifyTransaction = async (transactionId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/wallet/transaction-status/${transactionId}`,
      {
        headers: {
          Authorization: `Basic ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('PayHero verification error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to verify transaction');
  }
};

// Validate callback data
const validateCallback = (data) => {
  if (!data || !data.status) {
    return false;
  }

  // Check for required fields
  const requiredFields = ['status', 'external_reference'];
  return requiredFields.every(field => data[field] !== undefined);
};

module.exports = {
  initiateSTKPush,
  verifyTransaction,
  validateCallback,
};
