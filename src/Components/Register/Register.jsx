import React, { useState, useEffect,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { sendOtpThunk, verifyOtpThunk } from "../../Redux/otpSlice";
import { registerUser } from "../../authentication/userThunks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetOtpState } from "../../Redux/otpSlice";
const Register = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    dispatch(resetOtpState());
  }, [dispatch]);

  


  const { otpSent, otpVerified } = useSelector((state) => state.otp);
  const { error, loading } = useSelector((state) => state.user);
  const inputsRef = useRef([]);
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // const handleOtpChange = (e) => {
  //   setOtp(e.target.value);
  // };

  const requestOtp = async () => {
    if (!user.email ) {
      toast.error("Please fill email");
      return;
    }
    if (!user.mobile ) {
      toast.error("Please fill mobile number");
      return;
    }

    try {
      console.log(user.mobile,"i am from mobile")
      await dispatch(sendOtpThunk({email:user.email,mobile:user.mobile})).unwrap();
      toast.success("OTP sent to your email");
      setTimer(30); // Start 30s timer
    } catch (err) {
    
      toast.error(err || "Failed to send OTP");
    }
  };

  // const verifyOtp = async () => {
  //   if (!otp) {
  //     toast.error("Please enter the OTP");
  //     return;
  //   }

  //   try {
  //     await dispatch(verifyOtpThunk({ email: user.email, otp })).unwrap();
  //     toast.success("OTP verified successfully");
  //     setOtp("");
  //   } catch (err) {
  //     toast.error(err.message || "Invalid OTP");
  //   }
  // };
  
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only numbers
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };
  
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = ""; // Clear current box
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
        const prevOtp = [...otp];
        prevOtp[index - 1] = ""; // Also clear previous box
        setOtp(prevOtp);
      }
    }
  };
  
  
  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData('text').split('').slice(0, 4);
    const newOtp = [...otp];
    pastedData.forEach((char, idx) => {
      newOtp[idx] = char;
    });
    setOtp(newOtp);
    
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex < inputsRef.current.length) {
      inputsRef.current[lastFilledIndex].focus();
    }
  };
  
  // Update verifyOtp function slightly
  const verifyOtp = async () => {
    const finalOtp = otp.join('');
    if (!finalOtp) {
      toast.error("Please enter the OTP");
      return;
    }
  
    try {
      await dispatch(verifyOtpThunk({ email: user.email, otp: finalOtp })).unwrap();
      toast.success("OTP verified successfully");
      setOtp(["", "", "", ""]);
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify OTP before registering.");
      return;
    }

    try {
      await dispatch(registerUser(user)).unwrap();
      toast.success("Registration successful!");
      setUser({ fullName: "", email: "", mobile: "", password: "" });
      setOtp("");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      toast.error(err.message || "Registration failed");
   
    }
  };

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#f5f7ff" }}
    >
      <ToastContainer />
      <div className="row bg-white shadow rounded-4 w-100 p-5 min-vh-100">
        <div className="col-md-6 pe-md-5">
          <div className="text-center mb-4">
            <i className="bi bi-bank2 fs-1 text-primary"></i>
            <h3 className="fw-bold mt-2">Get Started with FinEdge</h3>
            <p className="text-muted small">Your personal banking assistant.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label"><b>Full Name</b></label>
              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label"><b>Mobile Number </b></label>
              <input
                type="text"
                name="mobile"
                value={user.mobile}
                onChange={handleChange}
                className="form-control"
                placeholder="+1 (123) 456-7890"
                required
              />
            </div>
            <div className="mb-3 d-flex gap-2">
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="form-control"
                placeholder="your@email.com"
                required
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={requestOtp}
                disabled={timer > 0}
              >
                <i className="bi bi-send-fill"></i>
                {timer > 0
                  ? ` Resend in ${timer}s`
                  : (otpSent ? " Resend OTP" : " Send OTP")}
              </button>
            </div>

            {otpSent && !otpVerified && (
  <div className="mb-3 d-flex justify-content-start align-items-start gap-2" onPaste={handlePaste}>
    <div className="d-flex gap-2">
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={otp[index] || ""}
          onChange={(e) => handleOtpChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputsRef.current[index] = el)}
          className="form-control text-center p-0"
          style={{
            width: "40px",
            height: "40px",
            fontSize: "18px",
            borderRadius: "6px",
            border: "1px solid #ced4da",
          }}
        />
      ))}
    </div>
    <button
      type="button"
      onClick={verifyOtp}
      className="btn btn-secondary"
      style={{ height: "40px", whiteSpace: "nowrap" }}
    >
      Verify OTP
    </button>
  </div>
)}


            <div className="mb-3">
              <label className="form-label"><b>Password</b></label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Create password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100"
              style={{ backgroundColor: "#6c4dff", color: "#fff" }}
              disabled={!otpVerified || loading}
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>

            <div className="text-center  mt-3">
              <b>
                Already have an account? <Link to="/login">Login</Link>
              </b>
            </div>
          </form>
        </div>

        <div className="col-md-6  d-md-flex flex-column justify-content-center align-items-center text-center">
          <img
            src="image.png"
            alt="bank"
            className="img-fluid rounded"
            style={{ maxHeight: "300px" }}
          />
          <h5 className="fw-bold mt-4">Smarter Banking Begins Here</h5>
          <p className="text-muted small">
            Open accounts, apply for loans, manage your money securely, all with FinEdge.
          </p>

          <div className="row w-75 mt-3 mb-2 ">
            <div className="col-6 mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-bank fs-5 text-primary"></i>
              <span className="small">Create Bank Account</span>
            </div>
            <div className="col-6 mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-cash-stack fs-5 text-primary"></i>
              <span className="small">Apply for Loans</span>
            </div>
            <div className="col-6 mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-repeat fs-5 text-primary"></i>
              <span className="small">Track Repayments</span>
            </div>
            <div className="col-6 mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-wallet2 fs-5 text-primary"></i>
              <span className="small">Digital Wallet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
