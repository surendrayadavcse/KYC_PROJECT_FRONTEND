
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const KycContext = createContext();
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const KycProvider = ({ children }) => {
  const [kycStatus, setKycStatus] = useState(null);
  const [isKycFetched, setIsKycFetched] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("id"));

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId !== userId) {
      setUserId(storedId);
    }
  }, [userId]);

  const fetchKycStatus = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${baseUrl}/user/kycstatus/${userId}`);
      const status = response.data.kycStatus;
      setKycStatus(status);
      setIsKycFetched(true);
    } catch (error) {
      console.error("Error fetching kycStatus:", error);
      setIsKycFetched(true);
    }
  };

  useEffect(() => {
    if (userId) fetchKycStatus();
  }, [userId]);

  return (
    <KycContext.Provider value={{ kycStatus, setKycStatus, fetchKycStatus, isKycFetched }}>
      {children}
    </KycContext.Provider>
  );
};

export const useKyc = () => useContext(KycContext);
