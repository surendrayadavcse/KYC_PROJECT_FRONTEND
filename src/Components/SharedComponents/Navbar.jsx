import React from 'react'
import { logout } from '../../Redux/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function Navbar() {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const handlelogout = () => {
        dispatch(logout());
        navigate("/login");
      };
  return (
    <>
    
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-3">
  <div className="container">
    <span className="navbar-brand fw-bold text-primary">FinEdge</span>
    <span className="navbar-text text-secondary">Admin Dashboard</span>

    <div className="d-flex align-items-center ms-auto">
  <button className="border-0 bg-transparent text-primary fs-5 me-3">
    <i className="bi bi-person-circle"></i>
  </button>
  <button onClick={handlelogout} className="border-0 bg-transparent text-danger fs-5">
    <i className="bi bi-box-arrow-right"></i>
  </button>
</div>


  </div>
</nav>
    </>
  )
}

export default Navbar