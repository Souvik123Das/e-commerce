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

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length <= 50 ? '' : 'Name should be max 50 characters long';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : '';
      case 'phone':
        return /^\d{0,10}$/.test(value) ? '' : 'Phone number should be max 10 digits';
      case 'password':
        return value.length <= 20 ? '' : 'Password should be max 20 characters long';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // Input limitations
    switch (name) {
      case 'name':
        newValue = newValue.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
        break;
      case 'email':
        newValue = newValue.slice(0, 50);
        break;
      case 'phone':
        newValue = newValue.replace(/\D/g, '').slice(0, 10);
        break;
      case 'password':
        newValue = newValue.slice(0, 20);
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });

    if (type !== 'checkbox') {
      setErrors({
        ...errors,
        [name]: validateField(name, newValue),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = Object.keys(formData).reduce((acc, key) => {
      if (key !== 'agree') {
        acc[key] = validateField(key, formData[key]);
      }
      return acc;
    }, {});

    setErrors(formErrors);

    if (Object.values(formErrors).some(error => error !== '')) {
      toast.error('Please correct the errors in the form', {
        position: "top-center",
        autoClose: 5000
      });
    }

    if (!formData.agree) {
      toast.error('Please agree to the terms and conditions',{
        position: "top-center",
        autoClose: 5000
      });
    }

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
          {errors.name && <p className="error">{errors.name}</p>}
          <input type="email" name="email" placeholder='Email Address' value={formData.email} onChange={handleChange} required />
          {errors.email && <p className="error">{errors.email}</p>}
          <input type="tel" name="phone" placeholder='Phone No' value={formData.phone} onChange={handleChange} required />
          {errors.phone && <p className="error">{errors.phone}</p>}
          <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} required />
          {errors.password && <p className="error">{errors.password}</p>}
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