import React from "react";
import { Navigate } from "react-router-dom";
import { useKyc } from "../context/KycContext";

const ProtectedRoute = ({ allowedStatuses, allowedRoles = [], children }) => {
  const { kycStatus } = useKyc();

  const userId = localStorage.getItem("id");
  const role = localStorage.getItem("role");

  if (!userId) return <Navigate to="/login" replace />;
  if (!kycStatus) return <div>Loading...</div>;

  // ✅ Check role if allowedRoles is specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedStatuses.includes(kycStatus)) {
    return children;
  }

  // Redirect based on KYC status
  switch (kycStatus) {
    case "PENDING":
      return <Navigate to="/basicdetails" replace />;
    case "STEP 1 COMPLETED":
      return <Navigate to="/uploaddocuments" replace />;
    case "STEP 2 COMPLETED":
      return <Navigate to="/uploadselfie" replace />;
    case "KYC COMPLETED":
      return children;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default ProtectedRoute;
