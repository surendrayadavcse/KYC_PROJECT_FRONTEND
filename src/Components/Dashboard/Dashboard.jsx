import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import Navbar from "../SharedComponents/Navbar";
import { fetchAllServices } from "../../Redux/serviceSlice";
import { BsLockFill } from "react-icons/bs"; // Lock icon
import { FiShield } from "react-icons/fi";
import { BsFillLockFill } from "react-icons/bs";
import ConsentForm from "../Consent/ConsentForm"
import "./Dashboard.css" 
const Dashboard = () => {
  const Kycstatus = localStorage.getItem("kycstatus");
  const { list: services } = useSelector((state) => state.services);
  const dispatch = useDispatch();
  const [showConsentModal, setShowConsentModal] = useState(false); // State for modal visibility

  useEffect(() => {
    dispatch(fetchAllServices());
  }, [dispatch]);

  const handleStartKYC = () => {
    setShowConsentModal(true); // Open the consent modal when button is clicked
  };

  return (
    <>
      <div className="container mt-4 ">
        {Kycstatus === "KYC COMPLETED" && (
          <div className="alert alert-success d-flex align-items-center p-4 mb-4 rounded shadow">
            <div className="me-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="green"
                className="bi bi-check-circle-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 10.03a.75.75 0 0 0 1.07 0l3.992-3.992a.75.75 0 1 0-1.06-1.06L7.5 8.439 5.53 6.47a.75.75 0 1 0-1.06 1.06l2.5 2.5z"
                />
              </svg>
            </div>
            <div>
              <h5 className="mb-1 fw-bold">KYC Verification Successful!</h5>
              <p className="mb-0 text-success">
                You’ve successfully completed your KYC. All services are now unlocked for you.
              </p>
            </div>
          </div>
        )}

        {Kycstatus !== "KYC COMPLETED" && (
          <div className="d-flex justify-content-between align-items-center p-4 mb-4 rounded shadow-sm bg-white border">
            <div>
              <h5 className="text-primary fw-bold mb-2">Action Required</h5>
              <p className="mb-0 text-dark">
                Complete your KYC Verification to unlock access to all services.
              </p>
              <button className="btn btn-primary mt-3" onClick={handleStartKYC}>
                Start KYC Verification
              </button>
            </div>

            {/* Shield with Lock */}
            <div
              className="d-flex justify-content-center align-items-center rounded"
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#0d47a1", // dark blue
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

        <h4 className="fw-bold mb-4">Our Services</h4>

        <div className="row g-4">
          {services.map((item, index) => (
            <div className="col-lg-3 col-md-6 col-sm-12" key={index}>
             <div className="card service-card shadow-sm border-0 p-3 position-relative h-100 rounded-4">

                {/* Lock icon if KYC not completed */}
                {Kycstatus !== "KYC COMPLETED" && (
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

                {/* Service Icon */}
                <img
                  src={item.serviceIconPath}
                  alt={item.serviceName}
                  className="mb-3"
                  style={{ width: "45px", height: "40px" }}
                />

                {/* Service Name */}
                <h6 className="fw-bold text-dark mb-1">{item.serviceName}</h6>

                {/* Description */}
                <p className="text-muted small mb-0 text-truncate-2">
                  {Kycstatus === "KYC COMPLETED"
                    ? item.serviceDetails
                    : "Complete KYC to access"}
                </p>
                {Kycstatus === "KYC COMPLETED"? <button className="btn btn-outline-primary btn-sm mt-3 w-100 apply-btn">
  Apply
</button>:""}

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conditionally render the ConsentForm modal */}
      {showConsentModal && <ConsentForm isOpen={showConsentModal} onClose={() => setShowConsentModal(false)} />}

    </>
  );
};

export default Dashboard;
