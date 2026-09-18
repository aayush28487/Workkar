import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en } from '../locales/en';
import { hi } from '../locales/hi';

const LanguageContext = createContext();

const translations = {
  en,
  hi,
};

export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('workkar_language');
    return saved === 'hi' ? 'hi' : 'en';
  });

  // Set language and persist in localStorage
  const setLanguage = useCallback((newLang) => {
    const targetLang = newLang === 'hi' ? 'hi' : 'en';
    setLanguageState(targetLang);
    localStorage.setItem('workkar_language', targetLang);
    document.documentElement.lang = targetLang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // General translation function with nested key support and parameter replacement
  const t = useCallback((path, params = {}) => {
    if (!path) return '';

    const keys = path.split('.');
    
    // 1. Try selected language
    let current = translations[language];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = null;
        break;
      }
    }

    // 2. Fallback to English if missing in selected language
    if (current === null || current === undefined) {
      current = translations.en;
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          current = null;
          break;
        }
      }
    }

    // 3. Fallback to clean human-readable text if not found
    if (current === null || current === undefined) {
      if (typeof path === 'string' && path.includes('.')) {
        const lastPart = path.split('.').pop();
        const readable = lastPart
          .replace(/([A-Z])/g, ' $1')
          .replace(/_/g, ' ')
          .replace(/^\w/, c => c.toUpperCase())
          .trim();
        return readable
          .replace(/^Gender\s+/, '')
          .replace(/\s+Btn$/, '')
          .replace(/^Tab\s+/, '')
          .trim() || readable;
      }
      return path;
    }

    if (typeof current !== 'string') {
      return current;
    }

    // Replace {params}
    let result = current;
    Object.keys(params).forEach((paramKey) => {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
    });

    return result;
  }, [language]);

  // Helper for dynamic Service name translation
  const tService = useCallback((serviceName) => {
    if (!serviceName) return '';
    const key = serviceName.toLowerCase();
    const serviceObj = translations[language]?.servicesList?.[key] || translations.en?.servicesList?.[key];
    if (serviceObj && serviceObj.name) {
      return serviceObj.name;
    }
    return serviceName;
  }, [language]);

  // Helper for dynamic Service description translation
  const tServiceDesc = useCallback((serviceName, defaultDesc = '') => {
    if (!serviceName) return defaultDesc;
    const key = serviceName.toLowerCase();
    const serviceObj = translations[language]?.servicesList?.[key] || translations.en?.servicesList?.[key];
    if (serviceObj && serviceObj.description) {
      return serviceObj.description;
    }
    return defaultDesc;
  }, [language]);

  // Helper for dynamic Skill / Title translation
  const tSkill = useCallback((skillName) => {
    if (!skillName) return '';
    const dict = translations[language]?.skills || {};
    if (dict[skillName]) return dict[skillName];
    
    // Check if skill matches a base service name
    const baseService = tService(skillName);
    if (baseService !== skillName) return baseService;

    return skillName;
  }, [language, tService]);

  // Helper for Availability status
  const tAvailability = useCallback((availability) => {
    if (!availability) return '';
    if (availability === 'Available') return t('common.available');
    if (availability === 'On Job') return t('common.onJob');
    if (availability === 'Offline') return t('common.offline');
    return availability;
  }, [t]);

  // Helper for Job / Request / User Status
  const tStatus = useCallback((status) => {
    if (!status) return '';
    const lower = status.toLowerCase();
    if (lower === 'pending') return t('common.pending');
    if (lower === 'accepted') return t('common.accepted');
    if (lower === 'completed') return t('common.completed');
    if (lower === 'cancelled' || lower === 'canceled') return t('common.cancelled');
    if (lower === 'in progress' || lower === 'in_progress') return t('common.inProgress');
    if (lower === 'active') return t('common.active');
    if (lower === 'inactive') return t('common.inactive');
    if (lower === 'verified') return t('common.verified');
    if (lower === 'unverified') return t('common.unverified');
    return status;
  }, [t]);

  // Helper for Roles
  const tRole = useCallback((role) => {
    if (!role) return '';
    if (role === 'customer') return t('common.customer');
    if (role === 'worker') return t('common.worker');
    if (role === 'admin') return t('common.admin');
    if (role === 'supreme-admin') return t('common.supremeAdmin');
    return role;
  }, [t]);

  const value = {
    language,
    setLanguage,
    t,
    tService,
    tServiceDesc,
    tSkill,
    tAvailability,
    tStatus,
    tRole,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export useTranslation as an alias for intuitive developer experience
export const useTranslation = () => useLanguage();
