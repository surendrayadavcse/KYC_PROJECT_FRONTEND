import React, { useState } from "react";
import axios from "axios";
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
  FiUser,
  FiArrowLeft
} from "react-icons/fi";

const BasicDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const [dob, setDob] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const { setKycStatus } = useKyc();
  const userId = localStorage.getItem("id");

  // Helper function for validating city and state
  const isAlpha = (str) => /^[A-Za-z\s]+$/.test(str); // Only alphabetic and spaces

  // Validate all fields
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

  // Handle form submission for the "Next" button
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return; // Don't submit if validation fails

    const mergedAddress = `${houseNo}, ${street}, ${city}, ${state} - ${pincode}`;

    try {
      const payload = {
        id: Number(userId),
        dob,
        address: mergedAddress,
      };

      await axios.patch(
        "http://localhost:9999/api/user/uploadbasicdetails",
        payload
      );

      setKycStatus("STEP 1 COMPLETED");
      navigate("/uploaddocuments");
    } catch (error) {
      console.error("Error updating details:", error);
      setErrorMessage("Failed to submit details. Please try again.");
    }
  };

  // Handle save and exit functionality
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
      await axios.patch(
        "http://localhost:9999/api/user/uploadbasicdetails",
        payload
      );
      setKycStatus("STEP 1 COMPLETED");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving details:", error);
      setErrorMessage("Failed to save details. Please try again.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setErrorMessage("");  // Clear error message when modal is closed
  };

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
                    required
                  />
                  {formErrors.dob && (
                    <div className="text-danger">{formErrors.dob}</div>
                  )}
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
                    required
                  />
                  {formErrors.houseNo && (
                    <div className="text-danger">{formErrors.houseNo}</div>
                  )}
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
                    required
                  />
                  {formErrors.street && (
                    <div className="text-danger">{formErrors.street}</div>
                  )}
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
                      required
                    />
                    {formErrors.city && (
                      <div className="text-danger">{formErrors.city}</div>
                    )}
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
                      required
                    />
                    {formErrors.state && (
                      <div className="text-danger">{formErrors.state}</div>
                    )}
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
                    required
                  />
                  {formErrors.pincode && (
                    <div className="text-danger">{formErrors.pincode}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
                >
                  Next <FiArrowRight />
                </button>

                <div
                  className="text-center mt-3 text-secondary"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowModal(true)}
                >
                  <FiSave className="me-1" />
                  Save & Exit
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Exit</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {errorMessage ? (
                  <p className="text-danger">{errorMessage}</p>
                ) : (
                  <p>
                    Are you sure you want to save and exit? Your entered details
                    will be saved.
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveAndExit}
                >
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
