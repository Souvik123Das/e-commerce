import React, { useState } from 'react';
import './CSS/LoginSignup.css'

const LoginSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    agree: false,
  });

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
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className='Loginsignup'>
      <div className="loginsignup-container">
        <h1>Sign up</h1>
        <form className="loginsignup-fields" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder='Your Name' value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder='Email Address' value={formData.email} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder='Phone No' value={formData.phone} onChange={handleChange} required />
          <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} required />
          <button type="submit">Continue</button>
        </form>
        <p className="loginsignup-login">Already have an account?<span>Login here</span></p>
        <div className="loginsignup-agree">
          <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} required />
          <p>By continuing, I agree to the terms and conditions</p>
        </div>
      </div>
      
    </div>
  )
}

export default LoginSignup
