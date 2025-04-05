import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../authentication/authService";
import { setUser } from "../../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"
import { Link } from "react-router-dom";
const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(loginData);
      console.log(data)
      if(data.error){
        alert("invalid credentials")
      }
      else{
        dispatch(setUser(data));
        alert("Login successful!");
       if(data.role=="CUSTOMER"){
        navigate("/dashboard");
       }
       else{
        navigate("/admindashboard");

       }
        
      }
      
    } catch (error) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="form-control mb-2"/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="form-control mb-2"/>
        <button type="submit" className="btn btn-success">Login</button>
        <p>If You not an already user <Link to={"/register"}>Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
