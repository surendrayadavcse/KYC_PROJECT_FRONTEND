
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
    if (storedId && storedId !== userId) {
      setUserId(storedId);
    } else if (storedId) {
      fetchKycStatus(); // <- refetch if same ID but might be a fresh login
    }
  }, [userId]);
  

  const refreshKycStatus = () => {
    const storedId = localStorage.getItem("id");
    setUserId(storedId); // this will trigger fetch due to useEffect
  };
  

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
    <KycContext.Provider value={{ kycStatus, setKycStatus, fetchKycStatus, isKycFetched, refreshKycStatus }}>

      {children}
    </KycContext.Provider>
  );
};

export const useKyc = () => useContext(KycContext);
