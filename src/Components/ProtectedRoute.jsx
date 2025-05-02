import React from "react";
import { Navigate } from "react-router-dom";
import { useKyc } from "../context/KycContext";

const ProtectedRoute = ({ allowedStatuses, children }) => {
  const { kycStatus } = useKyc();
  // console.log(kycStatus," ")
  const userId = localStorage.getItem("id");

  if (!userId) return <Navigate to="/login" replace />;

  if (!kycStatus) return <div>Loading...</div>; // or spinner

  console.log(kycStatus, "i am from protected");

  if (allowedStatuses.includes(kycStatus)) {
    return children;
  }

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
