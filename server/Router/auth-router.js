const express = require("express");
const router = express.Router();
const authControllers = require("../Controllers/auth.controller");
const verifyOtpHandler = require('../Mailer/verifyOtp');
const { generateOtp, storeOtp,sendTestEmail } = require('../Mailer/otpService');
// const { sendOtpEmail } = require('../Controllers/auth.controller');
const sendOTP = require('../Mailer/sendotp');

// Home route
router.route("/").post(authControllers.home);

// Registration route
router.post('/register', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: 'Email is required' });
    }

    try {
        const otp = generateOtp();
        await sendTestEmail(email, otp);
        storeOtp(email, otp);
        res.status(200).json({ msg: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// router.post('/send-otp-email', async (req, res) => {
//     const { email } = req.body;
//     try {
//       await sendOtpEmail(email);
//       res.status(200).send({ message: 'OTP sent successfully' });
//     } catch (error) {
//       res.status(500).send({ message: 'Error sending OTP', error: error.message });
//     }
//   });
router.post('/send-otp-email',sendOTP );

// Login route
router.route("/login").post(authControllers.login);

// OTP verification route
router.post('/verify-otp', verifyOtpHandler);

module.exports = router;
