import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils';


// Fetch KYC status from the backend
const userId=localStorage.getItem("id")
export const fetchKycStatusThunk = createAsyncThunk(
  'kyc/fetchStatus',
  async (_, { rejectWithValue }) => {
    // console.log(userId)
    try {
      const response = await axios.get(`/user/kycstatus/${userId}`);
      // console.log(response.data.kycStatus)
      return response.data.kycStatus;
    } catch (err) {
      return rejectWithValue("Error fetching KYC status");
    }
  }
);

const kycSlice = createSlice({
  name: 'kyc',
  initialState: {
    status: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKycStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKycStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
      })
      .addCase(fetchKycStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default kycSlice.reducer;
