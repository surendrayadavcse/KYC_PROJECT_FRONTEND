// ConsentForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataUsage from './DataUsage';

const ConsentForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container min-vh-100 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-body p-4 p-md-5">
              <h2 className="mb-4 text-center" style={{ color: '#2a3254' }}>
                <i className="bi bi-shield-lock me-2 text-primary"></i>
                Before You Begin
              </h2>

              <p className="text-muted text-center mb-4">
                To complete your KYC, we require your consent to collect, verify, 
                and store your personal details as per regulatory guidelines.
              </p>

              <div className="mb-4">
                <div className="mb-3">
                  <span 
                    className="text-primary cursor-pointer"
                    style={{ fontWeight: 500 }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Learn how we use your data
                  </span>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    id="termsCheck"
                    style={{ cursor: 'pointer' }}
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    <span style={{ color: '#2a3254', fontWeight: 500 }}>
                      I agree to the collection and use of my personal information for KYC purposes
                    </span>
                  </label>
                </div>
              </div>

              <button
                className="btn w-100 fw-bold btn-primary"
                style={{ 
                  height: '48px',
                  fontSize: '1rem',
                  letterSpacing: '0.5px'
                }}
                onClick={() => navigate('/register')}
                disabled={!agreedToTerms}
              >
                Continue to KYC
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <DataUsage isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ConsentForm;
