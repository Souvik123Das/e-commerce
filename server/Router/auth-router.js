const express = require("express");
const router = express.Router();
const authControllers = require("../Controllers/auth.controller");
const verifyOtpHandler = require('../Mailer/verifyOtp');
const { generateOtp, sendOtpEmail, storeOtp } = require('../Mailer/otpService');

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
        await sendOtpEmail(email, otp);
        storeOtp(email, otp);
        res.status(200).json({ msg: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// Login route
router.route("/login").post(authControllers.login);

// OTP verification route
router.post('/verify-otp', verifyOtpHandler);

module.exports = router;
