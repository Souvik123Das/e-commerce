const { sendTestEmail } = require('./otpService'); // Adjust path as necessary

// Define the sendOTP function
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) { // Corrected the check to only verify the email
        return res.status(400).json({ msg: 'Email is required' });
    }
    
    
    await sendTestEmail(email);
    
    res.status(200).json({ msg: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};


module.exports = sendOTP;
