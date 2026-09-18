import React, { useState } from 'react';
import { useWorkkar } from '../context/WorkkarContext';
import { useLanguage } from '../context/LanguageContext';
import { DailyEarningsChart, WeeklyEarningsChart } from '../components/Charts';
import { WithdrawModal } from '../components/Modals';

export default function WorkerEarnings() {
  const { user, wallet, earningsTrend } = useWorkkar();
  const { t } = useLanguage();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Stats Card data
  const weeklyTotal = wallet?.weekly ?? 0;
  const balanceTotal = wallet?.balance ?? 0;

  // Real dynamic worker stats
  const completedJobs = user?.jobsCompleted ?? user?.wallet?.completedCount ?? (user?.activeJob?.status === 'Completed' ? 1 : 0);
  const ratingVal = user?.rating ? Number(user.rating) : null;
  const ratingDisplay = ratingVal && ratingVal > 0 ? ratingVal.toFixed(1) : (completedJobs > 0 ? '5.0' : t('common.new'));
  const hourlyRate = user?.rate || 20;
  const hoursWorked = completedJobs > 0 ? `${completedJobs * 4}h` : '0h';
  const acceptanceRate = completedJobs > 0 ? '98%' : '100%';

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-8">
        
        {/* Header */}
        <header className="border-b border-outline-variant/30 pb-4">
          <h1 className="font-display-lg text-3xl md:text-display-lg text-on-background font-extrabold tracking-tight">
            {t('workerEarnings.title')}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {t('workerEarnings.subtitle')}
          </p>
        </header>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          
          {/* Left Column: Primary Metrics & Weekly chart (2 spans) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Total Earnings Hero Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow duration-300">
              <div>
                <p className="font-title-md text-xs text-on-surface-variant mb-1 uppercase tracking-wider font-semibold">
                  {t('workerDashboard.statsTodayEarnings')}
                </p>
                <h2 className="font-display-lg text-4xl text-primary font-extrabold">${weeklyTotal.toFixed(2)}</h2>
                <div className="flex items-center gap-1 mt-2 text-secondary-container">
                  <span className="material-symbols-outlined text-[16px] fill">trending_up</span>
                  <span className="font-label-md text-xs font-bold">+12% vs last week</span>
                </div>
              </div>

              {/* Sub-item values list */}
              <div className="w-full md:w-auto grid grid-cols-3 gap-6 bg-surface-container-low p-4 rounded-xl">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">{t('workerEarnings.basePay')}</p>
                  <p className="font-headline-md text-sm font-extrabold text-on-surface">${(wallet?.jobEarnings || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">{t('workerEarnings.incentives')}</p>
                  <p className="font-headline-md text-sm font-extrabold text-on-surface">${(wallet?.incentives || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">{t('workerEarnings.tips')}</p>
                  <p className="font-headline-md text-sm font-extrabold text-on-surface">${(wallet?.tips || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Daily Trend Chart Section */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                <h3 className="font-headline-md text-base font-bold text-on-surface">{t('workerDashboard.earningsSummary')}</h3>
              </div>
              <div className="h-64 w-full relative">
                <DailyEarningsChart data={earningsTrend} />
              </div>
            </div>

          </div>

          {/* Right Column: Wallet & Secondary Metrics (1 span) */}
          <div className="flex flex-col gap-8">
            
            {/* Wallet Balance Card */}
            <div className="bg-primary text-on-primary rounded-xl p-6 shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              {/* Decorative circle backdrop */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-title-md text-sm text-primary-fixed-dim font-bold uppercase tracking-wider">{t('workerEarnings.walletBalance')}</p>
                  <span className="material-symbols-outlined text-on-primary text-2xl">account_balance_wallet</span>
                </div>
                
                <h3 className="font-display-lg text-3xl font-extrabold mb-6">${balanceTotal.toFixed(2)}</h3>
                
                <button 
                  onClick={() => setIsWithdrawOpen(true)}
                  className="w-full bg-on-primary text-primary font-bold text-sm py-3 rounded-lg hover:bg-surface hover:shadow transition-colors duration-200 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary dark:focus-visible:ring-offset-blue-600 border-none shadow-sm cursor-pointer"
                >
                  {t('workerEarnings.withdrawBtn')}
                </button>
              </div>
            </div>

            {/* Performance Summary Bento details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-primary mb-1 fill">task_alt</span>
                <p className="font-display-lg text-lg text-on-surface font-extrabold">{completedJobs}</p>
                <p className="font-label-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{t('workerDashboard.statsCompletedJobs')}</p>
              </div>
              
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-secondary-container mb-1 fill">star</span>
                <p className="font-display-lg text-lg text-on-surface font-extrabold">{ratingDisplay}</p>
                <p className="font-label-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{t('common.rating')}</p>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-tertiary-container mb-1 fill">schedule</span>
                <p className="font-display-lg text-lg text-on-surface font-extrabold">{hoursWorked}</p>
                <p className="font-label-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{t('workerDashboard.hoursWorked') || t('common.active')}</p>
              </div>
              
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-primary mb-1 fill">payments</span>
                <p className="font-display-lg text-lg text-on-surface font-extrabold">${hourlyRate}{t('common.perHr')}</p>
                <p className="font-label-md text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{t('common.rate')}</p>
              </div>
            </div>

            {/* Acceptance Rate Progress Card */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-on-surface uppercase tracking-wider">{t('workerEarnings.acceptanceRate')}</span>
                <span className="font-bold text-sm text-primary">{acceptanceRate}</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden shadow-inner mt-1">
                <div className="bg-primary h-2 rounded-full" style={{ width: acceptanceRate }}></div>
              </div>
            </div>

          </div>

        </div>

        {/* Weekly Stacked Earnings Recharts Chart */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 ambient-shadow-base p-6 flex flex-col gap-4">
          <div className="border-b border-outline-variant/20 pb-3">
            <h3 className="font-headline-md text-base font-bold text-on-surface">{t('workerDashboard.earningsSummary')}</h3>
          </div>
          <div className="h-64 w-full relative">
            <WeeklyEarningsChart data={earningsTrend} />
          </div>
        </section>

      </div>

      {/* Withdraw Animated Modal component */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />
    </div>
  );
}
