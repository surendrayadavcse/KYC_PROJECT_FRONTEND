import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:9999/api/services';

// Async thunks
export const fetchAllServices = createAsyncThunk('services/fetchAll', async () => {
  const res = await axios.get(`${API_BASE}/all`);
  return res.data;
});

export const addService = createAsyncThunk(
  'services/add',
  async ({ serviceName, serviceDetails, iconFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('serviceName', serviceName);
      formData.append('serviceDetails', serviceDetails);
      if (iconFile) {
        formData.append('icon', iconFile);
      }

      const res = await axios.post(`${API_BASE}/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error adding service');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addService.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default serviceSlice.reducer;
