import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector({ className = '', isMobile = false }) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const languages = [
    { code: 'en', label: 'English', subLabel: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', subLabel: 'Hindi', flag: '🇮🇳' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className={`w-full flex flex-col gap-2 py-2 border-t border-outline-variant/30 ${className}`}>
        <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-primary">language</span>
          {t('language.selectLanguage')}
        </span>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                language === lang.code
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low dark:bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {language === lang.code && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-surface-container-low dark:bg-surface-container-high hover:bg-surface-container-high dark:hover:bg-surface-container border border-outline-variant/30 px-3 py-2 rounded-full transition-all duration-200 active:scale-95 text-xs font-semibold text-on-surface-variant hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={t('language.selectLanguage')}
      >
        <span className="text-sm">🌐</span>
        <span className="font-bold text-xs">{currentLang.label}</span>
        <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          arrow_drop_down
        </span>
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-44 bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/40 rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden backdrop-blur-md"
          >
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-outline border-b border-outline-variant/20">
              {t('language.selectLanguage')}
            </div>
            <div className="py-1">
              {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim font-bold'
                        : 'text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-bold leading-tight">{lang.label}</span>
                        <span className="text-[10px] text-on-surface-variant font-normal">{lang.subLabel}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
