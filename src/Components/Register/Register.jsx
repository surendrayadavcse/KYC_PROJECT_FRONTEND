import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { sendOtpThunk, verifyOtpThunk, resetOtpState } from "../../Redux/otpSlice";
import { registerUser } from "../../authentication/userThunks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const inputsRef = useRef([]);

  const { otpSent, otpVerified, otpLoading } = useSelector((state) => state.otp);
  const { error, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(resetOtpState());
  }, [dispatch]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
      .required("Mobile number is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  });

  const requestOtp = async (values) => {
    try {
      await dispatch(sendOtpThunk({ email: values.email, mobile: values.mobile })).unwrap();
      toast.success("OTP sent to your email");
      setTimer(30);
    } catch (err) {
      toast.error(err || "Failed to send OTP");
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
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
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
        const prevOtp = [...otp];
        prevOtp[index - 1] = "";
        setOtp(prevOtp);
      }
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").split("").slice(0, 4);
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

  const verifyOtp = async (email) => {
    const finalOtp = otp.join('');
    if (!finalOtp) {
      toast.error("Please enter the OTP");
      return;
    }
    try {
      await dispatch(verifyOtpThunk({ email, otp: finalOtp })).unwrap();
      toast.success("OTP verified successfully");
      setOtp(["", "", "", ""]);
      
      setTimer(0);
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (!otpVerified) {
      toast.error("Please verify OTP before registering.");
      return;
    }
    try {
      await dispatch(registerUser(values)).unwrap();
      toast.success("Registration successful!");
      resetForm();
      setOtp(["", "", "", ""]);
     
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

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
            <h3 className="fw-bold mt-2">Get Started with HexaEdge</h3>
            <p className="text-muted small">Your personal banking assistant.</p>
          </div>

          <Formik
            initialValues={{
              fullName: "",
              email: "",
              mobile: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values,setFieldValue }) => (
              <Form>
                <div className="mb-3">
                  <label className="form-label"><b>Full Name</b></label>
                  <Field
  type="text"
  name="fullName"
  className="form-control"
  placeholder="Enter your full name"
  readOnly={otpVerified}
  onChange={(e) => {
    const onlyChars = e.target.value.replace(/[^A-Za-z\s]/g, '');
    setFieldValue('fullName', onlyChars);
  }}
/>

                  <div className="text-danger small"><ErrorMessage name="fullName" /></div>
                </div>

                <div className="mb-3">
                  <label className="form-label"><b>Mobile Number </b></label>
                  <Field
  type="text"
  name="mobile"
  className="form-control"
  placeholder="+91 8247380327"
  readOnly={otpVerified}
  onChange={(e) => {
    let onlyNums = e.target.value.replace(/\D/g, '');
    if (onlyNums.length > 10) {
      onlyNums = onlyNums.slice(0, 10);
    }
    setFieldValue('mobile', onlyNums);
  }}
/>

                  <div className="text-danger small"><ErrorMessage name="mobile" /></div>
                </div>

                <div className="mb-3 d-flex gap-2">
                  <div className="flex-grow-1">
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="your@email.com"
                      readOnly={otpVerified}
                    />
                    <div className="text-danger small"><ErrorMessage name="email" /></div>
                  </div>

                  {!otpVerified && (
  <button
    type="button"
    className="btn btn-primary d-flex align-items-center gap-2"
    onClick={() => requestOtp(values)}
    disabled={timer > 0 || otpLoading || !values.email || !values.mobile}
    style={{
      width: '120px',
      height: '40px',
    }}
  >
    {otpLoading ? (
      <>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Sending...
      </>
    ) : (
      <>
        <i className="bi bi-send-fill"></i>
        {timer > 0 ? `Resend in ${timer}s` : otpSent ? "Resend OTP" : "Send OTP"}
      </>
    )}
  </button>
)}

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
                      onClick={() => verifyOtp(values.email)}
                      className="btn btn-secondary"
                      style={{ height: "40px", whiteSpace: "nowrap" }}
                      hidden={otpVerified}
                    >
                      Verify OTP
                    </button>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label"><b>Password</b></label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Create password"
                  />
                  <div className="text-danger small"><ErrorMessage name="password" /></div>
                </div>

                <button
                  type="submit"
                  className="btn w-100"
                  style={{
                    backgroundColor: "#0d6efd",
                    color: "#fff",
                  }}
                  disabled={!otpVerified || loading}
                >
                  {loading ? "Registering..." : "Sign Up"}
                </button>

                <div className="text-center mt-3">
                  <b>
                    Already have an account? <Link to="/login">Login</Link>
                  </b>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="col-md-6 d-md-flex flex-column justify-content-center align-items-center text-center">
          <img
            src="image.png"
            alt="bank"
            className="img-fluid rounded"
            style={{ maxHeight: "300px" }}
          />
          <h5 className="fw-bold mt-4">Smarter Banking Begins Here</h5>
          <p className="text-muted small">
            Open accounts, apply for loans, manage your money securely, all with HexaEdge.
          </p>

          <div className="row w-75 mt-3 mb-2">
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
