// src/authentication/userThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils";



export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`user/register`, userData);
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
      const response = await axios.post(`/user/login`, loginData);
      return response.data
    
    } catch (error) {
      console.log(error.response.data,"ajsdhj")
      return rejectWithValue(error.response.data || "Login failed");

    }
  }
);
