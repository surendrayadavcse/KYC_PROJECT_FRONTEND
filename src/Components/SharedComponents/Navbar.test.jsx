import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock userThunks
jest.mock('../../authentication/userThunks');

// Mock useNavigate and useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockLocation = { pathname: '/dashboard' };

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
    
    // Setup Redux mock
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue(mockLocation);
  });

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('renders logo and profile button', () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'CUSTOMER';
      if (key === 'name') return 'John Doe';
      return null;
    });

    renderNavbar();

    expect(screen.getByText(/Hexa/i)).toBeInTheDocument();
    expect(screen.getByText('Edge')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('displays correct text based on route', () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'CUSTOMER';
      if (key === 'name') return 'John Doe';
      return null;
    });

    useLocation.mockReturnValue({ pathname: '/profile' });
    renderNavbar();

    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('toggles dropdown menu', () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'CUSTOMER';
      if (key === 'name') return 'John Doe';
      return null;
    });

    renderNavbar();

    const dropdownIcon = screen.getByTestId('dropdown-icon');
    fireEvent.click(dropdownIcon);

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('handles logout', () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'CUSTOMER';
      if (key === 'name') return 'John Doe';
      return null;
    });

    renderNavbar();

    const dropdownIcon = screen.getByTestId('dropdown-icon');
    fireEvent.click(dropdownIcon);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to profile when clicking profile button', () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'CUSTOMER';
      if (key === 'name') return 'John Doe';
      return null;
    });

    renderNavbar();

    const profileButton = screen.getByRole('button');
    fireEvent.click(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('displays admin role when user is admin', () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'ADMIN';
      if (key === 'name') return 'John Doe';
      return null;
    });

    renderNavbar();

    expect(screen.getByText('ADMIN', { exact: false })).toBeInTheDocument();
  });

  it('handles missing localStorage data', () => {
    window.localStorage.getItem.mockImplementation(() => null);
    renderNavbar();

    expect(screen.getByText('User')).toBeInTheDocument();
  });
}); 