import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";

const ForgotPasswordModal = ({ show, handleClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const resetState = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setAlert({ type: "", message: "" });
    setIsLoading(false);
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const res = await axios.post("http://localhost:9999/api/forgotpassword/sendotp", { email });
      setAlert({ type: "success", message: res.data.message });
      setStep(2);
    } catch (err) {
      setAlert({
        type: "danger",
        message: err?.response?.data?.message || "Something went wrong while sending OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndReset = async () => {
    setIsLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const res = await axios.post("http://localhost:9999/api/forgotpassword/verifyotp", {
        email,
        otp,
        newPassword,
      });
      setAlert({ type: "success", message: res.data.message });
      setTimeout(() => {
        resetState();
        handleClose();
      }, 1500);
    } catch (err) {
      setAlert({
        type: "danger",
        message: err?.response?.data?.message || "OTP verification failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <Form.Group controlId="formEmail">
        <Form.Label>Enter your registered email</Form.Label>
        <Form.Control
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
    </>
  );

  const renderStep2 = () => (
    <>
      <Form.Group controlId="formOtp">
        <Form.Label>Enter OTP</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter the OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formNewPassword" className="mt-2">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Form.Group>
    </>
  );

  return (
    <Modal
      show={show}
      onHide={() => {
        resetState();
        handleClose();
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Forgot Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert.message && (
          <Alert variant={alert.type} className="text-center">
            {alert.message}
          </Alert>
        )}
        <Form>{step === 1 ? renderStep1() : renderStep2()}</Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            resetState();
            handleClose();
          }}
        >
          Close
        </Button>
        {step === 1 ? (
          <Button variant="primary" onClick={handleSendOTP} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" />
                &nbsp;Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        ) : (
          <Button variant="success" onClick={handleVerifyAndReset} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" />
                &nbsp;Verifying...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ForgotPasswordModal;
