import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  kycStatus: '',
  loading: false,
  error: null,
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setKycStatus: (state, action) => {
      state.kycStatus = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setKycStatus, setLoading, setError } = kycSlice.actions;

export const useKyc = () => {
  return {
    kycStatus: '',
    setKycStatus: () => {},
  };
};

export default kycSlice.reducer; 