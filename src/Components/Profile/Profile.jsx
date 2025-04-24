import React, { useEffect, useState } from 'react';
import './Profile.css'; // Make sure this CSS file is included

function Profile() {
const id=localStorage.getItem("id")
console.log(id )
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9999/auth/profile/${id}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error('Failed to load profile:', err));
  }, []);

  if (!profile) return <div className="text-muted p-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <div className="d-flex align-items-center mb-4">
          <img
            src={profile.selfieImage || 'https://via.placeholder.com/80'}
            alt="User"
            className="rounded-circle me-3"
            width="80"
            height="80"
          />
          <div>
            <h5 className="mb-0">{profile.fullName}</h5>
            <small className="text-muted">{profile.email}</small>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <div className="profile-field">
              <div className="profile-label">Mobile Number</div>
              <div className="profile-value">{profile.mobile || 'Not available'}</div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="profile-field">
              <div className="profile-label">Role</div>
              <div className="profile-value text-capitalize">{profile.role || 'Not available'}</div>
            </div>
          </div>

          <div className="col-md-6">
  <div className="profile-field">
    <div className="profile-label">KYC Status</div>
    <div
      className={`profile-value ${
        profile.kycStatus && profile.kycStatus === 'KYC COMPLETED' ? 'text-success' : 'text-danger'
      }`}
    >
      ● {profile.kycStatus || 'Not available'}
    </div>
  </div>
</div>


          <div className="col-md-6">
            <div className="profile-field">
              <div className="profile-label">Date of Birth</div>
              <div className="profile-value">{profile.dob || 'Not available'}</div>
            </div>
          </div>

          <div className="col-12">
            <div className="profile-field">
              <div className="profile-label">Address</div>
              <div className="profile-value">{profile.address || 'Not available'}</div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="profile-field">
              <div className="profile-label">Aadhar Number</div>
              <div className="profile-value">{profile.aadharNumber || 'Not available'}</div>
              <img
                src={profile.aadharImage || 'https://via.placeholder.com/150?text=Aadhar+Image'}
                alt="Aadhar"
                className="img-fluid mt-2 rounded border"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="profile-field">
              <div className="profile-label">PAN Number</div>
              <div className="profile-value">{profile.panNumber || 'Not available'}</div>
              <img
                src={profile.panImage || 'https://via.placeholder.com/150?text=PAN+Image'}
                alt="PAN"
                className="img-fluid mt-2 rounded border"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
