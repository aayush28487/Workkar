import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkkar } from '../context/WorkkarContext';
import { useLanguage } from '../context/LanguageContext';
import ServiceCard from '../components/ServiceCard';
import { ServiceModal } from '../components/Modals';

export default function Services() {
  const { services } = useWorkkar();
  const { t, tService, tServiceDesc } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  // Filter services by search query (supports both English and translated Hindi names/descriptions)
  const filteredServices = services.filter((service) => {
    const q = searchQuery.toLowerCase();
    const enName = service.name.toLowerCase();
    const enDesc = service.description.toLowerCase();
    const trName = tService(service.name).toLowerCase();
    const trDesc = tServiceDesc(service.name, service.description).toLowerCase();

    return enName.includes(q) || enDesc.includes(q) || trName.includes(q) || trDesc.includes(q);
  });

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
          <h1 className="font-display-lg text-display-lg text-on-surface font-extrabold tracking-tight">
            {t('servicesPage.title')}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            {t('servicesPage.subtitle')}
          </p>
        </div>

        {/* Search Input Filter */}
        <div className="relative max-w-md w-full mx-auto shadow-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline material-symbols-outlined text-[20px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl pl-10 pr-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm placeholder:text-outline/50"
            placeholder={t('servicesPage.searchPlaceholder')}
            type="text"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Grid Area */}
        <AnimatePresence mode="popLayout">
          {filteredServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-12 bg-surface-container-low rounded-2xl border border-outline-variant/20 text-center text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-4xl text-outline mb-2 block">
                category_search
              </span>
              <p className="font-bold text-sm">{t('servicesPage.noMatches')}</p>
              <p className="text-xs text-outline mt-1">{t('servicesPage.expandSearch')}</p>
            </motion.div>
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-stack-md mt-4"
            >
              {filteredServices.map((service) => (
                <motion.div
                  layout
                  key={service.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                  <ServiceCard
                    service={service}
                    onClick={() => setSelectedService(service)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Service Details Modal */}
        <ServiceModal
          service={selectedService}
          isOpen={selectedService !== null}
          onClose={() => setSelectedService(null)}
        />
      </div>
    </div>
  );
}
