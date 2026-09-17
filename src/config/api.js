// API and Backend configuration for local dev and production
export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/+$/, '');
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
