import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from "../../utils";
import {
  FiEye,
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiFileText,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

function Profile() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const id = localStorage.getItem("id");
  const [profile, setProfile] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const startTime = Date.now();
        const response = await axios.get(`/user/profile/${id}`);
        const elapsed = Date.now() - startTime;
        const delay = Math.max(1000 - elapsed, 0); // Ensure 2 seconds minimum delay
        setTimeout(() => {
          setProfile(response.data);
        }, delay);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
  
    fetchProfile();
  }, [id]);
  
  

  const openModal = (title, fileUrl) => {
    const isPdf = fileUrl.endsWith('.pdf');
    setModalTitle(title);
    setModalImage({ url: fileUrl, isPdf });
  };
  

  const closeModal = () => {
    setModalImage(null);
    setModalTitle('');
  };
  
  if (!profile)
    return (
      <div className="d-flex align-items-center justify-content-center paddingtop gap-2 mt-5">
        <div className="spinner-grow text-primary" role="status" />
        <span>Loading...</span>
      </div>
    );
  
  const isAdmin = profile.role === 'ADMIN';
  return (
    <div className="container mt-4 paddingtop">
      <div className="card p-4 shadow-sm">
        <div className="d-flex align-items-center mb-4">
          <img
            src={profile.selfieImage || 'https://via.placeholder.com/80'}
            alt="User"
            className="rounded-circle me-3"
            width="100"
            height="100"
          />
          <div>
            <h4 className="mb-0"><FiUser className="me-0" /> <b>{profile.fullName}</b></h4>
            <small className="text-muted"><FiMail className="me-2" /> {profile.email}</small>
          </div>
        </div>
  
        <div className="row g-3">
          <div className="col-md-6">
            <div className="profile-field">
              <div className="profile-label"><FiPhone className="me-1" /> Mobile Number</div>
              <div className="profile-value">{profile.mobile || 'Not available'}</div>
            </div>
          </div>
  
          <div className="col-md-6">
            <div className="profile-field">
              <div className="profile-label"><FiShield className="me-1" /> Role</div>
              <div className="profile-value text-capitalize">{profile.role || 'Not available'}</div>
            </div>
          </div>
        </div>
  
        {!isAdmin && (
          <div className="row g-3 mt-1">
            {/* Remaining fields for non-admins */}
            <div className="col-md-6">
              <div className="profile-field">
                <div className="profile-label"><FiCheckCircle className="me-1" /> KYC Status</div>
                <div className={`profile-value d-flex align-items-center gap-1 ${
                  profile.kycStatus === 'KYC COMPLETED' ? 'text-success' : 'text-danger'
                }`}>
                  {profile.kycStatus === 'KYC COMPLETED' ? <FiCheckCircle /> : <FiXCircle />}
                  {profile.kycStatus || 'Not available'}
                </div>
              </div>
            </div>
  
            <div className="col-md-6">
              <div className="profile-field">
                <div className="profile-label"><FiCalendar className="me-1" /> Date of Birth</div>
                <div className="profile-value">{profile.dob || 'Not available'}</div>
              </div>
            </div>
  
            <div className="col-12">
              <div className="profile-field">
                <div className="profile-label"><FiMapPin className="me-1" /> Address</div>
                <div className="profile-value">{profile.address || 'Not available'}</div>
              </div>
            </div>
  
            <div className="col-md-6">
              <div className="profile-field">
                <div className="profile-label"><FiCreditCard className="me-1" /> Aadhar Number</div>
                <div className="profile-value">
                  {profile.aadharNumber 
                    ? `XXXX-XXXX-${profile.aadharNumber.slice(-4)}`
                    : 'Not available'}
                </div>
                {profile.aadharImage && (
                  <div className="mt-2 d-flex align-items-center gap-2">
                    <span><strong>Aadhar Document:</strong></span>
                    <button
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                      onClick={() => openModal('Aadhar Document', profile.aadharImage)}
                    >
                      <FiEye /> Preview
                    </button>
                  </div>
                )}
              </div>
            </div>
  
            <div className="col-md-6">
              <div className="profile-field">
                <div className="profile-label"><FiFileText className="me-1" /> PAN Number</div>
                <div className="profile-value">
                  {profile.panNumber 
                    ? `XXXXX${profile.panNumber.slice(5)}`
                    : 'Not available'}
                </div>
                {profile.panImage && (
                  <div className="mt-2 d-flex align-items-center gap-2">
                    <span><strong>PAN Document:</strong></span>
                    <button
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                      onClick={() => openModal('PAN Document', profile.panImage)}
                    >
                      <FiEye /> Preview
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
  
      {/* Modal Preview */}
      {modalImage && (
        <div className="modal show d-block" tabIndex="-1" onClick={closeModal} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body text-center">
                {modalImage.isPdf ? (
                  <iframe
                    src={modalImage.url}
                    width="100%"
                    height="500px"
                    title="PDF Preview"
                    className="border rounded"
                  ></iframe>
                ) : (
                  <img src={modalImage.url} alt={modalTitle} className="img-fluid rounded border" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
