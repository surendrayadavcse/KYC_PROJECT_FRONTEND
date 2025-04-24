import React, { useState } from 'react';
import { logout } from '../../Redux/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleSelect = () => {
    setSelected(!selected);
    setDropdownOpen(false); // Close dropdown if switching
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Stop the button click from also triggering select
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-4 position-relative">
        <div className="container">
          
          {/* Left: Logo */}
          <span className="navbar-brand fw-bold text-primary">
            Hexa<span className="text-dark">Edge</span>
          </span>

          {/* Center: Dashboard/Profile */}
          <div className="d-none d-lg-block mx-auto">
            <span className="text-secondary small fw-bold text-uppercase">
              {selected ? 'Profile' : 'Dashboard'}
            </span>
          </div>

          {/* Right: Profile and Dropdown */}
          <div className="d-flex align-items-center ms-auto position-relative">
            <button 
              onClick={toggleSelect} 
              className="d-flex align-items-center rounded-pill px-3 py-2 border-1"

              style={{ 
                backgroundColor: selected ? '#007BFF' : 'white', 
                color: selected ? 'white' : 'black', 
                minWidth: '150px' ,
                border: selected ? '1px solid #dee2e6' : '1px solid #dee2e6',
              
              }}
            >
              <img 
                src="https://i.pravatar.cc/30" 
                alt="Profile" 
                className="rounded-circle me-2" 
                width="30" 
                height="30"
              />
              <div className="text-start me-2">
                <div className="fw-bold small">Karthick</div>
                <div className="small" style={{ fontSize: '0.7rem' }}>Admin</div>
              </div>
              
              {/* Dropdown Icon */}
              <span onClick={toggleDropdown}>
                <IoMdArrowDropdown size={20} />
              </span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div 
                className="position-absolute mt-2 p-2 bg-white shadow rounded" 
                style={{ right: 0, top: '100%', minWidth: '150px', zIndex: 10 }}
              >
                <button 
                  onClick={handleLogout} 
                  className="dropdown-item text-danger small text-center border-0 bg-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}

export default Navbar;
