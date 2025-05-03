import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../Redux/userSlice";
import otpReducer from "../../Redux/otpSlice"
import serviceReducer from "../../Redux/serviceSlice"
import kycreducer from "../../Redux/kycstatus"
export const store = configureStore({
  reducer: {
    user: userReducer,
    otp: otpReducer,
    services: serviceReducer, 
    kyc:kycreducer
  },
});
