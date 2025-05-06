import React, { useEffect, useState } from "react";
import { Check, UploadCloud, Camera } from "lucide-react";

import axios from "../../utils";
import "./KycTracker.css";

const steps = [
  {
    label: "Basic Details",
    key: "STEP 1 COMPLETED",
    icon: <Check color="white" size={24} />,
    tooltip: "Your personal info is submitted.",
  },
  {
    label: "Upload Documents",
    key: "STEP 2 COMPLETED",
    icon: <UploadCloud color="white" size={24} />,
    tooltip: "Your Aadhaar and PAN are uploaded.",
  },
  {
    label: "Live Selfie",
    key: "KYC COMPLETED",
    icon: <Camera color="white" size={24} />,
    tooltip: "Your selfie has been verified.",
  },
];

const KycTracker = () => {
  const [kycStatus, setKycStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userId=localStorage.getItem("id")

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const response = await axios.get(`/user/kycstatus/${userId}`);
        setKycStatus(response.data.kycStatus);
      } catch (err) {
        console.error("Error fetching KYC status:", err);
        setError("Failed to load KYC status");
      } finally {
        setLoading(false);
      }
    };
    fetchKycStatus();
  }, [userId]);

  const getStepOrder = (status) => {
    const order = {
      PENDING: 0,
      "STEP 1 COMPLETED": 1,
      "STEP 2 COMPLETED": 2,
      "KYC COMPLETED": 3,
    };
    return order[status] || 0;
  };

  const currentStep = getStepOrder(kycStatus);

  const getStatusText = (stepIndex) => {
    if (stepIndex < currentStep) return "Completed";
    if (stepIndex === currentStep) return "In Progress";
    return "Pending";
  };

  if (loading)
    return <div className="text-center my-5 text-white">Loading...</div>;
  if (error)
    return <div className="text-center text-danger my-5">{error}</div>;

  return (
    <div className="kyc-tracker-container d-flex flex-column align-items-center justify-content-center">
      <div className="kyc-steps position-relative">
        <div className="kyc-line"></div>

        {steps.map((step, index) => {
          const status = getStatusText(index).toLowerCase().replace(" ", "-");
          const wrapperClass = index < currentStep
            ? "completed"
            : index === currentStep
            ? "in-progress"
            : "pending";

          return (
            <div key={index} className="kyc-step">
              <div className={`kyc-icon-wrapper ${wrapperClass}`}>
                {step.icon}
                <div className="tooltip">{step.tooltip}</div>
              </div>
              <div className="kyc-step-details ms-3">
                <div className="kyc-step-title">{step.label}</div>
                <div className={`kyc-step-status ${status}`}>
                  {getStatusText(index)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KycTracker;
