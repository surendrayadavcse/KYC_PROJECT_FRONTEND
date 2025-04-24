// DataUsage.jsx (Using Bootstrap Modal)
import React from 'react';
import { Modal } from 'react-bootstrap';

const DataUsage = ({ isOpen, onClose }) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <h3 className="mb-0" style={{ color: '#2a3254' }}>
            <i className="bi bi-database-shield me-2 text-primary"></i>
            How We Use Your Data
          </h3>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 pt-0">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  <i className="bi bi-person-vcard me-2"></i>
                  Personal Details
                </h5>
                <p className="text-muted small mb-0">
                  Collected to verify identity and ensure regulatory compliance. 
                  Includes name, DOB, and address.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  <i className="bi bi-file-earmark-check me-2"></i>
                  Document Verification
                </h5>
                <p className="text-muted small mb-0">
                  Aadhaar/PAN used strictly for government compliance 
                  and identity verification.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  <i className="bi bi-shield-lock me-2"></i>
                  Data Security
                </h5>
                <p className="text-muted small mb-0">
                  Enterprise-grade encryption and security protocols 
                  protecting your information.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">
                  <i className="bi bi-graph-up me-2"></i>
                  Data Usage
                </h5>
                <p className="text-muted small mb-0">
                  Never shared with third parties without explicit consent. 
                  Regular audits conducted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center">
        <button
          onClick={onClose}
          className="btn btn-primary px-4"
          style={{ height: '40px' }}
        >
          Got It!
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DataUsage;