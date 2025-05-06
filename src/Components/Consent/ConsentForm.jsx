import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import DataUsage from './DataUsage';
import axios from '../../utils';

const ConsentForm = ({ isOpen, onClose }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isDataUsageModalOpen, setIsDataUsageModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const openDataUsageModal = () => {
    setIsDataUsageModalOpen(true);
  };

  const closeDataUsageModal = () => {
    setIsDataUsageModalOpen(false);
  };

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
   
      navigate('/basicdetails');
    } catch (error) {
      console.error('Error submitting consent:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Consent Form modal should show only if isOpen and DataUsage is not open */}
      <Modal
        show={isOpen && !isDataUsageModalOpen}
        onHide={onClose}
        centered
      
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-shield-lock me-2 text-primary"></i>
            Before You Begin
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted text-center mb-4">
            To complete your KYC, we require your consent to collect, verify,
            and store your personal details as per regulatory guidelines.
          </p>

          <div className="mb-3">
            <span
              className="text-primary"
              role="button"
              style={{ fontWeight: 500 }}
              onClick={openDataUsageModal}
            >
              Learn how we use your data
            </span>
          </div>

          <Form.Check 
            type="checkbox"
            id="termsCheck"
            label={
              <span style={{ color: '#2a3254', fontWeight: 500 }}>
                I agree to the collection and use of my personal information for KYC purposes
              </span>
            }
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleConsentSubmit}
            disabled={!agreedToTerms || loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              <>
                Continue to KYC <i className="bi bi-arrow-right ms-2"></i>
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* DataUsage modal always renders, controls visibility separately */}
      <DataUsage isOpen={isDataUsageModalOpen} onClose={closeDataUsageModal} />
    </>
  );
};

export default ConsentForm;
