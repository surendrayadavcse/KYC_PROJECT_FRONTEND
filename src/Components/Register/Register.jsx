import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { sendOtpThunk, verifyOtpThunk } from "../../Redux/otpSlice";
import {registerUser}  from "../../authentication/userThunks";

const Register = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { otpSent, otpVerified, error } = useSelector((state) => state.otp);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const requestOtp = () => {
    dispatch(sendOtpThunk(user.email));
  };

  const verifyOtp = () => {
    dispatch(verifyOtpThunk({ email: user.email, otp }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) return alert("Please verify OTP before registering.");

    const result = await dispatch(registerUser(user));
    if (registerUser.fulfilled.match(result)) {
      alert("Registration successful!");
      navigate("/login");
    } else {
      alert("Registration failed.");
    }
  };

  return (
    <>
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="col-md-6 bg-light p-4 rounded shadow-sm">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="fullName"
            variant="outlined"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mobile"
            name="mobile"
            variant="outlined"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {otpSent && (
            <div className="mb-3">
              <TextField
                label="Enter OTP"
                variant="outlined"
                value={otp}
                onChange={handleOtpChange}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={verifyOtp}
                fullWidth
                sx={{ mt: 1 }}
              >
                Verify OTP
              </Button>
            </div>
          )}

          {!otpSent && (
            <Button
              variant="contained"
              color="primary"
              onClick={requestOtp}
              fullWidth
              sx={{ mb: 2 }}
            >
              Send OTP
            </Button>
          )}

          <FormControlLabel
            control={<Checkbox checked={otpVerified} disabled color="primary" />}
            label="OTP Verified"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!otpVerified}
          >
            Register
          </Button>
          <div>
    If you are already a user, <Link to={"/login"}>Login</Link>
    </div>
        </form>

        {error && <p className="text-danger mt-3">{error}</p>}
      </div>

      <div>
       
      </div>
     
    </div>
   
    </>  
  );
};

export default Register;
