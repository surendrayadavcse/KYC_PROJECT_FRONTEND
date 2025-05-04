import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import Login from './LoginPage';
import { loginUser } from '../../authentication/userThunks';
import { toast } from 'react-toastify';

// Mock the Redux store
const mockStore = {
  user: {
    loading: false,
    error: null,
    user: null
  }
};

// Mock the loginUser thunk
jest.mock('../../authentication/userThunks', () => ({
  loginUser: jest.fn()
}));

// Mock the useKyc hook
jest.mock('../../context/KycContext', () => ({
  useKyc: () => ({
    refreshKycStatus: jest.fn()
  })
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  },
  ToastContainer: () => null
}));

describe('Login Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: (state = mockStore.user, action) => {
          switch (action.type) {
            case 'user/loginUser/pending':
              return { ...state, loading: true };
            case 'user/loginUser/fulfilled':
              return { ...state, loading: false };
            case 'user/loginUser/rejected':
              return { ...state, loading: false };
            default:
              return state;
          }
        }
      }
    });
    jest.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders login form with all required elements', () => {
    renderLogin();
    
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  test('handles input changes correctly', () => {
    renderLogin();
    
    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows loading state during login', async () => {
    const promise = new Promise(() => {});
    loginUser.mockReturnValue(() => promise);
    
    renderLogin();

    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.click(submitButton);

    await act(async () => {
      store.dispatch({ type: 'user/loginUser/pending' });
    });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton.textContent).toBe('Logging in...');
    });
  });

  test('handles successful login for customer', async () => {
    const mockResponse = { role: 'CUSTOMER' };
    loginUser.mockResolvedValue(mockResponse);
    
    renderLogin();

    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  test('handles successful login for admin', async () => {
    const mockResponse = { role: 'ADMIN' };
    loginUser.mockResolvedValue(mockResponse);
    
    renderLogin();

    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'admin123'
      });
    });
  });

  test('handles login error', async () => {
    const mockError = new Error('Invalid credentials');
    loginUser.mockImplementation(() => {
      throw mockError;
    });
    
    renderLogin();

    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  test('validates required fields', () => {
    renderLogin();
    
    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
}); 