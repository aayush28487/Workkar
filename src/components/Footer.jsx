import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface-container-high dark:bg-inverse-surface border-t border-outline-variant/30 w-full mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-lg gap-stack-md max-w-container-max mx-auto">
        <Link to="/" className="font-title-md text-title-md font-bold text-on-surface dark:text-inverse-on-surface flex items-center gap-1.5 hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined fill text-[20px]">engineering</span>
          WORKKAR
        </Link>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/services" className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors duration-200">
            {t('footer.services')}
          </Link>
          <a href="#" className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors duration-200">
            {t('footer.terms')}
          </a>
          <a href="#" className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors duration-200">
            {t('footer.privacy')}
          </a>
          <a href="#" className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors duration-200">
            {t('footer.contact')}
          </a>
          <a href="#" className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors duration-200">
            {t('footer.faq')}
          </a>
        </div>
        <div className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant text-center md:text-right text-xs">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
