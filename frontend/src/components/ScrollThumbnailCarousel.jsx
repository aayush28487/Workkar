import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Clock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ScrollThumbnailCarousel({ services = [], onSelectService }) {
  const { tService, tServiceDesc } = useLanguage();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [services]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  if (!services || services.length === 0) return null;

  return (
    <div className="relative w-full group/carousel">
      {/* Scroll Controls (Desktop & Mobile) */}
      <div className="flex items-end justify-between mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary mb-1 sm:mb-2">
            <Clock size={12} className="text-primary animate-pulse" />
            Instant Dispatch Trades
          </span>
          <h2 className="font-display-lg text-xl sm:text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight truncate">
            Popular Trade Categories
          </h2>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous services"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary disabled:opacity-25 disabled:pointer-events-none transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next services"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary disabled:opacity-25 disabled:pointer-events-none transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Thumbnails Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollPosition}
        className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1 px-1 -mx-1 snap-x snap-mandatory"
      >
        {services.map((service, index) => {
          const serviceName = tService(service.name);
          const serviceDesc = tServiceDesc(service.name, service.description);
          const fallbackImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80';

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="min-w-[240px] sm:min-w-[290px] max-w-[310px] snap-start shrink-0 group rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
              onClick={() => onSelectService && onSelectService(service)}
            >
              {/* Photo Thumbnail Area */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={service.image || fallbackImage}
                  alt={serviceName}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Top Badge (Popular, Fast Dispatch, etc.) */}
                {service.badge && (
                  <div className="absolute top-3 left-3 bg-primary/95 text-on-primary text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
                    {service.badge}
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
                    {service.rating || '4.9'}
                  </span>
                </div>

                {/* Bottom Image Info */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[18px]">
                        {service.icon || 'build'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-extrabold leading-tight text-white drop-shadow">
                        {serviceName}
                      </p>
                      <p className="text-[10px] text-white/80 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {service.availableWorkers || '15+ Available'}
                      </p>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <span className="bg-emerald-500/90 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm">
                    {service.price || ('From $' + (service.startingRate || 20) + '/hr')}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <p className="text-xs text-on-surface-variant font-medium line-clamp-2 leading-relaxed">
                  {serviceDesc}
                </p>

                <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                  <span className="text-[11px] text-primary font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-primary" />
                    Verified Pros
                  </span>
                  
                  <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Book Pro
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
