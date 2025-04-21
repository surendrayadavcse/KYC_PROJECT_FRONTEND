import React from 'react';
import { logout } from '../../Redux/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-3">
        <div className="container">
          
          {/* Left: Logo */}
          <span className="navbar-brand fw-bold text-primary">
            Fin<span className="text-dark">Edge</span>
          </span>
          
          {/* Center: Dashboard */}
          <div className="d-none d-lg-block mx-auto">
            <span className="text-secondary small fw-bold text-uppercase">
              Dashboard
            </span>
          </div>

          {/* Right: Profile and Logout */}
          <div className="d-flex align-items-center ms-auto">
            <img 
              src="https://i.pravatar.cc/30" 
              alt="Profile" 
              className="rounded-circle me-2" 
              width="30" 
              height="30"
            />
            <span className="me-2 text-dark small fw-bold d-none d-sm-inline">John Doe</span>
            <button onClick={handleLogout} className="border-0 bg-transparent text-danger fs-6 d-flex align-items-center">
            <IoMdLogOut />
              <span className="ms-1 small d-none d-sm-inline">Logout</span>
            </button>
          </div>

        </div>
      </nav>
    </>
  );
}

export default Navbar;
