import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../Redux/userSlice";
import otpReducer from "../../Redux/otpSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    otp: otpReducer,
  },
});
