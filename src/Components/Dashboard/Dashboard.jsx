import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/userSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <h2>Welcome, {user.user ? user.user.fullName : "User"}</h2>
      <p>Role: {user.role}</p>
      <button onClick={handleLogout} className="btn btn-danger">Logout</button>
    </div>
  );
};

export default Dashboard;
