import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  onSearch
}) {
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl p-2 max-w-3xl w-full mx-auto flex flex-col md:flex-row gap-2 shadow-lg mb-2 sm:mb-4"
    >
      <div className="flex-1 flex items-center bg-surface-container-lowest rounded-xl px-4 py-2.5 sm:py-3 border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
        <span className="material-symbols-outlined text-outline mr-2 text-[20px]">location_on</span>
        <input
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-sm sm:text-base font-body-md text-on-surface placeholder:text-outline/60 outline-none p-0"
          placeholder={t('searchBar.locationPlaceholder')}
          type="text"
        />
      </div>
      <div className="flex-1 flex items-center bg-surface-container-lowest rounded-xl px-4 py-2.5 sm:py-3 border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
        <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-sm sm:text-base font-body-md text-on-surface placeholder:text-outline/60 outline-none p-0"
          placeholder={t('searchBar.servicePlaceholder')}
          type="text"
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-on-primary px-6 sm:px-8 py-3 rounded-xl font-label-md text-label-md hover:bg-primary/95 transition-all active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center font-bold cursor-pointer"
      >
        {t('searchBar.searchBtn')}
      </button>
    </form>
  );
}
