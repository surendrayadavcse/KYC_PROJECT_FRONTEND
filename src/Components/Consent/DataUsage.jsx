import React from 'react';
import { Modal } from 'react-bootstrap';

const DataUsage = ({ isOpen, onClose }) => {
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      
      backdrop="static"
      contentClassName="border-0"
      dialogClassName=""
      style={{ padding: '0 16px' }}
    >
      <div
        style={{
          width: '100%',
          minWidth: '550px',
          margin: 'auto',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        }}
      >
        <div className="modal-header border-0 pb-0">
          <h3 className="modal-title w-100 text-center mb-0" style={{ color: '#2a3254' }}>
            <i className="bi bi-database-shield me-2 text-primary"></i>
            How We Use Your Data
          </h3>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>

        <div className="modal-body px-4 pt-0">
          <div className="row g-4">
            {[
              {
                icon: 'bi-person-vcard',
                title: 'Personal Details',
                desc: 'Collected to verify identity and ensure regulatory compliance. Includes name, DOB, and address.',
              },
              {
                icon: 'bi-file-earmark-check',
                title: 'Document Verification',
                desc: 'Aadhaar/PAN used strictly for government compliance and identity verification.',
              },
              {
                icon: 'bi-shield-lock',
                title: 'Data Security',
                desc: 'Enterprise-grade encryption and security protocols protecting your information.',
              },
              {
                icon: 'bi-graph-up',
                title: 'Data Usage',
                desc: 'Never shared with third parties without explicit consent. Regular audits conducted.',
              },
            ].map((item, idx) => (
              <div className="col-md-6" key={idx}>
                <div
                  className="card h-100 border-0 shadow-sm"
                  style={{
                    borderRadius: '16px',
                    padding: '16px',
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title text-primary">
                      <i className={`bi ${item.icon} me-2`}></i>
                      {item.title}
                    </h5>
                    <p className="text-muted small mb-0">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer border-0 justify-content-center">
          <button
            onClick={onClose}
            className="btn btn-primary px-4"
            style={{ height: '40px' }}
          >
            Got It!
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DataUsage;
