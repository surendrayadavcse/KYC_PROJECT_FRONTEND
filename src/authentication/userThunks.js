// src/authentication/userThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:9999/auth/";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}register`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}login`, loginData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Login failed");
    }
  }
);
