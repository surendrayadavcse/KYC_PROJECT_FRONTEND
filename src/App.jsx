import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../src/Components/Register/Register";
import Login from "./Components/Login/LoginPage";
import Dashboard from "./Components/Dashboard/Dashboard";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
    <div className="bg-light min-vh-100 ">
    <Router>  
      <Routes>
      <Route path="/" element={<Register />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard/>}></Route>
      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={2000} />
    </div>
    </>
  );
}

export default App;
