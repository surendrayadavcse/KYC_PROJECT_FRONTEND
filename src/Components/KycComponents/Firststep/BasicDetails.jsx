  import React, { useState, useEffect } from "react";
  import axios from "../../../utils";
  import { useNavigate } from "react-router-dom";
  import KycLayout from "../Shared/KycLayout";
  import { useKyc } from "../../../context/KycContext";

  import {
    FiCalendar,
    FiHome,
    FiMapPin,
    FiNavigation,
    FiArrowRight,
    FiSave,
    FiMap,
    FiArrowLeft,
  } from "react-icons/fi";

  const BasicDetails = () => {
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [isReadOnly, setIsReadOnly] = useState(false);

    const navigate = useNavigate();

    const [dob, setDob] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const { setKycStatus } = useKyc();
    const userId = localStorage.getItem("id");

    // Fetch user data on component mount
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const res = await axios.get(`/user/addressdob/${userId}`);
          const { address, dob } = res.data;
    
          if (address || dob) {
            setIsReadOnly(true); // Make fields read-only if data exists
          }
    
          if (address) {
            const parts = address.split(",").map((s) => s.trim());
            const stateWithPin = parts.pop(); // Last item
            const [stateName, pin] = stateWithPin.split(" - ").map((s) => s.trim());
          
            setState(stateName || "");
            setPincode(pin || "");
          
            // Assign remaining parts safely
            setHouseNo(parts[0] || "");
            setStreet(parts[1] || "");
            setCity(parts[2] || "");
          }
          
    
          if (dob) {
            setDob(dob);
          }
        } catch (error) {
          console.error("Failed to fetch existing user details", error);
        }
      };
    
    
      fetchUserDetails();
    }, [userId]);
    console.log(houseNo,street,city,state,pincode,"jashj")
    

    const isAlpha = (str) => /^[A-Za-z\s]+$/.test(str);

    const validateFields = () => {
      const errors = {};
      if (!dob) errors.dob = "Date of birth is required.";
      if (!houseNo) errors.houseNo = "House number is required.";
      if (!street) errors.street = "Street name is required.";
      if (!city || !isAlpha(city)) errors.city = "Please enter a valid city (only alphabets).";
      if (!state || !isAlpha(state)) errors.state = "Please enter a valid state (only alphabets).";
      if (!pincode) errors.pincode = "Pincode is required.";
      else if (!/^\d{6}$/.test(pincode)) errors.pincode = "Please enter a valid 6-digit pincode.";

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateFields()) return;

      const mergedAddress = `${houseNo}, ${street}, ${city}, ${state} - ${pincode}`;

      try {
        const payload = {
          id: Number(userId),
          dob,
          address: mergedAddress,
        };

        await axios.patch(`/user/basicdetails`, payload);

        setKycStatus("STEP 1 COMPLETED");
        navigate("/uploaddocuments");
      } catch (error) {
        console.error("Error updating details:", error);
        setErrorMessage("Failed to submit details. Please try again.");
      }
    };

    const handleSaveAndExit = async () => {
      if (!validateFields()) {
        setShowModal(true);
        return;
      }

      const mergedAddress = `${houseNo}, ${street}, ${city}, ${state} - ${pincode}`;
      try {
        const payload = {
          id: Number(userId),
          dob,
          address: mergedAddress,
        };
        console.log(payload,"payload")
        await axios.patch("/user/basicdetails", payload);
        setKycStatus("STEP 1 COMPLETED");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error saving details:", error);
        setErrorMessage("Failed to save details. Please try again.");
      }
    };

    const closeModal = () => {
      setShowModal(false);
      setErrorMessage("");
    };
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    const maxDateString = maxDate.toISOString().split('T')[0];
    return (
      <KycLayout>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="card shadow p-4 rounded-5 border-0">
                <h3
                  className="mb-4 d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/dashboard")}
                >
                  <FiArrowLeft className="me-2 text-primary" />
                  Enter Basic Details
                </h3>

                <form onSubmit={handleSubmit}>
                <div className="mb-3">
      <label className="form-label">
        <FiCalendar className="me-1" />
        Date of Birth
      </label>
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="form-control"
        max={maxDateString} // Restrict to 18 years ago
      />
      {formErrors.dob && <div className="text-danger">{formErrors.dob}</div>}
    </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <FiHome className="me-1" />
                      House / Flat No
                    </label>
                    <input
                      type="text"
                      value={houseNo}
                      onChange={(e) => setHouseNo(e.target.value)}
                      className="form-control"
                      placeholder="Enter house or flat number"
                      readOnly={isReadOnly}
                    />
                    {formErrors.houseNo && <div className="text-danger">{formErrors.houseNo}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <FiMapPin className="me-1" />
                      Street / Area
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="form-control"
                      placeholder="Enter street name or locality"
                      readOnly={isReadOnly}
                    />
                    {formErrors.street && <div className="text-danger">{formErrors.street}</div>}
                  </div>

                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">
                        <FiMap className="me-1" />
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="form-control"
                        placeholder="City"
                        readOnly={isReadOnly}
                      />
                      {formErrors.city && <div className="text-danger">{formErrors.city}</div>}
                    </div>
                    <div className="col">
                      <label className="form-label">
                        <FiNavigation className="me-1" />
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="form-control"
                        placeholder="State"
                        readOnly={isReadOnly}
                      />
                      {formErrors.state && <div className="text-danger">{formErrors.state}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <FiMapPin className="me-1" />
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="form-control"
                      placeholder="Enter pincode"
                      readOnly={isReadOnly}
                    />
                    {formErrors.pincode && <div className="text-danger">{formErrors.pincode}</div>}
                  </div>

                  <button
                
                    type="submit"
                    className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
                  >
                    Next <FiArrowRight />
                  </button>

                  {!isReadOnly && (
    <div
      className="text-center mt-3 text-secondary"
      style={{ cursor: "pointer" }}
      onClick={() => setShowModal(true)}
    >
      <FiSave className="me-1" />
      Save & Exit
    </div>
  )}

                </form>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content rounded-4">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Exit</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  {errorMessage ? (
                    <p className="text-danger">{errorMessage}</p>
                  ) : (
                    <p>Are you sure you want to save and exit? Your entered details will be saved.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveAndExit}>
                    Yes, Save & Exit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </KycLayout>
    );
  };

  export default BasicDetails;
