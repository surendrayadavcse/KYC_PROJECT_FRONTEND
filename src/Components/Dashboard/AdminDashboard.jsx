import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllServices, addService } from '../../Redux/serviceSlice';
import axios from '../../utils';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: services, error } = useSelector((state) => state.services);

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [iconPreview, setIconPreview] = useState(null);
  const [kycStats, setKycStats] = useState({
    totalUsers: 0,
    newRegistrations: 0,
    kycCompletedUsers: 0,
    pendingUsers: 0
  });

  const usersPerPage = 10;

  useEffect(() => {
    dispatch(fetchAllServices());

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/user/getallcustomers');
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get('/user/kycstatistics');
        setKycStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchUsers();
    fetchStats();
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`services/delete/${id}`);
      dispatch(fetchAllServices());
    } catch (err) {
      alert(err);
    }
  };

  const handleServiceAdd = (e) => {
    e.preventDefault();
    const form = e.target;
    const serviceName = form.serviceName.value;
    const serviceDetails = form.description.value;
    const iconFile = form.icon.files[0];

    dispatch(addService({ serviceName, serviceDetails, iconFile }));
    dispatch(fetchAllServices());
    form.reset();
    setIconPreview(null);
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    setIconPreview(file ? URL.createObjectURL(file) : null);
  };

 const filteredUsers = users
  .filter((user) => {
    if (filter === 'All') return true;
    if (filter === 'PENDING') {
      return ['PENDING', 'STEP 1 COMPLETED', 'STEP 2 COMPLETED'].includes(user.kycStatus);
    }
    return user.kycStatus === filter;
  })
  .filter((user) =>
    user.fullName.toLowerCase().includes(nameFilter.toLowerCase())
  );


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNum) => setCurrentPage(pageNum);

  return (
    <div className="bg-light min-vh-100 py-4 ">
      <div className="container paddingtopadmin">

        {/* Stats */}
        <div className="row text-center mb-4">
          {[
            { title: 'New Registrations', count: kycStats.newRegistrations, icon: 'bi bi-person-plus', color: 'primary' },
            { title: 'KYC Approved', count: kycStats.kycCompletedUsers, icon: 'bi bi-check-circle', color: 'success' },
            { title: 'Pending KYC', count: kycStats.pendingUsers, icon: 'bi bi-clock', color: 'warning' },
            { title: 'Total Users', count: kycStats.totalUsers, icon: 'bi bi-people', color: 'info' },
          ].map((card, i) => (
            <div key={i} className="col-md-3 mb-3">
              <div className="card shadow-sm rounded-4 bg-white border-0">
                <div className="card-body">
                  <i className={`${card.icon} fs-3 text-${card.color}`}></i>
                  <h5 className="mt-2">{card.count}</h5>
                  <p className="mb-0 small text-muted">{card.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter + Search */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="nav nav-pills">
            {['All', 'PENDING', 'KYC COMPLETED'].map((status) => (
              <button
                key={status}
                className={`nav-link me-2 ${filter === status ? 'active' : ''}`}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                }}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="input-group" style={{ maxWidth: '250px' }}>
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              value={nameFilter}
              onChange={(e) => {
                setNameFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* User Table */}
        <div className="card shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Reg Date</th><th>Kyc Status</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>
  {new Date(user.registereddate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(/ /g, '-')}
</td>
                    <td>
                      <span className={`badge bg-${user.kycStatus === 'KYC COMPLETED' ? 'success' : 'warning'}`}>
                        {user.kycStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-end my-3">
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link border-0 bg-transparent cursor-pointer" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNum => {
                  if (currentPage <= 2) return pageNum <= 3;
                  if (currentPage >= totalPages - 1) return pageNum >= totalPages - 2;
                  return pageNum >= currentPage - 1 && pageNum <= currentPage + 1;
                })
                .map((pageNum) => (
                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(pageNum)}>
                      {pageNum}
                    </button>
                  </li>
                ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link border-0 bg-transparent " style={{ cursor: 'pointer' }} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Add Service */}
        <div className="card shadow-sm rounded-4 p-4 my-4 bg-white">
          <h5 className="mb-4">Add New Service</h5>
          <form onSubmit={handleServiceAdd}>
            <div className="row g-3">
              <div className="col-md-4">
                <input type="text" name="serviceName" className="form-control" placeholder="Enter service name" required />
              </div>
              <div className="col-md-4 d-flex align-items-center gap-2">
                <input type="file" name="icon" className="form-control" onChange={handleIconChange} />
                {iconPreview && (
                  <img
                    src={iconPreview}
                    alt="Preview"
                    className="rounded"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                )}
              </div>
              <div className="col-md-12">
                <textarea name="description" className="form-control" rows="3" placeholder="Enter service description" required></textarea>
              </div>
            </div>
            <button className="btn btn-primary mt-3" type="submit">Add Service</button>
          </form>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>

        {/* Service Cards */}
        <div className="row">
          {services.map((service, i) => (
            <div className="col-md-3 mb-4" key={i}>
              <div className="card position-relative shadow-sm rounded-4 h-100 p-3 bg-white">
                <button
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
                  onClick={() => handleDelete(service.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
                {service.serviceIconPath ? (
                  <img
                    src={service.serviceIconPath}
                    alt="Service Icon"
                    className="mb-3"
                    style={{ width: '70px', height: '70px', objectFit: 'contain', margin: 'auto' }}
                  />
                ) : (
                  <i className="bi bi-gear fs-1 text-muted mb-3"></i>
                )}
                <h6 className="fw-bold">{service.serviceName}</h6>
                <p className="text-muted small">
                  {service.serviceDetails.length > 65
                    ? `${service.serviceDetails.substring(0, 65)}...`
                    : service.serviceDetails}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
