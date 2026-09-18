import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function WorkerCard({ worker }) {
  const { id, name, skill, skillTitle, experience, rating, rate, availability, avatar, textAvatar, verified } = worker;
  const { t, tSkill, tAvailability } = useLanguage();

  // Set status pill color styles
  let statusClass = 'bg-slate-100 text-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:border dark:border-slate-800/40';
  let dotColor = 'bg-outline';

  if (availability === 'Available') {
    statusClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/40';
    dotColor = 'bg-emerald-500';
  } else if (availability === 'On Job') {
    statusClass = 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 dark:border dark:border-orange-800/40';
    dotColor = 'bg-secondary-container';
  }

  const translatedSkill = skillTitle ? tSkill(skillTitle) : `${tSkill(skill)} ${t('skills.Specialist')}`;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0px 12px 30px rgba(0,0,0,0.08)' }}
      className="glass-card rounded-xl p-stack-md flex flex-col justify-between border border-outline-variant/30 ambient-shadow-base hover-lift transition-all duration-300"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {avatar ? (
                <img
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-surface shadow-sm"
                  src={avatar}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xl border-2 border-surface shadow-sm">
                  {textAvatar || name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
              )}
              {/* Online status indicator dot */}
              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${dotColor} border-2 border-surface rounded-full shadow`}></span>
            </div>
            <div>
              <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-1 font-bold">
                {name}
                {verified && (
                  <span className="material-symbols-outlined text-green-600 text-[18px] fill" title={t('common.verified')}>
                    verified
                  </span>
                )}
              </h3>
              <p className="font-label-md text-label-md text-on-surface-variant font-medium">{translatedSkill}</p>
            </div>
          </div>
          <div className="bg-surface-container-high px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-secondary-container text-[14px] fill">star</span>
            <span className="font-label-md text-label-md text-on-surface font-bold">
              {rating ? rating.toFixed(1) : t('common.new')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2.5 px-3 bg-surface-container-low/60 rounded-xl mb-3 text-xs">
          <span className="font-body-md text-on-surface-variant flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-outline text-[15px]">work</span>
            {experience} {t('common.yrsExp')}
          </span>
          <span className="font-title-md text-sm text-primary font-extrabold flex items-center gap-0.5">
            ${rate}<span className="text-[10px] font-medium text-on-surface-variant">{t('common.perHr')}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Fast arrival • Approx 15 mins</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/15">
        <span className={`${statusClass} text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider`}>
          {tAvailability(availability)}
        </span>
        <Link
          to={`/worker-details/${id}`}
          className="flex-grow bg-primary text-on-primary hover:bg-primary/90 font-extrabold text-xs py-2.5 rounded-xl text-center transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-1"
        >
          {t('workersPage.bookNow')}
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </motion.div>
  );
}
