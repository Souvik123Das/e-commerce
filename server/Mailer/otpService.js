const crypto = require('crypto');
const postmark = require('postmark');
const nodemailer = require('nodemailer');
const OTP = require('../models/otp-model');

// const CLIENT = new postmark.ServerClient(process.env.POSTMARK_API_KEY); // Your Postmark API key
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
      user: process.env.USER_MAIL,
      pass: process.env.USER_PASS
  }
});

const generateOtp = () => {
  return crypto.randomInt(100000, 999999);
};

const sendTestEmail = async (email) => {
  const otp = generateOtp();
  const otpInstance = new OTP({
    email,
    otp
  });

  // Save the OTP instance to the database
  const result = await otpInstance.save();
  console.log(result);

  const mailOptions = {
    from: 'bibhabindia@gmail.com', // Your Postmark verified sender email
    to: email,
    subject: 'Your OTP Code',
    text: `Hello,

              Your One-Time Password (OTP) for Skill Verse is: ${otp}

              Please enter this OTP within the next 5 minutes to proceed. If you did not request this OTP, please ignore this email.

              Thank you for using Skill Verse!

              Best,
              The Skill Verse Team`,
    html: `<div style="font-family: Helvetica,Arial,sans-serif;max-width:700px;width: 100%;margin: 0 auto;overflow:auto;line-height:2;background-color:#f6fff8;">
              <div style="margin:20px auto;width:90%;padding:20px 0;max-width:600px;">
                  <div style="border-bottom:1px solid #eee; background-color: #e59500; border-radius: 5px; text-align: center; padding: 10;">
                      <a href="" style="font-size:1.8em;color: black;text-decoration:none;font-weight:800;">Your Skillverse OTP</a>
                  </div>
                  <p style="font-size:1.1em">Hi,</p>
                  <p>We received a request to verify your email address. <br/>Your verification code is:</p>
                  <h2 style="background: #e59500;margin: 20px auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                  <p style="font-size:0.9em;">
                      This OTP is valid for 5 minutes.
                      <br/>
                      If you did not request this code, it is possible that someone else is trying to access your account. <br/><b>Do not forward or give this code to anyone.</b>
                      <br/>
                      <br/>
                      Sincerely yours,
                      <br/>
                      The Skillverse team
                  </p>
                  <hr style="border:none;border-top:1px solid #eee" />
                  <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                      <p>This email can't receive replies.</p>
                  </div>
                  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                      <p>Skillverse</p>
                      <p>Kolkata</p>
                      <p>India</p>
                  </div>
              </div>
          </div>
          
          <style>
              @media (max-width: 480px) {
                  h2 {
                      font-size: 1.5em; /* Adjusting the font size for the OTP on smaller screens */
                  }
              }
          </style>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Unable to send OTP email.');
  }
};

const verifyOtp = async (email, otp) => {
  try {
    const otpDocument = await OTP.findOne({ email });

    if (!otpDocument) {
      console.log('No OTP document found or it has expired.');
      return false;
    }

    if (otpDocument.otp.toString() === otp) {
      await OTP.deleteOne({ email }); // OTP used
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
};

module.exports = {
  generateOtp,
  sendTestEmail,
  verifyOtp,
};
