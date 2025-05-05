// src/App.jsx

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Register from "../src/Components/Register/Register";
import Login from "./Components/Login/LoginPage";
import Dashboard from "./Components/Dashboard/Dashboard";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import Profile from "./Components/Profile/Profile";
import Navbar from "./Components/SharedComponents/Navbar";
import ConsentForm from "./Components/Consent/ConsentForm";
import DataUsage from "./Components/Consent/DataUsage";
import BasicDetails from "./Components/KycComponents/Firststep/BasicDetails";
import DocumentsUpload from "./Components/KycComponents/Secondstep/DocumentsUpload";
import Selfie from "./Components/KycComponents/Thirdstep/Selfie";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./Components/ProtectedRoute"; // ✅ new import

import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./Components/LandingPage/LandingPage";
// import HexaEdgeLandingPage from "./Components/Dashboard/HexaEdgeLandingPage";


function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = [
    "/", 
    "/login", 
    "/register", 
    "/basicdetails", 
    "/uploaddocuments", 
    "/uploadselfie"
  ];

  return (
    <>
   
  {/* navbar content */}

      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
    
    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/consent" element={<ConsentForm />} />
        <Route path="/datausage" element={<DataUsage />} />
        <Route
          path="/basicdetails"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]} allowedStatuses={["PENDING", "STEP 1 COMPLETED", "STEP 2 COMPLETED", "KYC COMPLETED"]}>
              <BasicDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploaddocuments"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]} allowedStatuses={["STEP 1 COMPLETED", "STEP 2 COMPLETED", "KYC COMPLETED"]}>
              <DocumentsUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadselfie"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]} allowedStatuses={["STEP 2 COMPLETED", "KYC COMPLETED"]}>
              <Selfie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]} allowedStatuses={["PENDING", "STEP 1 COMPLETED", "STEP 2 COMPLETED", "KYC COMPLETED"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
     <Route
  path="/admindashboard"
  element={
    <ProtectedRoute
      allowedStatuses={["PENDING", "STEP 1 COMPLETED", "STEP 2 COMPLETED", "KYC COMPLETED"]}
      allowedRoles={["ADMIN"]} // ✅ Restrict to ADMIN role
    >
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedStatuses={["PENDING", "STEP 1 COMPLETED", "STEP 2 COMPLETED", "KYC COMPLETED"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
  
      <ToastContainer position="middle" autoClose={2000} />
    </>
  );
}


function App() {
  return (
    <div className="bg-light min-vh-100">
      <Router>
        <AppWrapper />
      </Router>
    </div>
  );
}

export default App;
