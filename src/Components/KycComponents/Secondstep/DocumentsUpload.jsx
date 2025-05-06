import React, { useState, useRef, useEffect } from 'react';
import { FaCloudUploadAlt, FaTimesCircle } from 'react-icons/fa';
import { MdOutlineVerified } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import KycLayout from '../Shared/KycLayout';
import './DocumentsUpload.css';
import { useKyc } from '../../../context/KycContext';
import { FiArrowLeft } from 'react-icons/fi';
import { Modal, Button } from 'react-bootstrap';
import { openDB } from 'idb';
import { FaFilePdf } from 'react-icons/fa';

import axios from '../../../utils';


import { FaInfoCircle } from 'react-icons/fa';
function DocumentsUpload() {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const openInfoModal = () => {
    setShowInfoModal(true); // Open modal when icon is clicked
  };
  const navigate = useNavigate();
  const { setKycStatus } = useKyc();
  const userId = localStorage.getItem("id");
  const [showExitModal, setShowExitModal] = useState(false);
  
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
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [panVerified, setPanVerified] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpType, setOtpType] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [aadhaarUploading, setAadhaarUploading] = useState(false);
  const [panUploading, setPanUploading] = useState(false);
  const [isStep2Completed, setIsStep2Completed] = useState(false);
  const [otpError, setOtpError] = useState('');

  const [otpVerifying, setOtpVerifying] = useState(false);

  const aadhaarInputRef = useRef(null);
  const panInputRef = useRef(null);

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

  useEffect(() => {
    const fetchKycDetails = async () => {
      try {
        const { data } = await axios.get(`/kyc/documentsdata/${userId}`);
        console.log(data, "i a data");
  
        if (data?.aadharNumber) {
          setAadhaarNumber(data.aadharNumber);
          setAadhaarPreview(data.aadharImageUrl);
          setAadhaarVerified(true);
        }
  
        if (data?.panNumber) {
          setPanNumber(data.panNumber);
          setPanPreview(data.panImageUrl);
          setPanVerified(true);
        }
  
        if (data?.aadharNumber && data?.panNumber) {
          setIsStep2Completed(true);
        }
  
      } catch (err) {
        console.error("Failed to fetch KYC details:", err);
      }
    };
  
    fetchKycDetails();
  }, []);
  

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

  const handleAadhaarClick = () => {
    if (!aadhaarPreview && !isStep2Completed) aadhaarInputRef.current.click();
  };

  const handlePanClick = () => {
    if (!panPreview && !isStep2Completed) panInputRef.current.click();
  };

  const handleAadhaarUpload = async (e) => {
    if (isStep2Completed) return;
    const file = e.target.files[0];
    if (file) {
      setAadhaarFile(file);
      setAadhaarPreview(URL.createObjectURL(file));
      await saveToIndexedDB('aadhaar', file, {});
      await uploadAadhaar(file);
    }
  };

  const handlePanUpload = async (e) => {
    if (isStep2Completed) return;
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
      const { data } = await axios.post(`/kyc/aadhar`, formData);
      setAadhaarMessage(data.message);
      setAadhaarNumber(data.extractedText);
      setAadhaarError(false);
      await saveToIndexedDB('aadhaar', file, { extractedText: data.extractedText, verified: false });
    } catch (error) {
      setAadhaarMessage(error.response?.data || 'Upload failed');
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
      const response = await axios.post(`/kyc/pan`, formData);
      console.log(response)
      setPanMessage(response.data.message);
      setPanNumber(response.data.extractedText);
      setPanError(false);
      await saveToIndexedDB('pan', file, { extractedText: response.data.extractedText, verified: false });
    } catch (error) {
      console.log(error)
      setPanMessage(error.response?.data|| 'Upload failed');
      setPanError(true);
    } finally {
      setPanUploading(false);
    }
  };

  const removeAadhaar = async () => {
    if (isStep2Completed) return;
    await removeFromIndexedDB('aadhaar');
    setAadhaarFile(null);
    setAadhaarPreview(null);
    setAadhaarMessage('');
    setAadhaarNumber('');           // <--- Clear OCR text
    setAadhaarVerified(false);      // <--- Reset verification
    setAadhaarError(false);
    aadhaarInputRef.current.value = null;
  };
  
  const removePan = async () => {
    if (isStep2Completed) return;
    await removeFromIndexedDB('pan');
    setPanFile(null);
    setPanPreview(null);
    setPanMessage('');
    setPanNumber('');               // <--- Clear OCR text
    setPanVerified(false);         // <--- Reset verification
    setPanError(false);
    panInputRef.current.value = null;
  };
  

  const openOtpModal = async (type) => {
    if (isStep2Completed) return;
    setOtpType(type);
    setOtp('');
    setModalOpen(true);
    setOtpSent(true);
    setTimer(30);

    try {
      const res = await axios.get(`user/getemailbyid/${userId}`);
      const email = res.data;
      const otpEndpoint = type === 'pan' ? '/getotpforpan' : '/getotpfordoc';
      await axios.get(`${otpEndpoint}/${email}`);
      
    } catch (err) {
      alert("Failed to send OTP.");
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
    setOtpVerifying(true);
    setOtpError('');
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("otp", otp);
  
    let endpoint = "";
    if (otpType === 'aadhaar' && aadhaarFile) {
      formData.append("aadharImage", aadhaarFile);
      endpoint = "verifyotpfordoc";
    } else if (otpType === 'pan' && panFile) {
      formData.append("panImage", panFile);
      endpoint = "verifyotpforpan";
    } else {
      setOtpError("No document uploaded.");
      setOtpVerifying(false);
      return;
    }
  
    try {
      await axios.post(`/${endpoint}`, formData);
      setModalOpen(false);
      if (otpType === 'aadhaar') {
        setAadhaarMessage("Aadhaar verified successfully!");
        setAadhaarVerified(true);
        await removeFromIndexedDB('aadhaar');
      } else {
        setPanMessage("PAN verified successfully!");
        setPanVerified(true);
        await removeFromIndexedDB('pan');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setOtpVerifying(false);
    }
  };
  
  

  const checkDocumentsUploaded = async () => {
    if (isStep2Completed || (aadhaarFile && panFile)) {
      await removeFromIndexedDB('aadhaar');
      await removeFromIndexedDB('pan');
      setKycStatus("STEP 2 COMPLETED");
      navigate('/uploadselfie');
    } else {
      alert("Please upload both Aadhaar and PAN.");
    }
  };
  
  

  const resendOtp = async () => {
    setOtpSent(true);
    setTimer(30);
    try {
      const res = await axios.get(`user/getemailbyid/${userId}`);
      const email = res.data;
      const otpEndpoint = otpType === 'pan' ? '/getotpforpan' : '/getotpfordoc';
await axios.get(`${otpEndpoint}/${email}`);
        
    } catch (err) {
      alert("Failed to resend OTP.");
    }
  };
  
  const handleSaveAndExit = async () => {
    if (aadhaarFile) {
      await saveToIndexedDB('aadhaar', aadhaarFile, { extractedText: aadhaarNumber, verified: aadhaarVerified });
    }
    if (panFile) {
      await saveToIndexedDB('pan', panFile, { extractedText: panNumber, verified: panVerified });
    }
    setShowExitModal(false);
    navigate('/dashboard'); // or wherever you want to exit
  };
  
  return (
    <KycLayout>
      <div className="document-upload-container container-fluid d-flex justify-content-center align-items-center">
        <div className="document-upload-card p-5">
          <h3 className="mb-4 d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => navigate("/basicdetails")}>
            <FiArrowLeft className="me-2 text-primary" /> Upload Your Documents
          </h3>
          <p className="mb-4 text-muted d-flex align-items-center">
            Please upload your Aadhaar and PAN cards to proceed with the verification.
            <FaInfoCircle 
              size={20} 
              style={{ marginLeft: '10px', cursor: 'pointer' }} 
              onClick={openInfoModal} 
            />
          </p>

          {/* Aadhaar Upload */}


          <div className="upload-box mb-3" onClick={handleAadhaarClick}>
  {aadhaarPreview ? (
    <>
  {aadhaarFile?.type === 'application/pdf' ? (
  <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
  <FaFilePdf  style={{ color: 'red', fontSize: '24px' }} />
    <span className="text-sm text-gray-700">PDF file uploaded</span>
  </div>
) : (
  <img src={aadhaarPreview} alt="Aadhaar Preview" className="upload-preview" />
)}
      {!isStep2Completed && <FaTimesCircle className="upload-remove" onClick={removeAadhaar} />}
    </>
  ) : (
    <>
      <FaCloudUploadAlt size={50} className="upload-icon" />
      <p className="upload-text">Upload Aadhaar Card</p>
      <p className="upload-subtext">Please upload a clear image of your Aadhaar card</p>
      
    </>
  )}
  <input type="file" accept="image/*,application/pdf" onChange={handleAadhaarUpload} ref={aadhaarInputRef} className="d-none" />
</div>


          {aadhaarMessage && <div className={`mb-3 ${aadhaarError ? 'text-danger' : 'text-success'}`}>{aadhaarMessage}</div>}
          {aadhaarNumber && (
  <div className="input-group mb-4">
    <input readOnly type="text" className="form-control" value={aadhaarNumber} />
    <Button variant="primary" disabled={aadhaarVerified || isStep2Completed} onClick={() => openOtpModal('aadhaar')}>
      {aadhaarVerified ? <><MdOutlineVerified className="me-1" /> Verified</> : 'Verify'}
    </Button>
  </div>
)}


          {/* PAN Upload */}
          <div className="upload-box mb-3" onClick={handlePanClick}>
  {panPreview ? (
    <>
      {panFile?.type === 'application/pdf' ? (
        <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
          <FaFilePdf style={{ color: 'red', fontSize: '24px' }} />
          <span className="text-sm text-gray-700">PDF file uploaded</span>
        </div>
      ) : (
        <img src={panPreview} alt="PAN Preview" className="upload-preview" />
      )}
      {!isStep2Completed && <FaTimesCircle className="upload-remove" onClick={removePan} />}
    </>
  ) : (
    <>
      <FaCloudUploadAlt size={50} className="upload-icon" />
      <p className="upload-text">Upload PAN Card</p>
      <p className="upload-subtext">Please upload a clear image or PDF of your PAN card</p>
    </>
  )}
  <input type="file" accept="image/*,application/pdf" onChange={handlePanUpload} ref={panInputRef} className="d-none" />
</div>

          {panMessage && <div className={`mb-3 ${panError ? 'text-danger' : 'text-success'}`}>{panMessage}</div>}
          {panNumber && (
  <div className="input-group mb-4">
    <input readOnly type="text" className="form-control" value={panNumber} />
    <Button variant="primary" disabled={panVerified || isStep2Completed} onClick={() => openOtpModal('pan')}>
      {panVerified ? <><MdOutlineVerified className="me-1" /> Verified</> : 'Verify'}
    </Button>
  </div>
)}


          <div className="d-flex justify-content-between mt-4">
          {!isStep2Completed && (
  <button className="btn btn-outline-secondary" onClick={() => setShowExitModal(true)}>
    Save & Exit
  </button>
)}

            <button 
  className="btn btn-primary w-50"
  onClick={checkDocumentsUploaded}
>
  Next ➔
</button>

          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered size='md'>
  <Modal.Body>
    <p className="mb-3">We have sent an OTP to your registered mobile/email.</p>
    <input
      className="form-control mb-2"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      maxLength={6}
    />
    {otpError && <p className="text-danger mb-2">{otpError}</p>}
    {timer > 0 ? (
      <button className="text-muted btn btn-primary">Resend OTP in {timer}s</button>
    ) : (
      <Button variant="btn btn-primary" onClick={resendOtp}>Resend OTP</Button>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={otpVerifying}>Cancel</Button>
    <Button variant="success" onClick={handleVerifyOtp} disabled={otpVerifying}>
      {otpVerifying ? 'Verifying...' : (<><MdOutlineVerified className="me-1" /> Verify</>)}
    </Button>
  </Modal.Footer>
</Modal>
<Modal show={showExitModal} onHide={() => setShowExitModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Save and Exit?</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>Your uploaded documents will be saved locally. You can resume later from where you left off.</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowExitModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleSaveAndExit}>Save & Exit</Button>
  </Modal.Footer>
</Modal>
<Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered >
  <Modal.Header closeButton>
    <Modal.Title>Document Upload Instructions</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <h5 className="mb-3">Valid Aadhar Card Upload Samples</h5>

    <p><strong>1. Full-Length Traditional Aadhar (Front + Back):</strong></p>
    <img
      src="fullaadhar.jpg"
      alt="Full Aadhar Card Sample"
      style={{ width: "100%", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ccc" }}
    />

    <p><strong>2. Half Aadhar (Front & Back Combined in One Image):</strong></p>
    <img
      src="validaadharhalf.JPG"
      alt="Half Aadhar Combined Sample"
      style={{ width: "100%", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ccc" }}
    />

    

    <ul>
      <li>You may upload either a full-length or a combined front+back Aadhar card image.</li>
      <li>If uploading front and back separately, please upload both images clearly.</li>
      <li>Make sure your name, date of birth, Aadhar number, and address are visible.</li>
      <li>Do not upload blurred, cropped, or unclear images.</li>
    </ul>

    <h5 className="mt-4 mb-3">Valid PAN Card Upload Sample</h5>
    <img
      src="pancardsample.jpg"
      alt="PAN Card Sample"
      style={{ width: "100%", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ccc" }}
    />
    <ul>
      <li>Upload the front side of your PAN card.</li>
      <li>Ensure name, PAN number, date of birth, and photo are clearly visible.</li>
      <li>Accepted formats: JPG, PNG, or PDF</li>
    </ul>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowInfoModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


    </KycLayout>
  );
}

export default DocumentsUpload;
