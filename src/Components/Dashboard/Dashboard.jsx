import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../SharedComponents/Navbar";
const Dashboard = () => {
  const user = useSelector((state) => state.user);
 



  return (
    <>
    <Navbar></Navbar>
    <div className="container mt-4">
      <h2>Welcome, {user.user ? user.user.fullName : "User"}</h2>
      <p>Role: {user.role}</p>
      
    </div></>
  );
};

export default Dashboard;
