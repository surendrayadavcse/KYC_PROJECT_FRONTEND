import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../authentication/userThunks";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, role, loading, error } = useSelector((state) => state.user);
  console.log(user)
  console.log(role)
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(loginData)).unwrap();
      alert("Login successful!");
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  useEffect(() => {
    if (role) {
      if (role === "CUSTOMER") {
        navigate("/dashboard");
      } else {
        navigate("/admindashboard");
      }
    }
  }, [user, role, navigate]);

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="form-control mb-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="form-control mb-2"
          required
        />
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
        <p>
          If you are not already a user, <Link to={"/register"}>Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
