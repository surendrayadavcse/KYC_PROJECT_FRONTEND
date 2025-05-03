import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
export  const sendOtpThunk = createAsyncThunk(
  'otp/sendOtp',
  async ({ email, mobile }, thunkAPI) => {
    try {
      console.log(mobile, "i am from thunk");
      await axios.get(`${baseUrl}/getOTP/${email}?mobile=${mobile}`);
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
      const res = await axios.post(`${baseUrl}/verifyOTP`, { email, otp });
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
    otpLoading: false
  },
  reducers: {
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
      state.otperror = null;
      state.otpLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle sendOtpThunk
      .addCase(sendOtpThunk.pending, (state) => {
        state.otpLoading = true;
        state.otperror = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpSent = true;
        state.otperror = null;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.otpLoading = false;
        state.otperror = action.payload;
      })

      // Handle verifyOtpThunk
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.otperror = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
        state.otperror = null;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.otpVerified = false;
        state.otperror = action.payload;
      });
  }
});

export const { resetOtpState } = otpSlice.actions;
export default otpSlice.reducer;