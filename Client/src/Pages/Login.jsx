import React, { useState } from 'react';
import './CSS/Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://e-commerce-lake-five-53.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(`Login failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Error: Unable to login');
      console.error('Error:', error);
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className='Login'>
      <div className="login-container">
        <h1>Login</h1>
        <form className="login-fields" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder='Email Address' value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p className="login-signup">Don't have an account? <span onClick={handleSignupClick}>Sign up here</span></p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;