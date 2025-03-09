const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
const client = new twilio(accountSid, authToken);

const sendSMS = (to, message) => {
    return client.messages.create({
        body: message,
        to: to,  // Text this number
        from: process.env.TWILIO_PHONE_NUMBER // From a valid Twilio number
    });
};

module.exports = {
    sendSMS
};