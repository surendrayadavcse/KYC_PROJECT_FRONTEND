import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendOtpThunk = createAsyncThunk(
  'otp/sendOtp',
  async ({email,mobile}, thunkAPI) => {
    try {
      console.log(mobile,"i am from thunk")
      await axios.get(`http://localhost:9999/api/getOTP/${email}?mobile=${mobile}`);
      return;
    } catch (err) {
      console.log(err.response?.data?.message || err.message, "Error log");
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);


export const verifyOtpThunk = createAsyncThunk(
  'otp/verifyOtp',
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:9999/api/verifyOTP", { email, otp });
      if (res.data.message === "OTP verified successfully") return true;
      else throw new Error("Invalid OTP");
    } catch (err) {
      return thunkAPI.rejectWithValue("Invalid OTP. Please try again.");
    }
  }
);

const otpSlice = createSlice({
  name: 'otp',
  initialState: {
    otpSent: false,
    otpVerified: false,
    otperror: null,
  },
  reducers: {
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtpThunk.fulfilled, (state) => {
        state.otpSent = true;
        state.otperror = null;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.otperror = action.payload;
        console.log(action.payload)
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.otpVerified = true;
        state.otperror = null;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.otpVerified = false;
        state.otperror = action.payload;
      });
  }
});

export const { resetOtpState } = otpSlice.actions;
export default otpSlice.reducer;
