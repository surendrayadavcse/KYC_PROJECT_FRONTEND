import React from "react";
import KycTracker from "../../KycTracker/KycTracker";
import "./KycLayout.css"; // Import the external CSS file

const KycLayout = ({ children }) => {
  return (
    <div className="container-fluid min-vh-100 d-flex flex-column flex-md-row p-0">
      {/* Left side: Tracker */}
      <div className="sidebar">
        <KycTracker />
      </div>

      {/* Right side: KYC Steps */}
      <div className="content">
        <div className="w-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default KycLayout;
