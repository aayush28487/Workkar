// Utility to provide guaranteed, production-safe avatar URLs for workers
import { getFileUrl } from '../config/api';

export const TRADE_AVATARS = {
  carpenter: '/images/workers/carpenter.jpg',
  plumber: '/images/workers/plumber.jpg',
  electrician: '/images/workers/electrician.jpg',
  painter: '/images/workers/painter.jpg',
  mason: '/images/workers/mason.jpg',
  welder: '/images/workers/welder.jpg',
  cleaner: '/images/workers/cleaner.jpg',
  gardener: '/images/workers/gardener.jpg',
  default: '/images/workers/default.jpg',
  svg: '/images/workers/default-avatar.svg'
};

const EXTRA_WORKER_AVATARS = [
  '/images/workers/worker-1.jpg',
  '/images/workers/worker-2.jpg',
  '/images/workers/worker-3.jpg',
  '/images/workers/worker-4.jpg'
];

/**
 * Returns a normalized trade key from a skill string
 */
export const normalizeTrade = (skill = '') => {
  const s = String(skill).toLowerCase().trim();
  if (s.includes('electr')) return 'electrician';
  if (s.includes('plumb')) return 'plumber';
  if (s.includes('carpent')) return 'carpenter';
  if (s.includes('paint')) return 'painter';
  if (s.includes('mason') || s.includes('brick')) return 'mason';
  if (s.includes('weld')) return 'welder';
  if (s.includes('clean')) return 'cleaner';
  if (s.includes('garden') || s.includes('lawn')) return 'gardener';
  return 'default';
};

/**
 * Deterministically pick an avatar based on a name or ID string
 */
const hashString = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

/**
 * Get a guaranteed production-safe trade avatar image
 */
export const getTradeAvatar = (skill = '', nameOrId = '') => {
  const trade = normalizeTrade(skill);
  if (trade !== 'default' && TRADE_AVATARS[trade]) {
    return TRADE_AVATARS[trade];
  }
  if (nameOrId) {
    const idx = hashString(nameOrId) % EXTRA_WORKER_AVATARS.length;
    return EXTRA_WORKER_AVATARS[idx];
  }
  return TRADE_AVATARS.default;
};

/**
 * Safely resolve a worker's avatar URL.
 * Handles database worker objects, profilePhoto, avatar, and relative uploads.
 */
export const resolveWorkerAvatar = (worker) => {
  if (!worker) return TRADE_AVATARS.default;

  // If worker is just a URL string
  if (typeof worker === 'string') {
    if (
      worker.startsWith('/images/') ||
      worker.startsWith('data:') ||
      worker.startsWith('blob:')
    ) {
      return worker;
    }
    if (worker.startsWith('http://') || worker.startsWith('https://')) {
      return worker;
    }
    if (worker.startsWith('/uploads/') || worker.startsWith('uploads/')) {
      return getFileUrl(worker);
    }
    return worker;
  }

  // Worker object
  const skill = worker.skill || worker.profession || worker.skillTitle || '';
  const name = worker.name || worker.fullName || worker.id || worker._id || '';

  // 1. If explicit avatar property is present and valid
  if (worker.avatar && typeof worker.avatar === 'string' && worker.avatar.trim() !== '') {
    return worker.avatar;
  }

  // 2. If profilePhoto is present
  if (worker.profilePhoto && typeof worker.profilePhoto === 'string' && worker.profilePhoto.trim() !== '') {
    return getFileUrl(worker.profilePhoto);
  }

  // 3. Fallback to trade-specific production-safe avatar
  return getTradeAvatar(skill, name);
};

/**
 * Helper to compute clean text initials
 */
export const getInitials = (name = '', fallback = 'WK') => {
  if (!name || typeof name !== 'string') return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
