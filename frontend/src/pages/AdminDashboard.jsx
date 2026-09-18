import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkkar } from '../context/WorkkarContext';
import { useLanguage } from '../context/LanguageContext';
import { getFileUrl } from '../config/api';
import DashboardCard from '../components/DashboardCard';

export default function AdminDashboard() {
  const [selectedWorker, setSelectedWorker] = useState(null);
  const {
    workers,
    dbUsers,
    pendingApprovals,
    assignments,
    approveWorker,
    rejectWorker,
    suspendUser,
    restoreUser,
    fetchDbUsers,
    fetchAnalytics,
    analytics,
    addNotification
  } = useWorkkar();
  const { t, tRole, tStatus, tSkill } = useLanguage();

  useEffect(() => {
    fetchDbUsers();
    fetchAnalytics();
  }, []);

  // Stats calculation
  const totalRevenue = analytics ? `$${analytics.revenue.toLocaleString()}` : "$24,500";
  const jobRequests = analytics ? analytics.jobRequests.toString() : "1,284";
  const activeWorkersCount = workers.filter(w => w.availability !== 'Offline').length;
  const pendingApprovalsCount = pendingApprovals.length;

  // Filter customers & workers for moderation (Admins cannot modify admins or supreme-admins)
  const moderationUsers = dbUsers.filter(u => u.role === 'customer' || u.role === 'worker');

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Welcome & Quick Actions Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold leading-none">
            {t('adminDashboard.welcome')}
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant mt-1.5">
            {t('adminDashboard.subtitle')}
          </p>
        </div>
      </div>

      {/* Analytics Bento Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack-md">
        <DashboardCard
          icon="payments"
          title={t('adminDashboard.statsTotalRevenue')}
          value={totalRevenue}
          trend="+12.5%"
          trendType="positive"
          footerLabel="vs last month"
          largeIcon="payments"
        />
        <DashboardCard
          icon="work_history"
          title={t('adminDashboard.statsActiveBookings')}
          value={jobRequests}
          trend="+5.2%"
          trendType="positive"
          footerLabel="Active this week"
          largeIcon="work_history"
        />
        <DashboardCard
          icon="engineering"
          title={t('adminDashboard.statsTotalWorkers')}
          value={activeWorkersCount}
          trend={t('common.online')}
          trendType="neutral"
          footerLabel={t('common.available')}
          largeIcon="engineering"
        />
        <DashboardCard
          icon="pending_actions"
          iconBg="bg-error-container text-on-error-container"
          title={t('adminDashboard.tabVerifications')}
          value={pendingApprovalsCount}
          trend={pendingApprovalsCount > 0 ? "Action Required" : "All Clear"}
          trendType={pendingApprovalsCount > 0 ? "negative" : "neutral"}
          footerLabel={t('common.pending')}
          largeIcon="pending_actions"
        />
      </div>

      {/* Grid: Verifications Table & Assignments Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        
        {/* Verification Board (Span 2) */}
        <div className="lg:col-span-2">
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 ambient-shadow-base overflow-hidden flex flex-col">
            
            <div className="p-stack-md border-b border-outline-variant/30 flex justify-between items-center bg-surface/50">
              <h3 className="font-title-md text-sm text-on-surface font-bold uppercase tracking-wider">
                {t('adminDashboard.tabVerifications')}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-outline-variant/20 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="p-3">{t('common.worker')}</th>
                    <th className="p-3">{t('workersPage.skillLabel')}</th>
                    <th className="p-3">{t('common.date')}</th>
                    <th className="p-3 text-right">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {pendingApprovals.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-on-surface-variant text-sm">
                        <span className="material-symbols-outlined text-4xl text-outline mb-2 block fill text-emerald-600">
                          check_circle
                        </span>
                        <p className="font-bold">{t('common.verified')}</p>
                        <p className="text-xs text-outline mt-0.5">{t('common.noData')}</p>
                      </td>
                    </tr>
                  ) : (
                    pendingApprovals.map((worker) => (
                      <tr 
                        key={worker.id} 
                        className="hover:bg-surface-container-low/30 transition-colors text-xs"
                      >
                        <td className="p-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary font-extrabold text-xs">
                            {worker.avatarInitials}
                          </div>
                          <span className="font-bold text-on-surface">{worker.name}</span>
                        </td>
                        <td className="p-3 text-on-surface-variant">{tSkill(worker.skill)}</td>
                        <td className="p-3 text-on-surface-variant">{worker.time}</td>
                        <td className="p-3 text-right flex justify-end gap-1.5">
                          <button 
                            onClick={() => setSelectedWorker(worker)}
                            className="text-primary hover:bg-primary-container hover:text-on-primary-container dark:text-blue-400 dark:hover:bg-blue-950/50 p-1.5 rounded-full transition-colors flex items-center justify-center cursor-pointer" 
                            title={t('adminDashboard.viewDetails')}
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                          <button 
                            onClick={() => approveWorker(worker.id)}
                            className="text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 p-1.5 rounded-full transition-colors flex items-center justify-center cursor-pointer" 
                            title={t('adminDashboard.approveBtn')}
                          >
                            <span className="material-symbols-outlined text-[18px] fill">check_circle</span>
                          </button>
                          <button 
                            onClick={() => rejectWorker(worker.id)}
                            className="text-error hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 p-1.5 rounded-full transition-colors flex items-center justify-center cursor-pointer" 
                            title={t('adminDashboard.rejectBtn')}
                          >
                            <span className="material-symbols-outlined text-[18px] fill">cancel</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </section>
        </div>

        {/* Recent Assignments (Span 1) */}
        <div className="lg:col-span-1">
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 ambient-shadow-base overflow-hidden flex flex-col h-full justify-between">
            <div>
              <div className="p-stack-md border-b border-outline-variant/30 flex justify-between items-center bg-surface/50">
                <h3 className="font-title-md text-sm text-on-surface font-bold uppercase tracking-wider">
                  {t('adminDashboard.tabDispatches')}
                </h3>
              </div>

              <div className="p-4 flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                {assignments.length === 0 ? (
                  <p className="text-xs text-on-surface-variant text-center py-6">{t('common.noData')}</p>
                ) : (
                  assignments.map((job) => {
                    let statusStyle = 'bg-slate-100 text-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:border dark:border-slate-800/40';
                    if (job.status === 'Active') {
                      statusStyle = 'bg-primary-container text-on-primary-container border border-primary/20';
                    } else if (job.status === 'Completed') {
                      statusStyle = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/40';
                    }

                    return (
                      <div 
                        key={job.id} 
                        className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-outline-variant/10 hover:border-primary/15 transition-colors"
                      >
                        <div className="p-2 bg-surface-container rounded-lg text-primary shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">{job.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-on-surface truncate">{job.title}</p>
                          <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">{t('common.worker')}: {job.worker}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap uppercase tracking-wider ${statusStyle}`}>
                          {tStatus(job.status)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="p-3 border-t border-outline-variant/30 text-center bg-surface/30">
              <button 
                onClick={() => addNotification("Dispatch logs database query is synced.", 'success')}
                className="text-primary hover:text-primary/90 hover:underline dark:text-blue-400 dark:hover:text-blue-300 font-bold text-xs transition-colors w-full cursor-pointer"
              >
                {t('adminDashboard.tabDispatches')}
              </button>
            </div>

          </section>
        </div>

      </div>

      {/* User Moderation Board (Customers & Workers list) */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 ambient-shadow-base overflow-hidden flex flex-col mt-4">
        
        <div className="p-stack-md border-b border-outline-variant/30 bg-surface/50">
          <h3 className="font-title-md text-sm text-on-surface font-bold uppercase tracking-wider">
            {t('adminDashboard.tabUsers')}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/20 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                <th className="p-3">{t('common.name')}</th>
                <th className="p-3">{t('auth.emailLabel')}</th>
                <th className="p-3">{t('common.role')}</th>
                <th className="p-3">{t('common.status')}</th>
                <th className="p-3 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-xs">
              {moderationUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-on-surface-variant text-sm">
                    {t('common.noData')}
                  </td>
                </tr>
              ) : (
                moderationUsers.map((u) => {
                  let statusBadgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
                  if (u.status === 'suspended') {
                    statusBadgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-300';
                  } else if (u.status === 'banned') {
                    statusBadgeColor = 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300';
                  } else if (u.status === 'pending') {
                    statusBadgeColor = 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300';
                  }

                  return (
                    <tr key={u._id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="p-3 font-bold text-on-surface">{u.name}</td>
                      <td className="p-3 text-on-surface-variant">{u.email}</td>
                      <td className="p-3">
                        <span className="font-semibold uppercase text-[9px] tracking-wider bg-surface-container-high px-2 py-0.5 rounded">
                          {tRole(u.role)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`font-bold uppercase text-[8px] px-1.5 py-0.5 rounded tracking-wide ${statusBadgeColor}`}>
                          {tStatus(u.status)}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {u.role === 'worker' && (
                          <button
                            type="button"
                            onClick={() => {
                              const initials = u.textAvatar || (u.name || 'WK').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                              setSelectedWorker({
                                id: u._id,
                                name: u.name,
                                skill: u.skill || u.profession || 'Technician',
                                email: u.email,
                                mobile: u.mobile || u.phone || 'N/A',
                                age: u.age || 'N/A',
                                gender: u.gender || 'N/A',
                                profession: u.skill || u.profession,
                                profilePhoto: u.profilePhoto || u.avatar,
                                aadhaarCard: u.aadhaarCard || u.verificationDocument,
                                panCard: u.panCard,
                                formattedAddress: u.formattedAddress || u.address || 'N/A',
                                avatarInitials: initials,
                                experience: u.experience || 0,
                                rate: u.rate || 20,
                                description: u.description || ''
                              });
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase px-3 py-1 rounded transition-colors active:scale-95 mr-2 cursor-pointer"
                          >
                            {t('adminDashboard.viewDetails')}
                          </button>
                        )}
                        {u.status === 'active' ? (
                          <button
                            onClick={() => suspendUser(u._id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-[10px] uppercase px-3 py-1 rounded transition-colors active:scale-95 cursor-pointer"
                          >
                            {t('supremeAdmin.suspendUser')}
                          </button>
                        ) : u.status === 'suspended' ? (
                          <button
                            onClick={() => restoreUser(u._id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase px-3 py-1 rounded transition-colors active:scale-95 cursor-pointer"
                          >
                            {t('supremeAdmin.restoreUser')}
                          </button>
                        ) : (
                          <span className="text-on-surface-variant font-medium text-[10px]">Restricted</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Verification Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0">
                  {selectedWorker.profilePhoto ? (
                    <img
                      src={getFileUrl(selectedWorker.profilePhoto)}
                      alt={selectedWorker.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-extrabold text-lg text-primary bg-blue-50 dark:bg-slate-800">
                      {selectedWorker.avatarInitials}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                    {selectedWorker.name}
                  </h3>
                  <span className="inline-block text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-slate-800/80 text-blue-700 dark:text-blue-400 px-2.5 py-1.5 rounded-full mt-1.5">
                    {tSkill(selectedWorker.skill)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedWorker(null)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">{t('auth.emailLabel')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-sm mt-0.5 select-all">{selectedWorker.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">{t('auth.phoneLabel')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-sm mt-0.5 select-all">{selectedWorker.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block font-bold">{t('workerAuth.experienceLabel')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-sm mt-0.5">{selectedWorker.experience} {t('common.yrsExp')}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block font-bold">{t('workerAuth.hourlyRateLabel')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-sm mt-0.5">${selectedWorker.rate}{t('common.perHr')}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block font-bold">{t('auth.addressLabel')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-sm mt-0.5">{selectedWorker.formattedAddress}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block font-bold">{t('workerDetails.aboutWorker')}</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5 leading-relaxed whitespace-pre-wrap">{selectedWorker.description || t('workerAuth.registerSubtitle')}</p>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="py-2.5 px-4 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl transition-all cursor-pointer"
              >
                {t('common.close')}
              </button>

              <button
                type="button"
                onClick={() => {
                  rejectWorker(selectedWorker.id);
                  setSelectedWorker(null);
                }}
                className="py-2.5 px-4 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 text-red-650 dark:text-red-400 border border-red-500/25 font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] fill">cancel</span>
                {t('adminDashboard.rejectBtn')}
              </button>

              <button
                type="button"
                onClick={() => {
                  approveWorker(selectedWorker.id);
                  setSelectedWorker(null);
                }}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] fill">check_circle</span>
                {t('adminDashboard.approveBtn')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
