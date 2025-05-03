import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../utils";
import { fetchAllServices } from "../../Redux/serviceSlice";
import { BsLockFill, BsFillLockFill } from "react-icons/bs";
import { FiShield } from "react-icons/fi";
import ConsentForm from "../Consent/ConsentForm";
import { motion } from "framer-motion";
import { useKyc } from "../../context/KycContext"; // << use your KYC context
import "./Dashboard.css";
import { BsCheckCircleFill, BsHourglassSplit, BsCircle } from "react-icons/bs";
import { FaUserCircle, FaCameraRetro } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const userId = localStorage.getItem("id");
  const { list: services } = useSelector((state) => state.services);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { kycStatus, fetchKycStatus } = useKyc(); 
  useEffect(()=>{
    fetchKycStatus()
  },[])
  console.log(kycStatus,"from dashboard")  
  // << Get KYC Status from Context
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showNavigatingAnimation, setShowNavigatingAnimation] = useState(false);
  useEffect(() => {
    if (services.length === 0) {
      dispatch(fetchAllServices());
    }
    if (!kycStatus) {
      fetchKycStatus();
    }
  }, [dispatch, fetchKycStatus, kycStatus, services.length]);
  

  const getNextKycStep = () => {
    if (kycStatus === "STEP 1 COMPLETED") {
      return "/uploaddocuments";
    } else if (kycStatus === "STEP 2 COMPLETED") {
      return "/uploadselfie";
    } else {
      return "/basicdetails";
    }
  };

  const handleStartKYC = async () => {
    try {
      const response = await axios.get(`/consent/status/${userId}`);
      console.log(response.data,"i am consentstatus from dashboard")
      const { consentGiven } = response.data;
      console.log(consentGiven,"consent")

      if (consentGiven) {
        setShowNavigatingAnimation(true);

        setTimeout(() => {
          const nextStep = getNextKycStep();
          navigate(nextStep);
        }, 2000);
      } else {
        setShowConsentModal(true);
      }
    } catch (error) {
      console.error("Error fetching consent status", error);
      if (error.response && error.response.status === 404) {
        setShowConsentModal(true);
      } else {
        alert("Something went wrong! Please try again later.");
      }
    }
  };

  return (
    <>
      {/* Loading Animation */}
      {showNavigatingAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white"
          style={{ zIndex: 9999 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.2 }}
            transition={{ duration: 0.8, yoyo: Infinity }}
            className="text-center"
          >
            <h2 className="fw-bold text-primary mb-3">Getting things ready...</h2>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="container mt-4">
        {/* KYC Status Completed */}
        {kycStatus === "KYC COMPLETED" && (
  <div className="kyc-verified-card d-flex align-items-start p-4 mb-4 rounded shadow-sm">
    <div className="icon-container me-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="#34c38f"
        className="bi bi-check-circle-fill"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 10.03a.75.75 0 0 0 1.07 0l3.992-3.992a.75.75 0 1 0-1.06-1.06L7.5 8.439 5.53 6.47a.75.75 0 1 0-1.06 1.06l2.5 2.5z" />
      </svg>
    </div>
    <div>
      <h6 className="mb-1 fw-bold text-dark">KYC VERIFIED</h6>
      <p className="mb-0 text-muted">
        Congratulations! Your identity has been successfully verified. <br />
        You now have full access to all our services.
      </p>
    </div>
  </div>
)}


        {/* KYC Pending */}
          {kycStatus !== "KYC COMPLETED" && (
            <div className="d-flex justify-content-between align-items-center p-4 mb-4 rounded shadow-sm bg-white border">
              <div>
                <h5 className="text-primary fw-bold mb-2">Action Required</h5>
                <p className="mb-0 text-dark">
                  Complete your KYC Verification to unlock access to all services.
                </p>
                <button className="btn btn-primary mt-3" onClick={handleStartKYC}>
    {kycStatus === "STEP 1 COMPLETED"
      ? "Continue to Document Upload"
      : kycStatus === "STEP 2 COMPLETED"
      ? "Continue to Live Selfie"
      : kycStatus === null || kycStatus === "PENDING"
      ? "Start KYC Verification"
      : "Continue KYC"}
  </button>

              </div>

              {/* Shield Icon */}
              <div
                className="d-flex justify-content-center align-items-center rounded"
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#0d47a1",
                  position: "relative",
                }}
              >
                <FiShield size={48} color="white" />
                <BsFillLockFill
                  size={20}
                  color="white"
                  style={{
                    position: "absolute",
                    bottom: "26px",
                    right: "28px",
                  }}
                />
              </div>
            </div>
          )}

        {/* Services */}
        {/* KYC Progress Tracker */}
{/* Enhanced KYC Progress Tracker */}
{kycStatus !== "KYC COMPLETED" && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="kyc-progress-tracker p-3 mb-4 rounded shadow-sm bg-white border"
  >
    <h5 className="fw-bold text-primary mb-4">KYC Progress</h5>
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
      {[
        { label: "Basic Details", icon: <FaUserCircle size={24} /> },
        { label: "Upload Documents", icon: <HiDocumentText size={24} /> },
        { label: "Live Selfie", icon: <FaCameraRetro size={24} /> },
      ].map((step, index) => {
        const stepStatuses = ["STEP 1 COMPLETED", "STEP 2 COMPLETED", "KYC COMPLETED"];
        const isCompleted =
          (index === 0 && stepStatuses.includes(kycStatus)) ||
          (index === 1 && ["STEP 2 COMPLETED", "KYC COMPLETED"].includes(kycStatus)) ||
          (index === 2 && kycStatus === "KYC COMPLETED");

        const isCurrent =
          (index === 0 && !stepStatuses.includes(kycStatus)) ||
          (index === 1 && kycStatus === "STEP 1 COMPLETED") ||
          (index === 2 && kycStatus === "STEP 2 COMPLETED");

        const statusColor = isCompleted
          ? "text-success"
          : isCurrent
          ? "text-primary"
          : "text-muted";

        return (
          <div key={index} className="text-center flex-fill position-relative">
            <div className={`mb-2 fs-4 ${statusColor} ${isCurrent ? "glow-step" : ""}`}>
              {isCompleted ? (
                <BsCheckCircleFill color="#198754" size={24} />
              ) : isCurrent ? (
                <BsHourglassSplit color="#0d6efd" size={24} />
              ) : (
                step.icon
              )}
            </div>
            <div className="fw-semibold small text-dark">{step.label}</div>
          </div>
        );
      })}
    </div>
  </motion.div>
)}



        <h4 className="fw-bold mb-4">Our Services</h4>

        <div className="row g-4">
          {services.map((item, index) => (
            <div className="col-lg-3 col-md-6 col-sm-12" key={index}>
              <div className="card service-card shadow-sm border-0 p-3 position-relative h-100 rounded-4">
                {/* Lock icon if KYC not completed */}
                {kycStatus !== "KYC COMPLETED" && (
                  <BsLockFill
                    className="position-absolute"
                    style={{
                      top: "10px",
                      right: "10px",
                      color: "#f08080",
                      fontSize: "16px",
                    }}
                  />
                )}

                <img
                  src={item.serviceIconPath}
                  alt={item.serviceName}
                  className="mb-3"
                  style={{ width: "45px", height: "40px" }}
                />

                <h6 className="fw-bold text-dark mb-1">{item.serviceName}</h6>

                <p className="text-muted small mb-0 text-truncate-2">
                  {kycStatus === "KYC COMPLETED"
                    ? item.serviceDetails
                    : "Complete KYC to access"}
                </p>

                {kycStatus === "KYC COMPLETED" && (
                  <button className="btn btn-outline-primary btn-sm mt-3 w-100 apply-btn">
                    Apply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consent Modal */}
      {showConsentModal && (
        <ConsentForm
          isOpen={showConsentModal}
          onClose={() => setShowConsentModal(false)}
        />
      )}
    </>
  );
};

export default Dashboard;
