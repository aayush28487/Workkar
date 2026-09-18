// API and Backend configuration for local dev and production
const getDefaultBackendUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  // If running in development (localhost / dev server), use local backend
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  // Default to the live Render backend in production builds
  return 'https://workkar-q8bt.onrender.com';
};

export const BACKEND_URL = getDefaultBackendUrl().replace(/\/+$/, '');
export const API_URL = `${BACKEND_URL}/api`;

/**
 * Safely format file/photo URLs so they resolve either from an absolute external URL
 * or from the configured backend host.
 */
export const getFileUrl = (path) => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
};
