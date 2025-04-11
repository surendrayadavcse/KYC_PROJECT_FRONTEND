import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../src/Components/Register/Register";
import Login from "./Components/Login/LoginPage";
import Dashboard from "./Components/Dashboard/Dashboard";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";

function App() {
  return (
    <Router>  
      <Routes>
      <Route path="/" element={<Register />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
