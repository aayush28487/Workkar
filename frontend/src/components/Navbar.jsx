import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkkar } from '../context/WorkkarContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const { incomingAlert, darkMode, toggleDarkMode, user, logout } = useWorkkar();
  const { t } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.workers'), path: '/workers' },
  ];

  return (
    <header className="bg-surface-container-lowest/90 dark:bg-surface-container-lowest/95 backdrop-blur-md sticky top-0 w-full z-50 border-b border-outline-variant/30 shadow-sm transition-colors duration-250">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        {/* Brand logo */}
        <Link 
          to="/" 
          className="font-bold text-headline-md text-primary dark:text-primary-fixed-dim flex items-center gap-2 tracking-tight hover:opacity-95 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400 rounded-lg p-1"
        >
          <span className="material-symbols-outlined fill text-primary">engineering</span>
          WORKKAR
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `font-semibold text-body-md transition-all duration-200 border-b-2 pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400 rounded px-2 py-1 ${
                  isActive
                    ? 'text-primary dark:text-white border-primary dark:border-white font-bold'
                    : 'text-on-surface-variant dark:text-on-surface-variant border-transparent hover:text-primary dark:hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Action controls / dropdown selector */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector Dropdown */}
          <div className="hidden md:block">
            <LanguageSelector />
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-low dark:bg-surface-container-high text-on-surface-variant hover:text-primary dark:text-on-surface-variant dark:hover:text-white border border-outline-variant/30 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400"
            aria-label={t('nav.toggleTheme')}
            title={t('nav.toggleTheme')}
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px] font-bold">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="relative flex items-center">
              {/* Desktop User Dropdown Button */}
              <button
                onClick={() => setShowPortalMenu(!showPortalMenu)}
                className="hidden md:flex items-center gap-2 bg-surface-container-low dark:bg-surface-container-high hover:bg-surface-container-high dark:hover:bg-surface-container border border-outline-variant/30 px-3.5 py-2 rounded-full transition-all duration-200 active:scale-95 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface relative"
              >
                <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[10px]">
                  {user.textAvatar || (user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'WK')}
                </div>
                <span className="truncate max-w-[100px]">{user.name ? user.name.split(' ')[0] : t('nav.partner')}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                {user.notifications && user.notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
                  </span>
                )}
              </button>

              {/* Mobile Quick User Profile Avatar */}
              <Link
                to={user.role === 'worker' ? '/worker/dashboard' : (user.role === 'admin' ? '/admin/dashboard' : (user.role === 'supreme-admin' ? '/supreme-admin/dashboard' : '/dashboard'))}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-[11px] shadow-sm relative active:scale-95 transition-transform"
                aria-label="User profile"
              >
                {user.textAvatar || (user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'WK')}
                {user.notifications && user.notifications.some(n => !n.read) && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
                  </span>
                )}
              </Link>

              {incomingAlert && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                </span>
              )}

              <AnimatePresence>
                {showPortalMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowPortalMenu(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-xl z-20 py-2"
                    >
                      <div className="px-4 py-2 border-b border-outline-variant/20 mb-1">
                        <p className="text-xs font-bold text-on-surface truncate">{user.name || t('nav.partner')}</p>
                        <p className="text-[10px] text-on-surface-variant truncate">{user.email}</p>
                        <span className="mt-1 inline-block text-[8px] font-bold tracking-wider bg-primary-container text-on-primary-container px-2 py-0.5 rounded uppercase">
                          {user.role}
                        </span>
                      </div>
                      
                      <Link
                        to="/"
                        onClick={() => setShowPortalMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-on-surface dark:text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                        {t('nav.clientSite')}
                      </Link>

                      {['customer', 'admin', 'supreme-admin'].includes(user.role) && (
                        <Link
                          to="/dashboard"
                          onClick={() => setShowPortalMenu(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-on-surface dark:text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors border-b border-outline-variant/10 pb-2 mb-1"
                        >
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-primary">dashboard</span>
                            {t('customerDashboard.tabActiveBookings')}
                          </span>
                          {user.notifications && user.notifications.some(n => !n.read) && (
                            <span className="h-2 w-2 rounded-full bg-error animate-pulse"></span>
                          )}
                        </Link>
                      )}

                      {user.role === 'worker' && (
                        <Link
                          to="/worker/dashboard"
                          onClick={() => setShowPortalMenu(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-on-surface dark:text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-primary">engineering</span>
                            {t('workerDashboard.portalTitle')}
                          </span>
                          {incomingAlert && (
                            <span className="bg-error-container text-on-error-container text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">New offer</span>
                          )}
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowPortalMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-on-surface dark:text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-secondary">admin_panel_settings</span>
                          {t('admin.opsTitle')}
                        </Link>
                      )}

                      {user.role === 'supreme-admin' && (
                        <Link
                          to="/supreme-admin/dashboard"
                          onClick={() => setShowPortalMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-on-surface dark:text-on-surface hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-secondary">local_police</span>
                          {t('admin.supremeTitle')}
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setShowPortalMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-error hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-t border-outline-variant/10 mt-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        {t('nav.logout')}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to="/worker/login"
                className="hidden md:flex items-center gap-1.5 font-bold text-xs tracking-wider uppercase border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 rounded-full transition-all active:scale-95 duration-200"
              >
                {t('nav.partnerPortal')}
              </Link>
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 font-bold text-xs tracking-wider uppercase bg-primary text-on-primary hover:bg-primary/90 dark:bg-primary dark:text-white dark:hover:bg-primary/80 px-5 py-2.5 rounded-full transition-all active:scale-95 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-none shadow-sm hover:shadow"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                {t('nav.signIn')}
              </Link>

              {/* Mobile Quick Sign-In Button */}
              <Link
                to="/login"
                className="md:hidden flex items-center gap-1 font-bold text-xs bg-primary text-on-primary px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">login</span>
                <span>{t('nav.signIn')}</span>
              </Link>
            </div>
          )}

          {user && user.role === 'worker' && (
            <Link
              to="/worker/dashboard"
              className="font-bold text-label-md bg-primary text-on-primary px-5 py-2.5 rounded-full shadow-sm hover:shadow-md hover:bg-primary/95 transition-all duration-200 active:scale-95 text-center flex items-center justify-center gap-1.5"
            >
              {t('nav.dashboard')}
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-on-surface-variant p-2 hover:bg-surface-container rounded-full transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-on-surface z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed right-0 top-0 h-full w-80 bg-surface-container-lowest shadow-2xl z-50 flex flex-col p-6 border-l border-outline-variant/20 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-headline-sm text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined fill text-primary">engineering</span>
                  WORKKAR
                </span>
                <button
                  onClick={toggleMenu}
                  className="text-on-surface-variant p-2 hover:bg-surface-container rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Mobile Language Selector */}
              <div className="mb-4">
                <LanguageSelector isMobile={true} />
              </div>

              {/* Mobile Theme Switcher */}
              <div className="flex items-center justify-between py-2.5 px-3 bg-surface-container-low dark:bg-slate-800/60 rounded-xl mb-6 border border-outline-variant/30">
                <span className="text-xs font-bold text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    {darkMode ? 'dark_mode' : 'light_mode'}
                  </span>
                  <span>{t('nav.toggleTheme') || 'Appearance'}</span>
                </span>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="px-3 py-1 rounded-lg bg-surface-container-lowest dark:bg-slate-900 font-bold text-xs text-primary dark:text-blue-400 border border-outline-variant/40 shadow-sm active:scale-95 cursor-pointer"
                >
                  {darkMode ? 'Dark' : 'Light'}
                </button>
              </div>

              <nav className="flex flex-col gap-4 mb-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      `font-bold text-base transition-colors py-1 flex items-center justify-between ${
                        isActive ? 'text-primary' : 'text-on-surface-variant'
                      }`
                    }
                  >
                    <span>{link.name}</span>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </NavLink>
                ))}
              </nav>

              <div className="border-t border-outline-variant/30 pt-6 mt-auto flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="px-2 py-1 mb-2">
                      <p className="text-sm font-bold text-on-surface truncate">{user.name || t('nav.partner')}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/"
                      onClick={toggleMenu}
                      className="flex items-center gap-2 p-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-sm font-semibold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">storefront</span>
                      {t('nav.clientSite')}
                    </Link>

                    {['customer', 'admin', 'supreme-admin'].includes(user.role) && (
                      <Link
                        to="/dashboard"
                        onClick={toggleMenu}
                        className="flex items-center justify-between p-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-sm font-semibold transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-primary">dashboard</span>
                          {t('customerDashboard.tabActiveBookings')}
                        </span>
                        {user.notifications && user.notifications.some(n => !n.read) && (
                          <span className="bg-error text-white text-[8px] font-bold px-1.5 py-0.5 rounded">New</span>
                        )}
                      </Link>
                    )}

                    {user.role === 'worker' && (
                      <Link
                        to="/worker/dashboard"
                        onClick={toggleMenu}
                        className="flex items-center justify-between p-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-sm font-semibold transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-primary">engineering</span>
                          {t('workerDashboard.portalTitle')}
                        </span>
                        {incomingAlert && (
                          <span className="bg-error text-white text-[8px] font-bold px-1.5 py-0.5 rounded">New</span>
                        )}
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={toggleMenu}
                        className="flex items-center gap-2 p-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-sm font-semibold transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px] text-secondary">admin_panel_settings</span>
                        {t('admin.opsTitle')}
                      </Link>
                    )}

                    {user.role === 'supreme-admin' && (
                      <Link
                        to="/supreme-admin/dashboard"
                        onClick={toggleMenu}
                        className="flex items-center gap-2 p-3 bg-surface-container-low hover:bg-surface-container rounded-xl text-sm font-semibold transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px] text-secondary">local_police</span>
                        {t('admin.supremeTitle')}
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        toggleMenu();
                        logout();
                      }}
                      className="w-full flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 text-error hover:bg-red-100 rounded-xl text-sm font-bold transition-colors mt-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/worker/login"
                      onClick={toggleMenu}
                      className="flex items-center justify-center gap-2 p-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-bold transition-colors"
                    >
                      {t('nav.partnerPortal')}
                    </Link>
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className="flex items-center justify-center gap-2 p-3 bg-primary text-on-primary hover:bg-primary/90 rounded-xl text-sm font-bold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">login</span>
                      {t('nav.signIn')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
