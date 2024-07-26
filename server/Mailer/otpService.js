const crypto = require('crypto');
const nodemailer = require('nodemailer');
const OTP_EXPIRY_TIME = 5 * 60 * 1000; 

// Mock database for demonstration purposes
const otpStore = {};

// Function to generate OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999); 
};

// Function to send a test email
const sendTestEmail = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'bibhabindia@gmail.com', // Change to your email for testing
    subject: 'Test Email',
    text: 'This is a test email',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
};

// Function to store OTP
const storeOtp = (email, otp) => {
  otpStore[email] = {
    otp,
    expiry: Date.now() + OTP_EXPIRY_TIME,
  };
};

// Function to verify OTP
const verifyOtp = (email, otp) => {
  const storedOtp = otpStore[email];
  if (!storedOtp) return false;

  if (Date.now() > storedOtp.expiry) {
    delete otpStore[email]; // OTP expired
    return false;
  }

  if (storedOtp.otp === otp) {
    delete otpStore[email]; // OTP used
    return true;
  }

  return false;
};

module.exports = {
  generateOtp,
  sendTestEmail,
  storeOtp,
  verifyOtp,
};
