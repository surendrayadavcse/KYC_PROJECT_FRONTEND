import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../Redux/userSlice";
import otpReducer from "../../Redux/otpSlice"
import serviceReducer from "../../Redux/serviceSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    otp: otpReducer,
    services: serviceReducer
  },
});
