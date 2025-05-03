import React, { useState, useEffect } from 'react';
import { logout } from '../../Redux/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMdArrowDropdown, IoMdLogOut } from "react-icons/io";
import { FaUserCircle } from 'react-icons/fa';
function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(false);

const role = localStorage.getItem("role");
const storedName = localStorage.getItem("name");
const fullName = storedName ? storedName.trim() : "User";
const lastName = fullName.split(" ").slice(-1)[0];
// console.log(lastName,)
  useEffect(() => {
    // Set selected true when at /profile, false otherwise
    if (location.pathname === "/profile") {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfileToggle = () => {
    if (selected) {
      // When unselecting profile
      if (role === "ADMIN") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      // When selecting profile
      navigate("/profile");
    }
  };
  

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-4 position-relative">
      <div className="container">

        {/* Left: Logo */}
        <span className="navbar-brand fw-bold text-primary">
          Hexa<span className="text-dark">Edge</span>
        </span>

        {/* Center: Dashboard/Profile Text */}
        <div className="d-none d-lg-block mx-auto">
          <span className="text-secondary small fw-bold text-uppercase">
            {selected ? 'Profile' : 'Dashboard'}
          </span>
        </div>

        {/* Right: Profile Button */}
        <div className="d-flex align-items-center ms-auto position-relative">
          <button
            onClick={handleProfileToggle}
            className="d-flex align-items-center rounded-pill px-3 py-2 border-1"
            style={{
              backgroundColor: selected ? '#007BFF' : 'white',
              color: selected ? 'white' : 'blue',
              minWidth: '150px',
              border: '1px solid #dee2e6',
            }}
          >
           <FaUserCircle size={30} className="me-2 " style={{ cursor: 'pointer' }} />

           <div className="text-start me-2">
  <div className="fw-bold medium text-black">{lastName}</div>
  {role === 'ADMIN' && (
    <div className="small" style={{ fontSize: '0.7rem' }}>{role}</div>
  )}
</div>


            {/* Dropdown Icon */}
            <span onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
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
                <IoMdLogOut className="me-1" /> Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
