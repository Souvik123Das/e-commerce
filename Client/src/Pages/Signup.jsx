import React, { useState } from "react";
import "./CSS/Signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import OtpVerification from "./otp";

const LoginSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    agree: false,
  });
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.length <= 25 ? "" : "Name should be max 25 characters long";
      case "phone":
        return /^\d{0,10}$/.test(value) ? "" : "Phone number should be max 10 digits";
      case "password":
        return value.length <= 20 ? "" : "Password should be max 20 characters long";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    switch (name) {
      case "name":
        newValue = newValue.replace(/[^a-zA-Z\s]/g, "").slice(0, 25);
        break;
      case "email":
        newValue = newValue.slice(0, 50);
        break;
      case "phone":
        newValue = newValue.replace(/\D/g, "").slice(0, 10);
        break;
      case "password":
        newValue = newValue.slice(0, 20);
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });

    if (type !== "checkbox") {
      setErrors({
        ...errors,
        [name]: validateField(name, newValue),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email address", {
        position: "top-center",
        autoClose: 5000,
      });
      setIsLoading(false);
      return;
    }

    const formErrors = Object.keys(formData).reduce((acc, key) => {
      if (key !== "agree") {
        acc[key] = validateField(key, formData[key]);
      }
      return acc;
    }, {});

    setErrors(formErrors);

    if (Object.values(formErrors).some((error) => error !== "")) {
      toast.error("Please correct the errors in the form", {
        position: "top-center",
        autoClose: 5000,
      });
      setIsLoading(false);
      return;
    }

    if (!formData.agree) {
      toast.error("Please agree to the terms and conditions", {
        position: "top-center",
        autoClose: 5000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Registration failed: ${errorData.message || "Unknown error"}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // await sendTestEmail(formData.email);
      toast.success(" OTP sent to your email.");
      setShowOtpField(true);
    } catch (error) {
      toast.error("Error: Unable to register");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async (email) => {
    try {
    const response = await fetch(
      "http://localhost:5000/send-otp-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`Error sending OTP: ${errorData.message || "Unknown error"}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    toast.success("OTP sent to your email.");
    setShowOtpField(true);
  } catch (error) {
    toast.error("Error: Unable to send OTP");
    console.error("Error:", error);
  } finally {
    setIsLoading(false);
  }
};

  
  const handleOtpSubmit = async () => {
    setIsLoading(true);
    try {
      // <OtpVerification />
      const response = await fetch(
        "http://localhost:5000/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email, otp }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.msg || "OTP verification failed");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast.success("OTP verified successfully! Registration completed.");
      setTimeout(() => {
        navigate('/');
      }, 4000);
    } catch (error) {
      toast.error("Error during OTP verification");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="Loginsignup">
      <div className="loginsignup-container">
        <h1>Sign Up</h1>
        <form className="loginsignup-fields" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <input
            type="tel"
            name="phone"
            placeholder="Phone No"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <p className="error">{errors.phone}</p>}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
          {!showOtpField ? (
            <button type="submit">
              {isLoading ? "Submitting..." : "Sign Up"}
            </button>
          ) : (
            <div>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleOtpSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}
        </form>
        <div className="loginsignup-agree">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            required
          />
          <p>By continuing, I agree to the terms and conditions</p>
        </div>
        <p className="loginsignup-login">
          Already have an account?{" "}
          <span onClick={handleLoginClick}>Login here</span>
        </p>
      </div>
      <ToastContainer /> {/* Ensure ToastContainer is included here */}
    </div>
  );
};

export default LoginSignup;
