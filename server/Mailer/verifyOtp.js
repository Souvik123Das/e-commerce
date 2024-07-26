const { verifyOtp } = require('./otpService'); // Adjust path as necessary

const verifyOtpHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('Received email:', email);
    console.log('Received OTP:', otp);

    if (!email || !otp) {
      return res.status(400).json({ msg: 'Email and OTP are required' });
    }

    const isValid = verifyOtp(email, otp);

    if (isValid) {
      res.status(200).json({ msg: 'OTP verified successfully' });
    } else {
      res.status(400).json({ msg: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

module.exports = verifyOtpHandler;
