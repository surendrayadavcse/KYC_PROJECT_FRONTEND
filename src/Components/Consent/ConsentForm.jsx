// ConsentForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataUsage from './DataUsage';
import axios from '../../utils'; // ✅ Use custom instance
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ConsentForm = ({ isOpen, onClose }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isDataUsageModalOpen, setIsDataUsageModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const openDataUsageModal = () => setIsDataUsageModalOpen(true);
  const closeDataUsageModal = () => setIsDataUsageModalOpen(false);

  const handleConsentSubmit = async () => {
    setLoading(true);
    const userId = localStorage.getItem("id");

    const consentRequestDTO = {
      userId: userId,
      consentGiven: agreedToTerms,
    };

    try {
      const response = await axios.post(`/consent/submit`, consentRequestDTO);
      console.log('Consent submitted:', response.data);
      localStorage.setItem("consentGiven", "true");
      navigate('/basicdetails');
    } catch (error) {
      console.error('Error submitting consent:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal JSX */}
      <div
        className={`modal fade show d-block ${isOpen ? 'show' : ''}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="consentModalLabel"
        aria-hidden={!isOpen}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="consentModalLabel">
                <i className="bi bi-shield-lock me-2 text-primary"></i>
                Before You Begin
              </h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <p className="text-muted text-center mb-4">
                To complete your KYC, we require your consent to collect, verify,
                and store your personal details as per regulatory guidelines.
              </p>

              <div className="mb-4">
                <div className="mb-3">
                  <span
                    className="text-primary cursor-pointer"
                    style={{ fontWeight: 500 }}
                    onClick={openDataUsageModal}
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
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
              <button
                className="btn btn-primary"
                onClick={handleConsentSubmit}
                disabled={!agreedToTerms || loading}
              >
                {loading ? 'Submitting...' : 'Continue to KYC'}
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Usage Modal */}
      <DataUsage isOpen={isDataUsageModalOpen} onClose={closeDataUsageModal} />
    </>
  );
};

export default ConsentForm;
