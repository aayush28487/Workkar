import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWorkkar } from '../context/WorkkarContext';
import { useLanguage } from '../context/LanguageContext';
import DashboardCard from '../components/DashboardCard';
import ChatBox from '../components/ChatBox';

export default function CustomerDashboard() {
  const {
    user,
    cancelBooking,
    submitReview,
    markNotificationsRead,
    markSingleNotificationRead,
    clearNotifications,
    addNotification,
    workers,
    approveJobCompletion
  } = useWorkkar();
  const { t, tStatus, tSkill } = useLanguage();

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Active chat state
  const [activeChatJobId, setActiveChatJobId] = useState(null);
  const toggleChat = (jobId) => {
    setActiveChatJobId(prev => prev === jobId ? null : jobId);
  };

  // Past booking invoice detail modal
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState(null);

  // Dismissed completed bookings banner
  const [dismissedCompletedBookings, setDismissedCompletedBookings] = useState(() => {
    const saved = localStorage.getItem('workkar_dismissed_completed');
    return saved ? JSON.parse(saved) : [];
  });

  const dismissCompletedBanner = (bookingId) => {
    const updated = [...dismissedCompletedBookings, bookingId];
    setDismissedCompletedBookings(updated);
    localStorage.setItem('workkar_dismissed_completed', JSON.stringify(updated));
  };

  // Mark all notifications as read when dashboard mounts
  useEffect(() => {
    if (user && user.notifications && user.notifications.some(n => !n.read)) {
      markNotificationsRead();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate statistics
  const bookingsList = user.bookings || [];
  const notificationsList = [...(user.notifications || [])].reverse(); // newest first

  const activeBookings = bookingsList.filter(b => 
    ['Pending', 'Accepted', 'En Route', 'In Progress', 'Pending Approval'].includes(b.status)
  );
  const completedBookings = bookingsList.filter(b => b.status === 'Completed');
  const totalSpent = completedBookings.reduce((sum, b) => sum + b.total, 0);
  const unreadAlerts = user.notifications ? user.notifications.filter(n => !n.read).length : 0;

  // Handle Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addNotification(t('modals.reviewPlaceholder'), 'error');
      return;
    }
    setSubmitting(true);
    const workerId = selectedWorker.workerId;
    const success = await submitReview(workerId, rating, comment);
    setSubmitting(false);
    if (success) {
      if (selectedWorker.id) {
        dismissCompletedBanner(selectedWorker.id);
      }
      setShowReviewModal(false);
      setComment('');
      setRating(5);
      setSelectedWorker(null);
    }
  };

  // Status badge style helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-500/20';
      case 'Pending Approval':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border border-orange-500/20';
      case 'Accepted':
      case 'En Route':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-500/20';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-500/20 animate-pulse';
      case 'Cancelled':
      case 'Declined':
      default:
        return 'bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border border-outline-variant/30';
    }
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md border-b border-outline-variant/30 pb-stack-md">
          <div>
            <h1 className="font-display-lg text-3xl md:text-display-lg text-on-surface font-extrabold tracking-tight">
              {t('customerDashboard.welcome')}, {user.name.split(' ')[0]}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {t('customerDashboard.subtitle')}
            </p>
          </div>
          <div className="text-xs text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/30 font-semibold">
            {t('common.role')}: <span className="text-primary font-bold">{user.name}</span>
          </div>
        </div>

        {/* Newly Completed Bookings Banner */}
        <AnimatePresence>
          {bookingsList.filter(b => b.status === 'Completed' && !dismissedCompletedBookings.includes(b.id)).map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-[24px] fill">celebration</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">{t('activeJob.statusSteps.completed')}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {booking.workerName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    setSelectedWorker(booking);
                    setShowReviewModal(true);
                  }}
                  className="text-xs font-bold bg-primary text-on-primary hover:bg-primary/95 px-4 py-2 rounded-xl active:scale-95 transition-transform cursor-pointer"
                >
                  {t('customerDashboard.rateAndReview')}
                </button>
                <button
                  onClick={() => dismissCompletedBanner(booking.id)}
                  className="text-xs font-bold border border-outline-variant/60 text-on-surface hover:bg-surface-container-low px-4 py-2 rounded-xl active:scale-95 transition-transform cursor-pointer"
                >
                  {t('common.close')}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Bento Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <DashboardCard
            icon="pending_actions"
            title={t('customerDashboard.statsActiveJobs')}
            value={activeBookings.length}
            trend={activeBookings.length > 0 ? t('common.inProgress') : t('common.noData')}
            trendType={activeBookings.length > 0 ? "positive" : "neutral"}
            footerLabel={t('customerDashboard.subtitle')}
            largeIcon="pending_actions"
          />
          <DashboardCard
            icon="task_alt"
            title={t('customerDashboard.statsCompleted')}
            value={completedBookings.length}
            trend={t('customerDashboard.tabJobHistory')}
            trendType="neutral"
            footerLabel="WORKKAR"
            largeIcon="task_alt"
          />
          <DashboardCard
            icon="payments"
            title={t('customerDashboard.statsSpent')}
            value={`$${totalSpent.toFixed(2)}`}
            trend={t('common.verified')}
            trendType="neutral"
            footerLabel={t('activeJob.paymentSummary')}
            largeIcon="payments"
          />
          <DashboardCard
            icon="notifications"
            title={t('nav.notifications')}
            value={notificationsList.length}
            trend={unreadAlerts > 0 ? `${unreadAlerts} Unread` : t('common.active')}
            trendType={unreadAlerts > 0 ? "positive" : "neutral"}
            footerLabel={t('nav.notifications')}
            largeIcon="notifications"
          />
        </section>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          
          {/* Active Bookings Tracker (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col gap-5 ambient-shadow-base">
              <h2 className="font-headline-md text-lg font-bold text-on-surface border-b border-outline-variant/20 pb-3">
                {t('customerDashboard.tabActiveBookings')}
              </h2>

              {activeBookings.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <span className="material-symbols-outlined text-outline-variant text-5xl">engineering</span>
                  <p className="text-sm text-on-surface-variant font-medium">{t('customerDashboard.noActiveBookings')}</p>
                  <Link to="/workers" className="mt-2 inline-flex text-xs font-bold bg-primary text-on-primary px-4 py-2 rounded-xl active:scale-95 transition-transform hover:bg-primary/95 decoration-none">
                    {t('customerDashboard.findWorkersBtn')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeBookings.map((booking) => {
                    const step = booking.status === 'Pending' ? 1 : 
                                 (['Accepted', 'En Route'].includes(booking.status) ? 2 : 
                                 (booking.status === 'In Progress' ? 3 : 4));
                    const workerDetail = workers.find(w => w.id === booking.workerId);
                    return (
                      <div key={booking.id} className="p-5 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 space-y-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/10 pb-3">
                          <div>
                            <span className="text-[10px] font-bold tracking-wider text-primary uppercase font-mono">{t('customerDashboard.bookingId', { id: booking.id })}</span>
                            <h3 className="font-bold text-on-surface text-sm mt-0.5">{booking.workerName} — <span className="font-medium text-on-surface-variant">{tSkill(booking.skill)}</span></h3>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(booking.status)}`}>
                              {tStatus(booking.status)}
                            </span>
                            <span className="font-bold text-sm text-on-surface">${booking.total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Worker Detail Info Panel */}
                        {(() => {
                          const wName = workerDetail?.name || booking.workerName || 'Worker Partner';
                          const wSkill = workerDetail?.skillTitle ? tSkill(workerDetail.skillTitle) : (booking.skill ? tSkill(booking.skill) : 'Service Professional');
                          const wExp = workerDetail?.experience !== undefined ? `${workerDetail.experience} ${t('common.yrsExp')}` : t('common.verified');
                          const wRate = workerDetail?.rate !== undefined ? `$${workerDetail.rate}${t('common.perHr')}` : 'Custom rate';
                          const wRating = workerDetail?.rating ? workerDetail.rating.toFixed(1) : '5.0';
                          const hasAvatar = !!workerDetail?.avatar;
                          const wAvatar = workerDetail?.avatar;
                          const wTextAvatar = workerDetail?.textAvatar || wName.substring(0, 2).toUpperCase();
                          const isVerified = workerDetail?.verified ?? true;

                          return (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-surface-container-lowest/80 rounded-xl border border-outline-variant/20 shadow-sm transition-all duration-200">
                              <div className="flex items-center gap-3">
                                {hasAvatar ? (
                                  <img
                                    src={wAvatar}
                                    alt={wName}
                                    className="w-12 h-12 rounded-xl object-cover border border-outline-variant/30 shadow-sm"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg border border-outline-variant/30 shadow-sm">
                                    {wTextAvatar}
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="font-bold text-on-surface text-sm">{wName}</h4>
                                    {isVerified && (
                                      <span className="material-symbols-outlined text-green-600 text-[16px] fill" title={t('common.verified')}>
                                        verified
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-on-surface-variant text-[11px] font-medium leading-none mt-1">
                                    {wSkill} • {wExp}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-primary">
                                    <span className="material-symbols-outlined text-[13px] text-amber-500 fill">star</span>
                                    <span>{wRating}</span>
                                    <span className="text-on-surface-variant font-medium">•</span>
                                    <span>{wRate}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Call & Message Actions */}
                              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button
                                  onClick={() => addNotification(`Calling ${wName}...`, 'success')}
                                  className="bg-surface-container-high hover:bg-surface-variant text-primary p-2.5 rounded-xl flex items-center justify-center transition-colors border border-outline-variant/10 shadow-sm cursor-pointer"
                                  title={`Call ${wName}`}
                                >
                                  <span className="material-symbols-outlined text-[18px]">call</span>
                                </button>
                                {['Accepted', 'En Route', 'In Progress', 'Pending Approval'].includes(booking.status) && (
                                  <button
                                    onClick={() => toggleChat(booking.id)}
                                    className={`p-2.5 rounded-xl flex items-center justify-center transition-colors border shadow-sm cursor-pointer ${
                                      activeChatJobId === booking.id
                                        ? 'bg-blue-600 border-blue-600 text-white font-bold'
                                        : 'bg-surface-container-high hover:bg-surface-variant border-outline-variant/10 text-primary'
                                    }`}
                                    title={`Message ${wName}`}
                                  >
                                    <span className="material-symbols-outlined text-[18px]">chat</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Interactive Steps Progress Tracker */}
                        <div className="relative pt-2">
                          <div className="absolute top-1/2 left-0 right-0 h-1 bg-outline-variant/20 -translate-y-1/2 z-0"></div>
                          <div 
                            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                          ></div>
                          <div className="relative flex justify-between z-10">
                            {[
                              { label: t('common.pending'), icon: 'pending_actions', text: t('customerDashboard.scheduledFor') },
                              { label: t('activeJob.statusSteps.onWay'), icon: 'local_shipping', text: t('activeJob.statusSteps.onWay') },
                              { label: t('activeJob.statusSteps.inProgress'), icon: 'engineering', text: t('activeJob.statusSteps.inProgress') },
                              { label: t('activeJob.statusSteps.completed'), icon: 'rate_review', text: t('common.confirm') }
                            ].map((s, idx) => {
                              const active = step >= idx + 1;
                              return (
                                <div key={idx} className="flex flex-col items-center text-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                    active 
                                      ? 'bg-primary border-primary text-on-primary shadow' 
                                      : 'bg-surface border-outline-variant/30 text-on-surface-variant'
                                  }`}>
                                    <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                                  </div>
                                  <span className={`text-[10px] font-bold mt-1.5 ${active ? 'text-primary' : 'text-on-surface-variant'}`}>
                                    {s.label}
                                  </span>
                                  <span className="text-[8px] text-on-surface-variant max-w-[80px] hidden sm:block">
                                    {s.text}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Cancellation options */}
                        {['Pending', 'Accepted'].includes(booking.status) && (
                          <div className="flex justify-end pt-2 border-t border-outline-variant/10">
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              className="text-xs font-bold text-error bg-error/10 hover:bg-error/20 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                              {t('customerDashboard.cancelBooking')}
                            </button>
                          </div>
                        )}

                        {/* Completion Approval / Release Payout Banners */}
                        {booking.status === 'Pending Approval' && (
                          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                            <div className="space-y-1">
                              <h4 className="font-bold text-amber-800 dark:text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-amber-600 dark:text-amber-400 animate-pulse">lock_open</span>
                                {t('common.confirm')}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('activeJob.paymentSummary')}: <span className="font-bold text-on-surface">${booking.total.toFixed(2)}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => approveJobCompletion(booking.id)}
                              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 border-none cursor-pointer flex items-center gap-1.5 shrink-0"
                            >
                              <span className="material-symbols-outlined text-[16px]">payments</span>
                              {t('activeJob.markComplete')}
                            </button>
                          </div>
                        )}

                        {/* Live Chat Box */}
                        {activeChatJobId === booking.id && (
                          <div className="mt-4 border-t border-outline-variant/10 pt-4">
                            <ChatBox 
                              jobId={booking.id} 
                              currentUserId={user._id} 
                              title={`Chat with ${booking.workerName}`} 
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Booking History */}
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col gap-5 ambient-shadow-base">
              <h2 className="font-headline-md text-lg font-bold text-on-surface border-b border-outline-variant/20 pb-3">
                {t('customerDashboard.tabJobHistory')}
              </h2>

              {bookingsList.filter(b => ['Completed', 'Cancelled', 'Declined'].includes(b.status)).length === 0 ? (
                <div className="text-center py-8 text-xs text-on-surface-variant font-medium">
                  {t('common.noData')}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-outline-variant/20 text-on-surface-variant font-bold uppercase tracking-wider">
                        <th className="pb-3 pr-2">{t('common.worker')}</th>
                        <th className="pb-3 pr-2">{t('workersPage.skillLabel')}</th>
                        <th className="pb-3 pr-2">{t('common.date')}</th>
                        <th className="pb-3 pr-2">{t('common.price')}</th>
                        <th className="pb-3 pr-2">{t('common.status')}</th>
                        <th className="pb-3 text-right">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 font-semibold text-on-surface">
                      {bookingsList
                        .filter(b => ['Completed', 'Cancelled', 'Declined'].includes(b.status))
                        .reverse()
                        .map((booking, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low/20 transition-colors">
                            <td className="py-3.5 pr-2 font-bold">{booking.workerName}</td>
                            <td className="py-3.5 pr-2 text-on-surface-variant font-medium">{tSkill(booking.skill)}</td>
                            <td className="py-3.5 pr-2 text-on-surface-variant font-medium font-mono">
                              {new Date(booking.date).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 pr-2 font-bold">${booking.total.toFixed(2)}</td>
                            <td className="py-3.5 pr-2">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(booking.status)}`}>
                                {tStatus(booking.status)}
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {booking.status === 'Completed' && (
                                  <button
                                    onClick={() => {
                                      setSelectedWorker(booking);
                                      setShowReviewModal(true);
                                    }}
                                    className="text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    {t('customerDashboard.rateAndReview')}
                                  </button>
                                )}
                                <Link
                                  to={`/worker-details/${booking.workerId}`}
                                  className="text-[10px] font-bold bg-secondary/10 text-secondary hover:bg-secondary/25 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-center decoration-none"
                                >
                                  {t('customerDashboard.rebook')}
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          {/* Notifications Panel (Span 1) */}
          <div className="lg:col-span-1">
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex flex-col gap-4 ambient-shadow-base h-full justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3 mb-4">
                  <h2 className="font-headline-md text-lg font-bold text-on-surface">
                    {t('nav.notifications')}
                  </h2>
                  {notificationsList.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] font-bold text-error hover:underline cursor-pointer"
                    >
                      {t('common.delete')}
                    </button>
                  )}
                </div>

                {notificationsList.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <span className="material-symbols-outlined text-outline-variant text-4xl">notifications_off</span>
                    <p className="text-xs text-on-surface-variant">{t('common.noData')}</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    {notificationsList.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => {
                          if (!notif.read) {
                            markSingleNotificationRead(notif.id);
                          }
                        }}
                        className={`p-3.5 rounded-xl border border-outline-variant/20 text-xs leading-relaxed space-y-1 relative group transition-all cursor-pointer hover:border-primary/20 ${
                          notif.read ? 'bg-surface/40 opacity-75' : 'bg-primary/5 border-primary/20 shadow-sm'
                        }`}
                        title={notif.read ? "Notification read" : "Click to mark as read"}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <p className={`font-bold ${notif.read ? 'text-on-surface-variant' : 'text-primary'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[9px] text-outline-variant">
                            {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-on-surface-variant font-medium text-[11px]">
                          {notif.message}
                        </p>
                        {!notif.read && (
                          <div className="absolute right-2 bottom-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse group-hover:scale-125 transition-transform" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>

      </div>

      {/* Leave Review Dialog Modal */}
      <AnimatePresence>
        {showReviewModal && selectedWorker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
              className="absolute inset-0 bg-on-surface"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-2xl max-w-md w-full relative z-10 space-y-5"
            >
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                <h3 className="font-bold text-on-surface text-base">{t('modals.rateReviewTitle')}</h3>
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="text-on-surface-variant hover:bg-surface-container p-1 rounded-full cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant">{t('modals.ratingLabel')}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-90 focus:outline-none cursor-pointer"
                      >
                        <span className={`material-symbols-outlined text-3xl font-bold ${
                          rating >= star ? 'text-amber-500 fill' : 'text-slate-300 dark:text-slate-700'
                        }`}>
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface-variant" htmlFor="comment">
                    {t('modals.reviewComment')}
                  </label>
                  <textarea
                    id="comment"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface/50 dark:bg-surface-container-low/50 text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary text-xs h-24 resize-none"
                    placeholder={t('modals.reviewPlaceholder')}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 border border-outline-variant/40 text-xs font-bold rounded-xl text-on-surface bg-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 text-xs font-bold rounded-xl text-on-primary bg-primary hover:bg-primary/95 transition-colors cursor-pointer flex items-center justify-center min-w-[80px]"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      t('common.submit')
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
