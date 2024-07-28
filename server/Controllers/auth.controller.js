const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { verifyOtp } = require('../Mailer/otpService');

const home = async (req, res) => {
  try {
    res.status(200).send("welcome ");
  } catch (error) {
    console.log(error);
  }
};

// const otpStore = {};
// const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// const generateOtp = () => crypto.randomInt(100000, 999999); // 6-digit OTP

// const sendOtpEmail = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending OTP email:", error);
//     throw new Error("Unable to send OTP email.");
//   }
// };

// const storeOtp = (email, otp) => {
//   otpStore[email] = {
//     otp,
//     expiry: Date.now() + OTP_EXPIRY_TIME,
//   };
// };

const register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, phone, password, otp } = req.body;

    const isOtpValid = await verifyOtp(email, otp);

    if (!isOtpValid) {
      console.log("Invalid OTP");
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ msg: "Email already exists" });
    }

    const saltRound = 10;
    const hash_password = await bcrypt.hash(password, saltRound);

    const userCreated = await User.create({
      username,
      email,
      phone,
      password: hash_password,
    });

    const token = await userCreated.genaratetoken();

    res.status(201).json({
      msg: "User registered successfully",
      token: token,
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    console.log(userExist);
    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const user = await bcrypt.compare(password, userExist.password);

    if (user) {
      res.status(200).json({
        msg: "Login Successful ",
        token: await userExist.genaratetoken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json("internal server error");
  }
};

module.exports = { home, register, login };
