// src/features/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "../authentication/userThunks";


const initialState = {
  user: null,
  token: null,
  role: null,
  loading: false,
  error: null,

  fullName:null
};

// const userslice2=createSlice()
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
      state.id=null
      localStorage.removeItem("role");
  
      localStorage.removeItem("id")
      localStorage.removeItem("token")
      localStorage.removeItem("name")
      
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload; // <-- "User registered successfully"
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // <-- "Email is already registered"
        console.log(action.payload)
      })
      

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.role=action.payload.fullName;

        localStorage.setItem("token",action.payload.token)
        localStorage.setItem("role", action.payload.role);
      
        localStorage.setItem("name",action.payload.fullName)
     
        localStorage.setItem("id",action.payload.id)

        // console.log(action.payload.role)
        
       
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
