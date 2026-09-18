import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWorkkar } from '../context/WorkkarContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, loginWithGoogle, register, user, addNotification } = useWorkkar();
  const { t, tService } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer'); // Locked to customer, workers use partner portal
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [skill, setSkill] = useState('Electrician');
  const [rate, setRate] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [verificationDocument, setVerificationDocument] = useState(''); // Simulated file upload

  useEffect(() => {
    if (user) {
      if (user.role === 'worker') {
        navigate('/worker/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'supreme-admin') {
        navigate('/supreme-admin/dashboard');
      } else {
        navigate(redirect);
      }
    }
  }, [user, navigate, redirect]);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';

  useEffect(() => {
    const hasRealClientId = googleClientId && !googleClientId.includes('your-google-client-id');
    if (!hasRealClientId || !isLogin || role !== 'customer') return;

    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            setLoading(true);
            try {
              const success = await loginWithGoogle(response.credential);
              if (success) {
                addNotification(t('auth.loginSuccess'), 'success');
              }
            } catch (err) {
              addNotification(err.message || t('auth.invalidCredentials'), 'error');
            } finally {
              setLoading(false);
            }
          }
        });
        const btnDiv = document.getElementById('google-signin-div');
        if (btnDiv) {
          window.google.accounts.id.renderButton(
            btnDiv,
            { theme: 'outline', size: 'large', width: '100%' }
          );
        }
      }
    };

    if (window.google) {
      const timer = setTimeout(initGoogle, 100);
      return () => clearTimeout(timer);
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(initGoogle, 100);
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [googleClientId, isLogin, role, t]);

  const handleMockGoogleLogin = async () => {
    try {
      setLoading(true);
      const mockEmail = 'mockgoogle@workkar.com';
      const mockName = 'Mock Google User';
      const mockToken = `mock-google-token|${mockEmail}|${mockName}`;
      
      const success = await loginWithGoogle(mockToken);
      if (success) {
        addNotification(t('auth.loginSuccess'), 'success');
      }
    } catch (error) {
      addNotification(error.message || t('auth.invalidCredentials'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          addNotification(t('auth.loginSuccess'), 'success');
        }
      } else {
        const formData = {
          name,
          email,
          password,
          role,
          address,
          phone,
          skill,
          rate,
          experience,
          description,
          verificationDocument,
        };
        const success = await register(formData);
        if (success) {
          if (role === 'worker') {
            addNotification(t('auth.registerSuccess'), 'success');
            setIsLogin(true);
          } else {
            addNotification(t('auth.registerSuccess'), 'success');
          }
        }
      }
    } catch (error) {
      addNotification(error.message || t('auth.invalidCredentials'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const skillsList = ['Electrician', 'Plumber', 'Mason', 'Painter', 'Carpenter', 'Cleaner', 'Welder', 'Gardener'];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8 bg-gradient-to-tr from-surface-container-lowest via-surface-container-low to-surface-container-high transition-colors duration-200">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-6 p-5 sm:p-8 bg-surface-container-lowest/90 dark:bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/30 rounded-2xl sm:rounded-3xl shadow-2xl"
      >
        <div>
          <div className="flex justify-center text-primary">
            <span className="material-symbols-outlined text-4xl sm:text-5xl fill">engineering</span>
          </div>

          {/* Quick Segmented Role Selector: Customer vs Worker Portal */}
          <div className="mt-4 p-1 bg-surface-container-low dark:bg-slate-800/80 rounded-2xl flex items-center gap-1 border border-outline-variant/30">
            <button
              type="button"
              className="flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all bg-surface-container-lowest dark:bg-slate-900 text-primary dark:text-white shadow-sm flex items-center justify-center gap-1.5 cursor-default"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(isLogin ? '/worker/login' : '/worker/register')}
              className="flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-orange-500">handyman</span>
              <span>Worker Partner</span>
            </button>
          </div>

          <h2 className="mt-4 text-center font-headline-md text-xl sm:text-headline-md font-extrabold tracking-tight text-on-surface">
            {isLogin ? t('auth.customerLoginTitle') : t('auth.customerRegisterTitle')}
          </h2>
          <p className="mt-1 text-center text-xs sm:text-sm text-on-surface-variant">
            {isLogin ? t('auth.customerLoginSubtitle') : t('auth.customerRegisterSubtitle')}
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant mb-1" htmlFor="name">
                  {t('auth.nameLabel')}
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface/50 dark:bg-surface-container-low/50 text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-all text-sm"
                  placeholder={t('auth.namePlaceholder')}
                />
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant mb-1" htmlFor="email">
                {t('auth.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface/50 dark:bg-surface-container-low/50 text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-all text-sm"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant mb-1" htmlFor="password">
                {t('auth.passwordLabel')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-outline-variant/40 bg-surface/50 dark:bg-surface-container-low/50 text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-all text-sm"
                  placeholder={t('auth.passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Custom fields based on role & register status */}
            {!isLogin && role === 'customer' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1" htmlFor="address">
                    {t('auth.addressLabel')}
                  </label>
                  <input
                    id="address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface/50 dark:bg-surface-container-low/50 text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-all text-sm"
                    placeholder={t('auth.addressPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1" htmlFor="phone">
                    {t('auth.phoneLabel')}
                  </label>
                  <input
                    id="phone"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface/50 dark:bg-surface-container-low/50 text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-all text-sm"
                    placeholder={t('auth.phonePlaceholder')}
                  />
                </div>
              </>
            )}

            {!isLogin && role === 'worker' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1" htmlFor="skill">
                    {t('workerAuth.tradeLabel')}
                  </label>
                  <select
                    id="skill"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface/50 dark:bg-surface-container-low/50 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-all text-sm"
                  >
                    {skillsList.map((s) => (
                      <option key={s} value={s}>{tService(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1" htmlFor="rate">
                    {t('workerAuth.hourlyRateLabel')}
                  </label>
                  <input
                    id="rate"
                    type="number"
                    required
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface/50 dark:bg-surface-container-low/50 text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-all text-sm"
                    placeholder="25"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1" htmlFor="experience">
                    {t('workerAuth.experienceLabel')}
                  </label>
                  <input
                    id="experience"
                    type="number"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface/50 dark:bg-surface-container-low/50 text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-all text-sm"
                    placeholder="5"
                  />
                </div>
                
                {/* Verification Documents Upload Input */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1" htmlFor="verification">
                    {t('workerAuth.uploadDocTitle')}
                  </label>
                  <input
                    id="verification"
                    type="text"
                    required
                    value={verificationDocument}
                    onChange={(e) => setVerificationDocument(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface/50 dark:bg-surface-container-low/50 text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-all text-sm"
                    placeholder="e.g. License ID, Aadhaar"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1" htmlFor="description">
                    {t('workerDetails.aboutWorker')}
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface/50 dark:bg-surface-container-low/50 text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-all text-sm h-20 resize-none"
                    placeholder={t('workerAuth.registerSubtitle')}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-2xl text-on-primary bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-blue-400 dark:focus:ring-offset-slate-900 shadow-lg hover:shadow-xl active:scale-98 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isLogin ? t('auth.loginSubmit') : t('auth.registerSubmit')
              )}
            </button>
          </div>
        </form>

        {isLogin && role === 'customer' && (
          <div className="mt-6">
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-outline-variant/30 w-full"></div>
              <span className="absolute bg-surface-container-lowest dark:bg-surface-container-low px-3 text-xs text-on-surface-variant font-medium">
                {t('common.or')}
              </span>
            </div>
            
            {googleClientId && !googleClientId.includes('your-google-client-id') ? (
              <div id="google-signin-div" className="w-full flex justify-center"></div>
            ) : (
              <button
                type="button"
                onClick={handleMockGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-outline-variant/50 rounded-2xl text-sm font-semibold text-on-surface bg-surface hover:bg-surface-container-low focus:outline-none transition-all active:scale-98 shadow-sm cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {t('auth.demoGoogleSignIn')}
              </button>
            )}
          </div>
        )}

        <div className="text-center mt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-semibold text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer py-1"
          >
            {isLogin ? t('auth.noAccount') + ' ' + t('nav.register') : t('auth.hasAccount') + ' ' + t('nav.signIn')}
          </button>

          <div className="pt-3 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => navigate(isLogin ? '/worker/login' : '/worker/register')}
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <span>👷 {isLogin ? 'Are you a worker? Sign in to Worker Portal' : 'Want to offer services? Register as Worker Partner'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
