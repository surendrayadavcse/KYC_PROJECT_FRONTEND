import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BasicDetails from './BasicDetails';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock KycContext
jest.mock('../../../context/KycContext');

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('BasicDetails Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup localStorage mock
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Setup localStorage data
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'id') return '123';
      return null;
    });
  });

  const renderBasicDetails = () => {
    return render(
      <BrowserRouter>
        <BasicDetails />
      </BrowserRouter>
    );
  };

  it('renders all form fields', () => {
    renderBasicDetails();
    
    expect(screen.getByPlaceholderText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('House No')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Street')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('State')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Pincode')).toBeInTheDocument();
  });

  it('fetches user details on mount', async () => {
    const mockData = {
      data: {
        dob: '1990-01-01',
        address: '123, Main St, City, State - 123456',
      },
    };
    axios.get.mockResolvedValueOnce(mockData);

    renderBasicDetails();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/user/addressdob/123');
    });
  });

  it('validates form fields', async () => {
    renderBasicDetails();

    const submitButton = screen.getByText('Save & Continue');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Date of Birth is required')).toBeInTheDocument();
      expect(screen.getByText('House No is required')).toBeInTheDocument();
      expect(screen.getByText('Street is required')).toBeInTheDocument();
      expect(screen.getByText('City is required')).toBeInTheDocument();
      expect(screen.getByText('State is required')).toBeInTheDocument();
      expect(screen.getByText('Pincode is required')).toBeInTheDocument();
    });
  });

  it('handles successful form submission', async () => {
    axios.patch.mockResolvedValueOnce({ data: { success: true } });

    renderBasicDetails();

    // Fill in form fields
    fireEvent.change(screen.getByPlaceholderText('Date of Birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('House No'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Street'), { target: { value: 'Main St' } });
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'City' } });
    fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'State' } });
    fireEvent.change(screen.getByPlaceholderText('Pincode'), { target: { value: '123456' } });

    const submitButton = screen.getByText('Save & Continue');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith('/user/addressdob/123', {
        dob: '1990-01-01',
        address: '123, Main St, City, State - 123456',
      });
    });
  });

  it('handles form submission error', async () => {
    axios.patch.mockRejectedValueOnce(new Error('Failed to submit'));

    renderBasicDetails();

    // Fill in form fields
    fireEvent.change(screen.getByPlaceholderText('Date of Birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('House No'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Street'), { target: { value: 'Main St' } });
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'City' } });
    fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'State' } });
    fireEvent.change(screen.getByPlaceholderText('Pincode'), { target: { value: '123456' } });

    const submitButton = screen.getByText('Save & Continue');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to save details. Please try again.')).toBeInTheDocument();
    });
  });

  it('validates pincode format', async () => {
    renderBasicDetails();

    fireEvent.change(screen.getByPlaceholderText('Pincode'), { target: { value: '123' } });
    const submitButton = screen.getByText('Save & Continue');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Pincode must be 6 digits')).toBeInTheDocument();
    });
  });

  it('validates city and state format', async () => {
    renderBasicDetails();

    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: '456' } });
    const submitButton = screen.getByText('Save & Continue');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('City should contain only letters')).toBeInTheDocument();
      expect(screen.getByText('State should contain only letters')).toBeInTheDocument();
    });
  });
}); 