import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../src/Components/Register/Register";
import Login from "./Components/Login/LoginPage";
import DataUsage from "./Components/DataUsage";
import ConsentForm from "./Components/ConsentForm";
import Dashboard from "./Components/Dashboard/Dashboard";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
    <Router>  
      <Routes>
      <Route path="/" element={<Register />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/consent" element={<ConsentForm />} />
        <Route path="/datausage" element={<DataUsage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard/>}></Route>
      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
