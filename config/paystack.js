const axios = require('axios');

const paystackConfig = {
    initializePayment: async (amount, email, customer) => {
        try {
            const initData = {
                amount: amount * 100, // Paystack expects the amount in pesewas
                email: email,
                customer: customer,
                currency: 'GHS'
            };

            const initResponse = await axios.post(
                'https://api.paystack.co/transaction/initialize',
                initData,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return initResponse.data;
        } catch (error) {
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
                throw new Error(`Payment initialization failed: ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request data:', error.request);
                throw new Error('Payment initialization failed: No response received from Paystack');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
                throw new Error(`Payment initialization failed: ${error.message}`);
            }
        }
    },

    verifyPayment: async (code) => {
        try {
            const verifyResponse = await axios.get(
                `https://api.paystack.co/transaction/verify/${code}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                    }
                }
            );

            return verifyResponse.data;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
                throw new Error(`Payment verification failed: ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request data:', error.request);
                throw new Error('Payment verification failed: No response received from Paystack');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
                throw new Error(`Payment verification failed: ${error.message}`);
            }
        }
    }
};

module.exports = paystackConfig;

