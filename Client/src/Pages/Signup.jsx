import React, { useState } from 'react';
import './CSS/Signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    agree: false,
  });

  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://e-commerce-lake-five-53.vercel.app/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate('/');
        }, 4000);
      } else {
        toast.error(`Registration failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Error: Unable to register');
      console.error('Error:', error);
    }
  };

  const handleLoginClick = () => {
    navigate('/Login'); 
  };

  return (
    <div className='Loginsignup'>
      <div className="loginsignup-container">
        <h1>Sign Up</h1>
        <form className="loginsignup-fields" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder='Your Name' value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder='Email Address' value={formData.email} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder='Phone No' value={formData.phone} onChange={handleChange} required />
          <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} required />
        </form>
        <div className="loginsignup-agree">
          <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} required />
          <p>By continuing, I agree to the terms and conditions</p>
        </div>
        <button type="button" onClick={handleSubmit}>Sign Up</button>
        <p className="loginsignup-login">Already have an account? <span onClick={handleLoginClick}>Login here</span></p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginSignup;
