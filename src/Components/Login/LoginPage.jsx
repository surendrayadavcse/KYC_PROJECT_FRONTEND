import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../authentication/userThunks";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useKyc } from "../../context/KycContext"; 
import ForgotPasswordModal from "./ForgotPasswordModal"; 

const Login = () => {
  const { refreshKycStatus } = useKyc(); 
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const { loading } = useSelector((state) => state.user);
  
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(loginData)).unwrap();
      toast.success("Login successful!");
      refreshKycStatus();
      const role = result.role;
      if(role === "ADMIN") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err?.error || "Invalid credentials");
    }
  };

  return (
    <>  
     <ForgotPasswordModal show={showForgotModal} handleClose={() => setShowForgotModal(false)} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        hideProgressBar
        newestOnTop
        toastStyle={{
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 20px',
          fontSize: '16px',
        }}
      />
      <div className="container-fluid bg-light d-flex align-items-center justify-content-center">
        <div className="row bg-white shadow rounded-4 w-100 p-5 min-vh-100" style={{ height: "auto" }}>
          <div className="col-md-6 border-end">
            <div className="text-start mb-4">
              <i className="bi bi-box fs-1 text-primary"></i>
              <h3 className="fw-bold">Welcome Back <span>👋</span></h3>
              <p className="text-muted">Login to access your dashboard</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label"><b>Email Address</b></label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email Address"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label"><b>Password</b></label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <div></div>
                <div className="d-flex justify-content-between mb-3">
        <div></div>
        <span
          className="text-decoration-none text-primary"
          style={{ cursor: "pointer" }}
          onClick={() => setShowForgotModal(true)}
        >
          Forgot password?
        </span>
      </div>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="mt-3">
                <b>Don't have an account? </b>
                <Link to="/register" className="text-primary">Sign Up</Link>
              </p>
            </form>
          </div>

          <div className="col-md-6 d-flex flex-column align-items-center justify-content-center text-center px-4">
            <img
              src="login.png"
              alt="KYC Illustration"
              className="img-fluid mb-3"
              style={{ maxHeight: "200px" }}
            />
            <h5 className="fw-bold">Unlock Full Access with KYC <i className="bi bi-check2-square text-success"></i></h5>
            <p className="text-muted small">
              Open accounts, apply for loans, and track repayments — right from your dashboard.
            </p>

            <div className="alert alert-warning w-100 py-2 small">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Complete your KYC to access all services securely.
            </div>

            <div className="row w-150 text-start small">
              <div className="col-6 mb-2"><i className="bi bi-bank me-2 text-primary fs-2"></i>Open Bank Account</div>
              <div className="col-6 mb-2"><i className="bi bi-file-earmark-text me-2 text-primary fs-2"></i>Apply for Loan</div>
              <div className="col-6"><i className="bi bi-cash-stack me-2 text-primary fs-2"></i>Track Repayments</div>
              <div className="col-6"><i className="bi bi-bar-chart-line me-2 text-primary fs-2"></i>View Loan Status</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
