/**
 * Configuration & Constants
 *
 * For GitHub Pages / production deployment:
 * Replace REMOTE_BACKEND_URL with your live backend service URL on Render, Railway, or Fly.io
 * (e.g., 'https://cv-backend.onrender.com')
 */
const REMOTE_BACKEND_URL = 'https://huggingface.co/spaces/mwkosasih/cv-backend';

// Automatically detect local vs production host
const isSameOriginBackend = window.location.port === '8082';
const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.protocol === 'file:';

const getBaseBackendURL = () => {
  if (isSameOriginBackend) {
    return ''; // Relative path for same-origin backend
  }
  if (isLocalhost) {
    return 'http://localhost:8082'; // Local development server
  }
  return REMOTE_BACKEND_URL; // Cloud backend for GitHub Pages
};

const BASE_URL = getBaseBackendURL();

const AppConfig = {
  baseUrl: BASE_URL,
  endpoints: {
    status: `${BASE_URL}/api/status`,
    chat: `${BASE_URL}/api/chat`,
  },
  maxHistoryLength: 8,
};
