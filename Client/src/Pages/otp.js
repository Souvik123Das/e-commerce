import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const OtpVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        toast.success('OTP verified successfully!');
        setTimeout(() => {
          navigate('/'); // Redirect to login or another page after successful verification
        }, 2000);
      } else {
        toast.error(result.msg || 'Failed to verify OTP');
      }
    } catch (error) {
      toast.error('Error verifying OTP');
      console.error('Error:', error);
    }
  };

  return (
    <div className='otp-verification'>
      <h1>Verify OTP</h1>
      <form onSubmit={handleOtpSubmit}>
        <input
          type="email"
          placeholder='Email Address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder='Enter OTP'
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default OtpVerification;
