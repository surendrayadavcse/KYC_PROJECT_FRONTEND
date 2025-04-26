import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataUsage from './DataUsage';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const ConsentForm = ({ isOpen, onClose }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isDataUsageModalOpen, setIsDataUsageModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);  // To manage the loading state
  const navigate = useNavigate();

  if (!isOpen) return null; // Don't render modal if not open

  const openDataUsageModal = () => {
    setIsDataUsageModalOpen(true); // Open Data Usage modal
  };

  const closeDataUsageModal = () => {
    setIsDataUsageModalOpen(false); // Close Data Usage modal
  };

  const handleConsentSubmit = async () => {
    setLoading(true);
    const userId = "1";  // Replace with dynamic user ID, if applicable

    const consentRequestDTO = {
      userId: userId,
      consentGiven: agreedToTerms,
    };

    try {
      const response = await axios.post(`${baseUrl}/consent/submit`, consentRequestDTO);
      console.log('Consent submitted:', response.data);
      navigate('/register'); // Redirect after consent submission
    } catch (error) {
      console.error('Error submitting consent:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
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
                    onClick={openDataUsageModal} // Open the Data Usage modal here
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
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConsentSubmit} // Submit consent here
                disabled={!agreedToTerms || loading} // Disable button if not agreed or if loading
              >
                {loading ? 'Submitting...' : 'Continue to KYC'}
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Include the DataUsage Modal */}
      <DataUsage isOpen={isDataUsageModalOpen} onClose={closeDataUsageModal} />
    </>
  );
};

export default ConsentForm;
