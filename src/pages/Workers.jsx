import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkkar } from '../context/WorkkarContext';
import { useLanguage } from '../context/LanguageContext';
import WorkerCard from '../components/WorkerCard';

export default function Workers() {
  const { workers, services } = useWorkkar();
  const { t, tService, tSkill } = useLanguage();
  const location = useLocation();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [minRating, setMinRating] = useState('All');
  const [locationQuery, setLocationQuery] = useState('');

  // Read URL query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const locationParam = params.get('location');

    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (locationParam) {
      setLocationQuery(locationParam);
    }
  }, [location.search]);

  // Combined Filters Logic
  const filteredWorkers = workers.filter(worker => {
    const q = searchQuery.toLowerCase();
    // 1. Keyword search (filters by name, skill in EN and HI)
    const matchesSearch = 
      worker.name.toLowerCase().includes(q) ||
      worker.skill.toLowerCase().includes(q) ||
      tSkill(worker.skill).toLowerCase().includes(q);

    // 2. Skill Category filter
    const matchesSkill = selectedSkill === 'All' || worker.skill.toLowerCase() === selectedSkill.toLowerCase();

    // 3. Minimum Rating filter
    let matchesRating = true;
    if (minRating !== 'All') {
      const minVal = parseFloat(minRating);
      matchesRating = worker.rating >= minVal;
    }

    // 4. Location filter (since mock worker details descriptions include locations, or default matches)
    const matchesLocation = !locationQuery || 
      (worker.description && worker.description.toLowerCase().includes(locationQuery.toLowerCase())) ||
      locationQuery.toLowerCase().includes("springfield") || 
      locationQuery.toLowerCase().includes("san francisco") ||
      locationQuery.toLowerCase().includes("delhi");

    return matchesSearch && matchesSkill && matchesRating && matchesLocation;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSkill('All');
    setMinRating('All');
    setLocationQuery('');
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-8">
        
        {/* Header Title */}
        <div className="border-b border-outline-variant/20 pb-6">
          <h1 className="font-display-lg text-display-lg text-on-surface font-extrabold tracking-tight">
            {t('workersPage.title')}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            {t('workersPage.subtitle')}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Keyword Search */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">{t('workersPage.searchLabel')}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline material-symbols-outlined text-[18px]">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg pl-9 pr-3 py-2 text-on-surface focus:outline-none focus:border-primary text-xs"
                placeholder={t('workersPage.searchPlaceholder')}
                type="text"
              />
            </div>
          </div>

          {/* Skill Category Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">{t('workersPage.skillLabel')}</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary text-xs"
            >
              <option value="All">{t('workersPage.allSkills')}</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{tService(s.name)}</option>
              ))}
            </select>
          </div>

          {/* Minimum Rating Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">{t('workersPage.ratingLabel')}</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary text-xs"
            >
              <option value="All">{t('workersPage.anyRating')}</option>
              <option value="4.8">⭐⭐⭐⭐⭐ {t('workersPage.fourEightPlus')}</option>
              <option value="4.5">⭐⭐⭐⭐ {t('workersPage.fourFivePlus')}</option>
              <option value="4.0">⭐⭐⭐ {t('workersPage.fourPlus')}</option>
            </select>
          </div>

          {/* Reset Filters / Location indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="w-full py-2.5 border border-outline-variant/60 hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-lg font-label-md text-label-md transition-colors font-bold text-center active:scale-98"
            >
              {t('workersPage.resetFilters')}
            </button>
          </div>

        </div>

        {/* Workers Results Grid */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4 text-xs font-semibold text-on-surface-variant">
            <span>{t('workersPage.showingResults', { count: filteredWorkers.length })}</span>
            {locationQuery && (
              <span className="flex items-center gap-0.5 text-primary">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {t('common.location')}: {locationQuery}
              </span>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {filteredWorkers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="p-16 bg-surface-container-low rounded-2xl border border-outline-variant/20 text-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-4xl text-outline mb-2 block">
                  person_search
                </span>
                <p className="font-bold text-sm">{t('workersPage.noWorkersFound')}</p>
                <p className="text-xs text-outline mt-1">{t('workersPage.noWorkersSubtitle')}</p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md"
              >
                {filteredWorkers.map((worker) => (
                  <motion.div
                    layout
                    key={worker.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  >
                    <WorkerCard worker={worker} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
