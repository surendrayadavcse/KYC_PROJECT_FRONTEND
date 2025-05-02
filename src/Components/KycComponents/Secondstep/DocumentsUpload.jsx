

import React, { useState, useRef, useEffect } from 'react';
import { FaCloudUploadAlt, FaTimesCircle } from 'react-icons/fa';
import { MdOutlineVerified } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import KycLayout from '../Shared/KycLayout';
import './DocumentsUpload.css';
import { useKyc } from '../../../context/KycContext';
import { FiArrowLeft } from 'react-icons/fi';
import { Modal, Button } from 'react-bootstrap';
import { openDB } from 'idb';
import instance from '../../utils';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const getDb = async () => {
  return openDB('kyc-docs', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('documents')) {
        db.createObjectStore('documents');
      }
    },
  });
};

function DocumentsUpload() {
  const navigate = useNavigate();
  const { setKycStatus } = useKyc();
  const userId = localStorage.getItem("id");

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const [panPreview, setPanPreview] = useState(null);
  const [aadhaarMessage, setAadhaarMessage] = useState('');
  const [panMessage, setPanMessage] = useState('');
  const [aadhaarError, setAadhaarError] = useState(false);
  const [panError, setPanError] = useState(false);
  const aadhaarInputRef = useRef(null);
  const panInputRef = useRef(null);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpType, setOtpType] = useState(''); // 'aadhaar' or 'pan'
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [aadhaarUploading, setAadhaarUploading] = useState(false);
const [panUploading, setPanUploading] = useState(false);

  useEffect(() => {
    const loadStoredFiles = async () => {
      const aadhaarDoc = await getFromIndexedDB('aadhaar');
      const panDoc = await getFromIndexedDB('pan');
  
      if (aadhaarDoc) {
        setAadhaarFile(aadhaarDoc.file);
        setAadhaarPreview(URL.createObjectURL(aadhaarDoc.file));
        setAadhaarNumber(aadhaarDoc.extractedText || '');
        setAadhaarVerified(aadhaarDoc.verified || false);
      }
  
      if (panDoc) {
        setPanFile(panDoc.file);
        setPanPreview(URL.createObjectURL(panDoc.file));
        setPanNumber(panDoc.extractedText || '');
        setPanVerified(panDoc.verified || false);
      }
    };
    loadStoredFiles();
  }, []);
  

 // IndexedDB utilities
const getDB = async () => {
  return await openDB('KycDocumentsDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('documents')) {
        db.createObjectStore('documents', { keyPath: 'type' });
      }
    },
  });
};

const saveToIndexedDB = async (type, file, data) => {
  const db = await getDB();
  await db.put('documents', {
    type,
    file,
    ...data,
  });
};

const getFromIndexedDB = async (type) => {
  const db = await getDB();
  return await db.get('documents', type);
};

const removeFromIndexedDB = async (type) => {
  const db = await getDB();
  await db.delete('documents', type);
};


  const handleAadhaarClick = () => !aadhaarPreview && aadhaarInputRef.current.click();
  const handlePanClick = () => !panPreview && panInputRef.current.click();

  const handleAadhaarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAadhaarFile(file);
      setAadhaarPreview(URL.createObjectURL(file));
      await saveToIndexedDB('aadhaar', file, {});  // Fixed
      await uploadAadhaar(file);
    }
  };
  

  const handlePanUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPanFile(file);
      setPanPreview(URL.createObjectURL(file));
      await saveToIndexedDB('pan', file, {});
      await uploadPan(file);
    }
  };
  

  const uploadAadhaar = async (file) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', file);
    setAadhaarUploading(true);
    setAadhaarMessage('Uploading...');
  
    try {
      const { data } = await axios.post(`${baseUrl}/kyc/uploadaadhar`, formData);
      console.log(data.message)
      setAadhaarMessage(data.message);
      setAadhaarNumber(data.extractedText);
      setAadhaarError(false);
      await saveToIndexedDB('aadhaar', file, { extractedText: data.extractedText, verified: false });
    } catch (error) {
      console.log(error)
      setAadhaarMessage(error.response.data);
      setAadhaarError(true);
    } finally {
      setAadhaarUploading(false);
    }
  };
  
  const uploadPan = async (file) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', file);
    setPanUploading(true);
    setPanMessage('Uploading...');
  
    try {
      const response = await axios.post(`${baseUrl}/kyc/uploadpan`, formData);
      setPanMessage(response.data.message);
      setPanNumber(response.data.extractedText);
      setPanError(false);
      await saveToIndexedDB('pan', file, { extractedText: response.data.extractedText, verified: false });
    } catch (error) {
      setPanMessage(error.response.data.message);
      setPanError(true);
    } finally {
      setPanUploading(false);
    }
  };
  

  const removeAadhaar = async () => {
    const db = await getDb();
    await db.delete('documents', 'aadhaar');
    setAadhaarFile(null);
    setAadhaarPreview(null);
    setAadhaarMessage('');
    setAadhaarError(false);
    aadhaarInputRef.current.value = null;
  };

  const removePan = async () => {
    const db = await getDb();
    await db.delete('documents', 'pan');
    setPanFile(null);
    setPanPreview(null);
    setPanMessage('');
    setPanError(false);
    panInputRef.current.value = null;
  };

  const openOtpModal = async (type) => {
    setOtpType(type);
    setOtp('');
    setModalOpen(true);
    setOtpSent(true);
    setTimer(30);

    // const email = "surendrayada143@gmail.com"
    try {
      const res=await instance.get(`user/getemailbyid/${userId}`)
      const email=res.data

      await axios.get(`${baseUrl}/getotpfordoc/${email}`);
    } catch (err) {
      alert("Failed to send OTP. Please try again.");
      setModalOpen(false);
    }
  };

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleVerifyOtp = async () => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("otp", otp);
  
    let endpoint = "";
  
    if (otpType === 'aadhaar' && aadhaarFile) {
      formData.append("aadharImage", aadhaarFile);
      endpoint = "verifyotpfordoc"; // Aadhaar endpoint
    } else if (otpType === 'pan' && panFile) {
      formData.append("panImage", panFile);
      endpoint = "verifyotpforpan"; // PAN endpoint
    } else {
      alert("No document uploaded");
      return;
    }
  
    try {
      await axios.post(`${baseUrl}/${endpoint}`, formData);
      setModalOpen(false);
      if (otpType === 'aadhaar') {
        setAadhaarMessage("Aadhaar OTP verified and document saved successfully!");
        setAadhaarError(false);
        setAadhaarVerified(true);
        await saveToIndexedDB('aadhaar', aadhaarFile, { extractedText: aadhaarNumber, verified: true });
      } else {
        setPanMessage("PAN OTP verified and document saved successfully!");
        setPanError(false);
        setPanVerified(true);
        await saveToIndexedDB('pan', panFile, { extractedText: panNumber, verified: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };
  
  

  const resendOtp = () => {
    setOtpSent(true);
    setTimer(30);
  };

  const checkDocumentsUploaded = async () => {
    if (aadhaarFile && panFile) {
      // Clear documents from IndexedDB
      await removeFromIndexedDB('aadhaar');
      await removeFromIndexedDB('pan');
  
      // Optionally clear previews and file state if needed
      setAadhaarFile(null);
      setPanFile(null);
      setAadhaarPreview(null);
      setPanPreview(null);
  
      // Update status and move to next step
      setKycStatus("STEP 2 COMPLETED");
      navigate('/uploadselfie');
    } else {
      alert("Please upload both Aadhaar and PAN.");
    }
  };
   
  return (
    <KycLayout>
      <div className="document-upload-container container-fluid d-flex justify-content-center align-items-center">
        <div className="document-upload-card p-5">
          <h3 className="mb-4 d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => navigate("/basicdetails")}> <FiArrowLeft className="me-2 text-primary" /> Upload Your Documents </h3>
          <p className="mb-4 text-muted">Please upload your Aadhaar and PAN cards to proceed with the verification.</p>

          {/* Aadhaar Upload */}
          <div className="upload-box mb-3" onClick={handleAadhaarClick}>
            {aadhaarPreview ? (
              <>
                <img src={aadhaarPreview} alt="Aadhaar Preview" className="upload-preview" />
                <FaTimesCircle className="upload-remove" onClick={removeAadhaar} />
              </>
            ) : (
              <>
                <FaCloudUploadAlt size={50} className="upload-icon" />
                <p className="upload-text">Upload Aadhaar Card</p>
                <p className="upload-subtext">Please upload a clear image of your Aadhaar card</p>
              </>
            )}
            <input type="file" onChange={handleAadhaarUpload} ref={aadhaarInputRef} className="d-none" />
          </div>

          {aadhaarMessage && <div className={`mb-3 ${aadhaarError ? 'text-danger' : 'text-success'}`}>{aadhaarMessage}</div>}
          <div className="input-group mb-4">
            <input readOnly type="text" className="form-control" placeholder="Enter Aadhaar Number" value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} />
            <Button variant="primary" disabled={aadhaarVerified} onClick={() => openOtpModal('aadhaar')}>
  {aadhaarVerified ? <><MdOutlineVerified className="me-1" /> Verified</> : 'Verify'}
</Button>

          </div>

          {/* PAN Upload */}
          <div className="upload-box mb-3" onClick={handlePanClick}>
            {panPreview ? (
              <>
                <img src={panPreview} alt="PAN Preview" className="upload-preview" />
                <FaTimesCircle className="upload-remove" onClick={removePan} />
              </>
            ) : (
              <>
                <FaCloudUploadAlt size={50} className="upload-icon" />
                <p className="upload-text">Upload PAN Card</p>
                <p className="upload-subtext">Please upload a clear image of your PAN card</p>
              </>
            )}
            <input type="file" onChange={handlePanUpload} ref={panInputRef} className="d-none" />
          </div>

          {panMessage && <div className={`mb-3 ${panError ? 'text-danger' : 'text-success'}`}>{panMessage}</div>}
          <div className="input-group mb-4">
            <input type="text" className="form-control" placeholder="Enter PAN Number" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
            <Button variant="primary" disabled={panVerified} onClick={() => openOtpModal('pan')}>
  {panVerified ? <><MdOutlineVerified className="me-1" /> Verified</> : 'Verify'}
</Button>

          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-outline-secondary">Save & Exit</button>
            <button className="btn btn-primary" onClick={checkDocumentsUploaded}>Next ➔</button>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">We have sent an OTP to your registered mobile/email.</p>
          <input className="form-control mb-3" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
          {timer > 0 ? (
            <p className="text-muted">Resend OTP in {timer}s</p>
          ) : (
            <Button variant="link" onClick={resendOtp}>Resend OTP</Button>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="success" onClick={handleVerifyOtp}> <MdOutlineVerified className="me-1" /> Verify </Button>
        </Modal.Footer>
      </Modal>
    </KycLayout>
  );
}

export default DocumentsUpload;
