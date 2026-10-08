import React, { useState, useEffect } from 'react';
import { getTradeAvatar, resolveWorkerAvatar, getInitials, TRADE_AVATARS } from '../utils/avatarUtils';

/**
 * Universal, production-safe WorkerAvatar component.
 * Features:
 * - Automatically resolves image URLs (local, uploads, CDN, trade fallbacks)
 * - Cascading error fallbacks:
 *     1. Primary image (uploaded or custom avatar)
 *     2. Guaranteed local trade avatar (/images/workers/<trade>.jpg)
 *     3. High-contrast vector SVG avatar (/images/workers/default-avatar.svg)
 *     4. Stylized initials typography avatar
 * - Guarantees ZERO broken-image icons on both local and production (Vercel) environments.
 */
export default function WorkerAvatar({
  worker,
  src,
  name = '',
  skill = '',
  textAvatar,
  alt,
  className = '',
  size = 'w-16 h-16',
  rounded = 'rounded-full',
  border = 'border-2 border-surface shadow-sm',
  textClassName = 'text-primary font-bold text-xl'
}) {
  const workerName = worker?.name || worker?.fullName || name || 'Worker';
  const workerSkill = worker?.skill || worker?.profession || worker?.skillTitle || skill || '';
  const workerTextAvatar = worker?.textAvatar || textAvatar;

  const initialUrl = src || (worker ? resolveWorkerAvatar(worker) : getTradeAvatar(workerSkill, workerName));

  const [currentSrc, setCurrentSrc] = useState(initialUrl);
  const [attempt, setAttempt] = useState(0);
  const [showFallbackInitials, setShowFallbackInitials] = useState(false);

  // Sync state if props change
  useEffect(() => {
    const nextUrl = src || (worker ? resolveWorkerAvatar(worker) : getTradeAvatar(workerSkill, workerName));
    setCurrentSrc(nextUrl);
    setAttempt(0);
    setShowFallbackInitials(!nextUrl);
  }, [src, worker?.avatar, worker?.profilePhoto, workerName, workerSkill]);

  const handleError = () => {
    if (attempt === 0) {
      // 1st fallback: Trade-specific reliable asset
      const tradeFallback = getTradeAvatar(workerSkill, workerName);
      if (tradeFallback && tradeFallback !== currentSrc) {
        setAttempt(1);
        setCurrentSrc(tradeFallback);
        return;
      }
      // If it already was trade avatar, try default svg
      setAttempt(2);
      setCurrentSrc(TRADE_AVATARS.svg);
      return;
    }

    if (attempt === 1) {
      // 2nd fallback: Vector SVG avatar
      setAttempt(2);
      setCurrentSrc(TRADE_AVATARS.svg);
      return;
    }

    // 3rd fallback: Smoothly switch to typography initials
    setShowFallbackInitials(true);
  };

  const initials = workerTextAvatar || getInitials(workerName);

  if (showFallbackInitials || !currentSrc) {
    return (
      <div
        className={`${size} ${rounded} bg-primary-fixed flex items-center justify-center select-none ${textClassName} ${border} ${className}`}
        aria-label={workerName}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt || workerName}
      onError={handleError}
      loading="lazy"
      className={`${size} ${rounded} object-cover ${border} ${className}`}
    />
  );
}
