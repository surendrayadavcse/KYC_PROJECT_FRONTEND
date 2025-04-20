import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllServices, addService } from '../../Redux/serviceSlice';
import axios from 'axios';
import "./AdminDashboard"
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { list: services, error } = useSelector((state) => state.services);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All'); // All, Pending, Approved
  const [currentPage, setCurrentPage] = useState(1);
  const [iconPreview, setIconPreview] = useState(null);
  const usersPerPage = 5;

  useEffect(() => {
    dispatch(fetchAllServices());

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:9999/auth/customers');
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [dispatch]);
  async function  handleDelete(id){
    try{
      const response=await axios.delete(`http://localhost:9999/api/services/delete/${id}`)
      console.log(response.data)
      dispatch(fetchAllServices());
      return response

    }
    catch(err){
      alert(err)
    }
  }
  const handleServiceAdd = (e) => {
    e.preventDefault();
    const form = e.target;
    const serviceName = form.serviceName.value;
    const serviceDetails = form.description.value;
    const iconFile = form.icon.files[0];

    dispatch(addService({ serviceName, serviceDetails, iconFile }));
  
    form.reset();
    setIconPreview(null);
    dispatch(fetchAllServices());
  };

  // Filtered users based on tab selection
  const filteredUsers = users.filter((user) => {
    if (filter === 'All') return true;
    return user.kycStatus === filter;
  });
  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconPreview(URL.createObjectURL(file));
    } else {
      setIconPreview(null);
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNum) => setCurrentPage(pageNum);

  return (
    <div className="container py-4">
      <h4 className="text-primary fw-bold">FinEdge</h4>
      <h5 className="text-center mb-4">ADMIN DASHBOARD</h5>

      {/* Stats cards */}
      <div className="row text-center mb-4">
        {[
          { title: 'New Registrations', count: 2847, change: '+2.5%', icon: 'bi bi-person-plus', color: 'primary' },
          { title: 'KYC Approved', count: 1923, change: '+4.2%', icon: 'bi bi-check-circle', color: 'success' },
          { title: 'Pending KYC', count: 924, change: 'Waiting', icon: 'bi bi-clock', color: 'warning' },
          { title: 'Total Users', count: 12847, change: 'Active', icon: 'bi bi-people', color: 'info' },
        ].map((card, i) => (
          <div key={i} className="col-md-3 mb-3">
            <div className={`card border-${card.color} shadow-sm`}>
              <div className="card-body">
                <i className={`bi ${card.icon} fs-3 text-${card.color}`}></i>
                <h5 className="mt-2">{card.count}</h5>
                <p className="mb-0 small text-muted">{card.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {['All', 'PENDING', 'APPROVED'].map((status) => (
          <li className="nav-item" key={status}>
            <button
              className={`nav-link ${filter === status ? 'active' : ''}`}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
            >
              {status}
            </button>
          </li>
        ))}
      </ul>

      {/* User Table */}
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Reg Date</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>1</td>
              <td>{user.fullName}</td>
          
              <td>{user.email}</td>
              {/* <td>12/13/2025</td> */}
              <td>{user.date}</td>
              <td>
                <span className={`badge bg-${user.kycStatus === 'APPROVED' ? 'success' : 'warning'}`}>
                  {user.kycStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

   
     {/* Pagination Controls */}
<div className="d-flex justify-content-end my-3">
  <nav>
    <ul className="pagination mb-0">
      {/* Previous Button */}
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </button>
      </li>

      {/* Dynamic Page Numbers */}
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

      {/* Next Button */}
      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </button>
      </li>
    </ul>
  </nav>
</div>

      {/* Add Service Form */}
      <div className="card p-4 my-4">
        <h5>Add New Service</h5>
        <form onSubmit={handleServiceAdd}>
          <div className="row g-3">
            <div className="col-md-4">
              <input type="text" name="serviceName" className="form-control" placeholder="Enter service name" required />
            </div>
            <div className="col-md-4 d-flex align-items-center gap-2">
  <input 
    type="file" 
    name="icon" 
    className="form-control" 
    onChange={handleIconChange} 
    style={{ maxWidth: '70%' }} 
  />
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
    
    {/* Services List */}
<div className="row">
  {services.map((service, i) => (
    <div className="col-md-3 mb-4" key={i}>
      <div className="card position-relative shadow-sm rounded-4 h-100 p-3">
        
        {/* Delete Icon */}
        <button 
          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
          style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => handleDelete(service.id)} // Uncomment when you create delete function
        >
          <i className="bi bi-trash"></i>
        </button>

        {/* Icon */}
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

        {/* Name */}
        <h6 className="fw-bold">{service.serviceName}</h6>

        {/* Details */}
        <p className="text-muted small">{service.serviceDetails}</p>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default AdminDashboard;
