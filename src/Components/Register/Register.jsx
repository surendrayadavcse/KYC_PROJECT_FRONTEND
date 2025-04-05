import React, { useState } from "react";
import { registerUser } from "../../authentication/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(user);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className="form-control mb-2"/>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="form-control mb-2"/>
        <input type="text" name="mobile" placeholder="Mobile" onChange={handleChange} className="form-control mb-2"/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="form-control mb-2"/>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
