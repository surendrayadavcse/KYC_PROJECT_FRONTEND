import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock import.meta
if (typeof global.import === 'undefined') {
  global.import = {};
}

if (typeof global.import.meta === 'undefined') {
  global.import.meta = {
    env: {
      VITE_API_BASE_URL: 'http://localhost:9999/api'
    }
  };
} 