import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function ServiceCard({ service, onClick }) {
  const { name, description, icon, color, bg, image, price, startingRate, badge, availableWorkers } = service;
  const { tService, tServiceDesc } = useLanguage();

  // Determine text-color and bg-color mappings
  let iconColor = 'text-primary';
  if (color === 'secondary') iconColor = 'text-secondary';
  if (color === 'tertiary') iconColor = 'text-tertiary';

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Thumbnail Banner Area */}
      {image ? (
        <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img
            src={image}
            alt={tService(name)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

          {badge && (
            <span className="absolute top-2.5 left-2.5 bg-primary/95 text-on-primary text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow backdrop-blur-sm">
              {badge}
            </span>
          )}

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-1.5">
              <div className={`w-7 h-7 rounded-lg ${bg || 'bg-white/20'} backdrop-blur-md flex items-center justify-center`}>
                <span className="material-symbols-outlined text-[16px] text-white" data-icon={icon}>
                  {icon}
                </span>
              </div>
              <span className="text-[11px] font-medium text-white/90 drop-shadow-sm">
                {availableWorkers || 'Available'}
              </span>
            </div>

            <span className="bg-emerald-500/90 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm">
              {price || `From $${startingRate || 20}/hr`}
            </span>
          </div>
        </div>
      ) : (
        <div className="pt-6 pb-2 flex justify-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className={`w-14 h-14 rounded-2xl ${bg || 'bg-primary-container'} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
          >
            <span className={`material-symbols-outlined ${iconColor} text-2xl`} data-icon={icon}>
              {icon}
            </span>
          </motion.div>
        </div>
      )}

      {/* Info Content */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-2 text-left">
        <div>
          <h3 className="font-title-md text-base text-on-surface font-extrabold group-hover:text-primary transition-colors">
            {tService(name)}
          </h3>
          <p className="font-label-md text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
            {tServiceDesc(name, description)}
          </p>
        </div>

        <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-primary font-bold text-xs">
          <span>Book Worker</span>
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </div>
      </div>
    </motion.div>
  );
}
