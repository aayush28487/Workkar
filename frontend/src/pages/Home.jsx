import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  Star, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  MapPin, 
  BadgeCheck,
  ChevronRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useWorkkar } from '../context/WorkkarContext';
import { useLanguage } from '../context/LanguageContext';
import SearchBar from '../components/SearchBar';
import ServiceCard from '../components/ServiceCard';
import WorkerCard from '../components/WorkerCard';
import ScrollThumbnailCarousel from '../components/ScrollThumbnailCarousel';
import { ServiceModal } from '../components/Modals';
import { TESTIMONIALS, TRUST_METRICS } from '../data/mockData';

export default function Home() {
  const navigate = useNavigate();
  const { services, workers } = useWorkkar();
  const { t, tService } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  // Quick trade categories for hero pills
  const quickTrades = [
    { name: 'Electrician', icon: 'electrical_services', query: 'Electrician' },
    { name: 'Plumber', icon: 'plumbing', query: 'Plumber' },
    { name: 'Carpenter', icon: 'handyman', query: 'Carpenter' },
    { name: 'Painter', icon: 'format_paint', query: 'Painter' },
    { name: 'Cleaner', icon: 'cleaning_services', query: 'Cleaner' },
    { name: 'Mason', icon: 'architecture', query: 'Mason' },
  ];

  // Search submit - Navigates to /workers with search query parameters
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (locationQuery) params.append('location', locationQuery);
    navigate(`/workers?${params.toString()}`);
  };

  const handleQuickTradeClick = (tradeQuery) => {
    navigate(`/workers?search=${encodeURIComponent(tradeQuery)}`);
  };

  // Filter only featured/verified top workers for landing page
  const featuredWorkers = workers.filter(w => w.verified && (w.rating >= 4.8 || !w.rating)).slice(0, 3);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const howItWorksSteps = [
    { 
      num: "01", 
      title: t('home.steps.step1Title') || "Select Service & Location", 
      desc: t('home.steps.step1Desc') || "Pick your trade requirements and enter your current area or street address.",
      icon: "category"
    },
    { 
      num: "02", 
      title: t('home.steps.step2Title') || "Instant Nearby Match", 
      desc: t('home.steps.step2Desc') || "Our GPS algorithm matches with verified tradespeople ready to dispatch in 15 mins.",
      icon: "near_me"
    },
    { 
      num: "03", 
      title: t('home.steps.step3Title') || "Job Done, Release Pay", 
      desc: t('home.steps.step3Desc') || "Worker completes the task cleanly. You inspect and release payment securely.",
      icon: "verified"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* 1. Ultra-Modern Split Hero Section */}
      <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-surface to-background dark:from-slate-950 dark:via-slate-900/60 dark:to-background border-b border-outline-variant/20">
        {/* Subtle decorative glow blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headline, Search, & Quick Filters */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              
              {/* Pulsing Flash Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 text-primary dark:text-blue-400 text-xs font-extrabold tracking-wide uppercase"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>⚡ 15-Min Instant Dispatch • 5,000+ Verified Pros</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display-lg text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-on-surface tracking-tight leading-[1.12]"
              >
                {t('home.heroTitlePrefix') || 'Instant On-Demand'} <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  {t('home.heroTitleHighlight') || 'Daily Wage Workers'}
                </span>{' '}
                Near You
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed font-normal"
              >
                {t('home.heroSubtitle') || 'Directly book background-verified electricians, plumbers, carpenters, painters, and cleaners. Transparent hourly rates, zero broker fees, live map tracking.'}
              </motion.p>

              {/* Search Bar Component */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full max-w-xl"
              >
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  locationQuery={locationQuery}
                  setLocationQuery={setLocationQuery}
                  onSearch={handleSearch}
                />
              </motion.div>

              {/* Quick-filter Category Pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full flex flex-wrap items-center gap-2 pt-1"
              >
                <span className="text-xs font-bold text-on-surface-variant mr-1">Popular:</span>
                {quickTrades.map((qt) => (
                  <button
                    key={qt.name}
                    onClick={() => handleQuickTradeClick(qt.query)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-surface-container-lowest dark:bg-slate-800 text-on-surface border border-outline-variant/40 hover:border-primary hover:text-primary transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      {qt.icon}
                    </span>
                    {tService(qt.name)}
                  </button>
                ))}
              </motion.div>

              {/* Social Proof Mini Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-6 pt-3 border-t border-outline-variant/20 w-full flex-wrap"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-surface object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                    <img className="w-8 h-8 rounded-full border-2 border-surface object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                    <img className="w-8 h-8 rounded-full border-2 border-surface object-cover shadow-sm" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star size={12} className="fill-amber-500" />
                      <span>4.9 / 5.0</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-semibold">10,000+ Happy Bookings</p>
                  </div>
                </div>

                <div className="h-6 w-[1px] bg-outline-variant/40 hidden sm:block"></div>

                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-on-surface">100% Verified</p>
                    <p className="text-[11px] text-on-surface-variant">Aadhaar & Police Checked</p>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Interactive Visual Showcase & Floating Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center items-center"
            >
              {/* Outer Decorative Ring */}
              <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 dark:border-slate-800/80">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=85"
                  alt="Verified Professional Tradesperson"
                  className="w-full h-full object-cover"
                />

                {/* Bottom Gradient Overlay with CTA */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">Live Available Now</span>
                  </div>
                  <h3 className="font-display-lg text-2xl font-extrabold text-white leading-tight">
                    Reliable Hands for Every Job
                  </h3>
                  <p className="text-xs text-slate-200 mt-1">
                    Direct hourly booking with immediate dispatch & GPS arrival.
                  </p>
                </div>
              </div>

              {/* Floating Glass Badge 1: Live Worker Dispatch (Top-Left) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-4 -left-6 sm:-left-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-3 z-20 max-w-[230px]"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-primary dark:text-blue-400 shrink-0">
                  <Zap size={20} className="fill-primary" />
                </div>
                <div className="text-left text-xs">
                  <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                    Live Dispatch
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Worker arriving in <span className="font-bold text-emerald-600 dark:text-emerald-400">12 mins</span>
                  </p>
                </div>
              </motion.div>

              {/* Floating Glass Badge 2: Escrow & Verified Guarantee (Bottom-Right) */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-3 z-20 max-w-[240px]"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <BadgeCheck size={22} />
                </div>
                <div className="text-left text-xs">
                  <p className="font-extrabold text-slate-900 dark:text-white">
                    Escrow Protection
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Pay only after job approval
                  </p>
                </div>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Interactive Horizontal Scroll Thumbnail Carousel */}
      <section className="py-16 bg-surface-container-low/50 dark:bg-slate-950/40 border-b border-outline-variant/15">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <ScrollThumbnailCarousel
            services={services}
            onSelectService={(svc) => setSelectedService(svc)}
          />
        </div>
      </section>

      {/* 3. Live Trust & Quality Metrics Bar */}
      <section className="py-10 bg-surface border-b border-outline-variant/15">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_METRICS.map((metric) => (
              <div
                key={metric.id}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">{metric.icon}</span>
                </div>
                <div className="text-left">
                  <h4 className="font-display-lg text-lg sm:text-xl font-extrabold text-on-surface">
                    {metric.value}
                  </h4>
                  <p className="font-label-md text-xs font-bold text-on-surface-variant">
                    {metric.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Top Verified Tradespeople Showcase */}
      <section className="py-20 bg-surface-container-low/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-primary mb-1">
                <Sparkles size={14} /> Top Verified Experts
              </span>
              <h2 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                {t('home.featuredWorkersTitle') || 'Featured Service Pros'}
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">
                {t('home.featuredWorkersSubtitle') || 'Top-rated specialists ready for immediate nearby hire.'}
              </p>
            </div>
            
            <button
              onClick={() => navigate('/workers')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-bold text-xs border border-outline-variant/40 hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>{t('common.viewAll')} {t('nav.workers')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredWorkers.map((worker) => (
              <motion.div key={worker.id} variants={itemVariants}>
                <WorkerCard worker={worker} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. How It Works (Simple 3-Step Process) */}
      <section className="py-20 bg-surface border-t border-outline-variant/15">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-primary mb-2">
              Simple & Transparent
            </span>
            <h2 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
              {t('home.howItWorksTitle') || 'How Workkar Works'}
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-2 leading-relaxed">
              {t('home.howItWorksSubtitle') || 'Get daily wage trade services completed seamlessly in 3 simple steps.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {howItWorksSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.4 }}
                className="relative p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                </div>
                
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary mb-1">
                  Step {step.num}
                </span>
                
                <h3 className="font-title-md text-lg font-extrabold text-on-surface mb-2">
                  {step.title}
                </h3>
                
                <p className="font-body-md text-xs text-on-surface-variant leading-relaxed px-2">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials Showcase with Real Photos */}
      <section className="py-20 bg-surface-container-low/40 border-t border-outline-variant/15">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-primary mb-2">
              ⭐ Genuine Reviews
            </span>
            <h2 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
              Trusted by 10,000+ Customers
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-2">
              See what real homeowners and site managers say about Workkar tradespeople.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={15} className="fill-amber-500" />
                    ))}
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant italic leading-relaxed mb-6">
                    "{item.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-surface shadow-sm"
                  />
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-on-surface flex items-center gap-1">
                      {item.name}
                      <CheckCircle2 size={12} className="text-emerald-500" />
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      {item.service} • {item.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. High-Impact Worker Partner Call-to-Action Banner */}
      <section className="py-16 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 md:p-14 shadow-2xl">
            {/* Background Texture & Glow */}
            <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 text-left space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/10 text-emerald-300 border border-white/10 uppercase tracking-wider">
                  👷 Worker Partner Onboarding
                </span>
                <h2 className="font-display-lg text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  Are You a Skilled Tradesperson? Earn Daily Wage on Your Terms.
                </h2>
                <p className="font-body-md text-sm text-slate-300 max-w-xl leading-relaxed">
                  Join 5,000+ verified electricians, plumbers, carpenters, and painters. Get direct job alerts in your area, guaranteed instant daily payouts, and zero registration fees.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => navigate('/worker/register')}
                    className="bg-primary-container text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer border-none"
                  >
                    <span>Register as Worker Partner</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => navigate('/worker/login')}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all border border-white/20 active:scale-95 cursor-pointer"
                  >
                    Partner Login
                  </button>
                </div>
              </div>

              <div className="md:col-span-4 flex justify-center">
                <div className="w-44 h-44 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl relative">
                  <img
                    src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80"
                    alt="Happy Partner Worker"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                    <span className="text-[10px] font-extrabold text-white bg-emerald-500/90 px-2 py-0.5 rounded-full">
                      Verified Partner
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
}
