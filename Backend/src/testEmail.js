require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

const testEmail = async () => {
  console.log('Testing email sending...');
  console.log('SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    from: process.env.FROM_EMAIL
  });

  const info = await sendEmail({
    email: 'test@example.com',
    subject: 'Order Confirmation Test',
    html: '<h1>Test Email</h1><p>This is a test of the order confirmation system.</p>'
  });

  if (info) {
    console.log('Test successful! Message ID:', info.messageId);
  } else {
    console.log('Test failed.');
  }
};

testEmail();
