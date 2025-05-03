import React, { useRef, useState, useEffect } from 'react';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils';
import KycLayout from '../Shared/KycLayout';
import { useKyc } from '../../../context/KycContext';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Selfie() {
  const { setKycStatus } = useKyc();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStarted, setCameraStarted] = useState(false);

  const [imageSrc, setImageSrc] = useState(null);
  const [aiMessage, setAiMessage] = useState('');
  const [aiPassed, setAiPassed] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isSelfieCaptured, setIsSelfieCaptured] = useState(false);
  const [isSelfieSubmitted, setIsSelfieSubmitted] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('id');

  const cameraRef = useRef(null);
  const faceDetectionRef = useRef(null);

  useEffect(() => {
    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: 'short',
      minDetectionConfidence: 0.7,
    });

    faceDetection.onResults(onResults);
    faceDetectionRef.current = faceDetection;

    if (!isSelfieCaptured) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && faceDetectionRef.current) {
            await faceDetectionRef.current.send({ image: videoRef.current });
          }
        },
        width: 480,
        height: 360,
      });
      camera.start();
      cameraRef.current = camera;
    }

    return () => {
      cameraRef.current?.stop();
    };
  }, [isSelfieCaptured]);

  const onResults = (results) => {
    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    if (results.detections.length === 1) {
      setAiMessage('Face detected ✅ Good to go!');
      setAiPassed(true);
    } else if (results.detections.length > 1) {
      setAiMessage('⚠️ Multiple faces detected. Only one face allowed.');
      setAiPassed(false);
    } else {
      setAiMessage('⚠️ No face detected. Please show your face properly.');
      setAiPassed(false);
    }
    canvasCtx.restore();
  };

  const captureSelfie = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setImageSrc(canvas.toDataURL('image/png'));

    cameraRef.current?.stop();
    setIsSelfieCaptured(true);
  };

  const reset = () => {
    setImageSrc(null);
    setAiMessage('');
    setAiPassed(false);
    setUploadStatus('');
    setIsSelfieCaptured(false);
    setIsSelfieSubmitted(false);

    // Restart camera
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current && faceDetectionRef.current) {
          await faceDetectionRef.current.send({ image: videoRef.current });
        }
      },
      width: 480,
      height: 360,
    });
    camera.start();
    cameraRef.current = camera;
  };

  useEffect(() => {
    const fetchSelfie = async () => {
      try {
        const res = await axios.get(`/kyc/selfie/${userId}`);
        if (res.data && res.data.includes('selfie')) {
          setImageSrc(res.data);
          setAiPassed(true);
          setUploadStatus('Selfie already uploaded');
          setIsSelfieCaptured(true);
          setIsSelfieSubmitted(true);
        }
      } catch (error) {
        console.log('No existing selfie found:', error?.response?.data || error.message);
      }
    };

    fetchSelfie();
  }, [userId]);

  const submitSelfie = async () => {
    const blob = await (await fetch(imageSrc)).blob();
    const formData = new FormData();
    formData.append('userId', Number(userId));
    formData.append('file', blob, 'selfie.png');

    try {
      const response = await axios.post(`kyc/selfie`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus(response.data);
      setKycStatus('KYC COMPLETED');
      setIsSelfieSubmitted(true);
    } catch (err) {
      setUploadStatus(err.response?.data || 'Upload failed');
    }
  };

  const handleSubmitFinish = () => {
    if (!isSelfieSubmitted) {
      alert('Please upload your selfie before finishing.');
      return;
    }
    setKycStatus('KYC COMPLETED');
    localStorage.setItem('kycStatus', 'KYC COMPLETED');
    navigate('/dashboard');
  };

  return (
    <KycLayout>
      <div className="container d-flex justify-content-center mt-4">
        <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
          <h4 className="mb-3">Upload Your Live Selfie</h4>
          <p className="text-muted">Please allow camera access to capture your selfie clearly.</p>

          <div
            className="d-flex align-items-center justify-content-center mb-4"
            style={{
              width: '250px',
              height: '250px',
              border: `3px solid ${aiPassed ? '#28a745' : '#00A9FF'}`,
              borderRadius: '50%',
              background: '#f8f9fa',
              overflow: 'hidden',
              position: 'relative',
              margin: '0 auto',
            }}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Selfie Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                ></video>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </>
            )}
          </div>

          <AnimatePresence>
            {aiMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`mb-3 px-3 py-2 rounded-3 fw-semibold small ${
                  aiPassed ? 'text-success border border-success' : 'text-danger border border-danger'
                }`}
                style={{ backgroundColor: aiPassed ? '#e9f8f1' : '#fbe9e9' }}
              >
                {aiMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {!isSelfieSubmitted ? (
            !imageSrc ? (
              <button className="btn btn-primary w-100 mb-3" onClick={captureSelfie}>
                📸 Capture Selfie
              </button>
            ) : (
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-success" onClick={submitSelfie} disabled={!aiPassed}>
                  Use This Selfie
                </button>
                <button className="btn btn-outline-dark" onClick={reset}>
                  Retake
                </button>
              </div>
            )
          ) : (
            <div className="text-center text-success mb-3">
              Selfie successfully verified! ✅
            </div>
          )}

          {uploadStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 fw-bold text-center ${
                uploadStatus.includes('success') ? 'text-success' : 'text-danger'
              }`}
            >
              {uploadStatus}
            </motion.div>
          )}

          <div className="mt-4 d-flex justify-content-between align-items-center">
            <button className="btn btn-primary" onClick={() => navigate('/uploaddocuments')}>
              Back to Document Upload
            </button>
            <button
              onClick={handleSubmitFinish}
              className="btn btn-primary"
              disabled={!isSelfieSubmitted}
            >
              Submit & Finish ➔
            </button>
          </div>
        </div>
      </div>
    </KycLayout>
  );
}

export default Selfie;
