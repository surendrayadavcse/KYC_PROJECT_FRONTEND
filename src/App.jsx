import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Register from "../src/Components/Register/Register";
import Login from "./Components/Login/LoginPage";

import Dashboard from "./Components/Dashboard/Dashboard";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import Profile from "./Components/Profile/Profile";
import Navbar from "./Components/SharedComponents/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ConsentForm from "./Components/Consent/ConsentForm";
import DataUsage from "./Components/Consent/DataUsage";

function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register", "/"]; 

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/consent" element={<ConsentForm />} />
        <Route path="/datausage" element={<DataUsage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
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
