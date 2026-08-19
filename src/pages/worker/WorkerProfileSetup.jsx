import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Briefcase, FileText, Send } from 'lucide-react';
import ProgressStepper from '../../components/worker/ProgressStepper';
import UploadCard from '../../components/worker/UploadCard';
import { updateWorkerProfileApi } from '../../services/workerApi';
import { useLanguage } from '../../context/LanguageContext';

export default function WorkerProfileSetup({ worker, refetchWorker }) {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [profession, setProfession] = useState('Electrician');
  const [experience, setExperience] = useState('0');
  const [rate, setRate] = useState('20');
  const [description, setDescription] = useState('');

  // Location Onboarding State
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationStatus, setLocationStatus] = useState('prompt'); // 'prompt', 'requesting', 'granted', 'denied'
  const [locationError, setLocationError] = useState('');

  // Files & Previews
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');

  const [aadhaarCard, setAadhaarCard] = useState(null);
  const [aadhaarCardPreview, setAadhaarCardPreview] = useState('');

  const [panCard, setPanCard] = useState(null);
  const [panCardPreview, setPanCardPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();
  const { t, tService } = useLanguage();

  // Populate existing data if available (e.g. if editing or re-submitting rejected profile)
  useEffect(() => {
    if (worker) {
      setFullName(worker.fullName || '');
      setAge(worker.age ? String(worker.age) : '');
      setGender(worker.gender || 'Male');
      setProfession(worker.profession || 'Electrician');
      setExperience(worker.experience !== undefined ? String(worker.experience) : '0');
      setRate(worker.rate !== undefined ? String(worker.rate) : '20');
      setDescription(worker.description || '');

      if (worker.profilePhoto) setProfilePhotoPreview(worker.profilePhoto);
      if (worker.aadhaarCard) setAadhaarCardPreview(worker.aadhaarCard);
      if (worker.panCard) setPanCardPreview(worker.panCard);

      if (worker.latitude && worker.longitude) {
        setLatitude(worker.latitude);
        setLongitude(worker.longitude);
        setLocationStatus('granted');
      }
    }
  }, [worker]);

  // Request location on mount
  useEffect(() => {
    if (!latitude || !longitude) {
      requestLocation();
    }
  }, []);

  const requestLocation = () => {
    setLocationStatus('requesting');
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLatitude(40.7128);
      setLongitude(-74.0060);
      setLocationStatus('granted');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationStatus('granted');
      },
      (error) => {
        console.error('Location error:', error);
        setLatitude(40.7128);
        setLongitude(-74.0060);
        setLocationStatus('granted');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validate = () => {
    const errs = {};
    if (!fullName || !fullName.trim()) errs.fullName = t('auth.nameLabel') + ' ' + t('common.loading');
    if (!age) {
      errs.age = t('workerAuth.ageLabel') + ' ' + t('common.loading');
    } else {
      const parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge) || parsedAge < 18) {
        errs.age = '18+';
      }
    }
    if (!profession) errs.profession = t('workerAuth.tradeLabel');

    if (!experience) {
      errs.experience = t('workerAuth.experienceLabel');
    }

    const expYearsVal = parseInt(experience, 10) || 0;
    let minRateVal = 10, maxRateVal = 20;
    if (expYearsVal >= 10) {
      minRateVal = 40; maxRateVal = 120;
    } else if (expYearsVal >= 5) {
      minRateVal = 25; maxRateVal = 60;
    } else if (expYearsVal >= 2) {
      minRateVal = 15; maxRateVal = 35;
    }

    if (!rate) {
      errs.rate = t('workerAuth.hourlyRateLabel');
    } else {
      const parsedRate = parseFloat(rate);
      if (isNaN(parsedRate) || parsedRate < minRateVal || parsedRate > maxRateVal) {
        errs.rate = `$${minRateVal} - $${maxRateVal}`;
      }
    }

    if (!description || !description.trim()) {
      errs.description = t('workerAuth.registerSubtitle');
    }

    if (locationStatus !== 'granted' || latitude === null || longitude === null) {
      errs.location = t('workerAuth.locationPermTitle');
    }

    if (!profilePhoto && !profilePhotoPreview) {
      errs.profilePhoto = t('workerAuth.uploadDocTitle');
    }
    if (!aadhaarCard && !aadhaarCardPreview) {
      errs.aadhaarCard = 'Aadhaar / ID Card';
    }
    if (!panCard && !panCardPreview) {
      errs.panCard = 'PAN / Tax Card';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (file, setFile, setPreview) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setErrors({});

    if (!validate()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('profession', profession);
    formData.append('experience', experience);
    formData.append('rate', rate);
    formData.append('description', description);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    if (profilePhoto) formData.append('profilePhoto', profilePhoto);
    if (aadhaarCard) formData.append('aadhaarCard', aadhaarCard);
    if (panCard) formData.append('panCard', panCard);

    try {
      await updateWorkerProfileApi(formData);
      if (refetchWorker) await refetchWorker();
      navigate('/worker/verification-pending');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setSubmitError(
          err.response?.data?.message || t('auth.invalidCredentials')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const professionsList = [
    'Electrician',
    'Plumber',
    'Mason',
    'Carpenter',
    'Painter',
    'Welder',
    'Cleaner',
    'Gardener',
    'Construction Worker',
    'Technician',
    'Other',
  ];

  const expYears = parseInt(experience, 10) || 0;
  let minRate = 10, maxRate = 20;
  if (expYears >= 10) {
    minRate = 40; maxRate = 120;
  } else if (expYears >= 5) {
    minRate = 25; maxRate = 60;
  } else if (expYears >= 2) {
    minRate = 15; maxRate = 35;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('workerAuth.profileSetupTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {t('workerAuth.registerSubtitle')}
          </p>
        </div>

        {/* Stepper */}
        <ProgressStepper currentStep={3} />

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl p-4"
            >
              {submitError}
            </motion.div>
          )}

          {/* Core Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Section 1: Personal Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-slate-800">
                <User className="text-blue-600 dark:text-blue-400" size={20} />
                <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  {t('workerAuth.profileSetupTitle')}
                </h2>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('auth.nameLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('auth.namePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`mt-1.5 block w-full px-4 py-3 border ${
                    errors.fullName ? 'border-red-300' : 'border-slate-200 dark:border-slate-800'
                  } bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-slate-900 dark:text-white transition-all`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t('workerAuth.ageLabel')}
                  </label>
                  <input
                    type="number"
                    placeholder="Min 18"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`mt-1.5 block w-full px-4 py-3 border ${
                      errors.age ? 'border-red-300' : 'border-slate-200 dark:border-slate-800'
                    } bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-slate-900 dark:text-white transition-all`}
                  />
                  {errors.age && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.age}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t('workerAuth.genderLabel')}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-slate-900 dark:text-white transition-all cursor-pointer"
                  >
                    <option value="Male">{t('workerAuth.genderMale')}</option>
                    <option value="Female">{t('workerAuth.genderFemale')}</option>
                    <option value="Other">{t('workerAuth.genderOther')}</option>
                  </select>
                </div>
              </div>

              {/* Readonly Account Details */}
              <div className="pt-2 grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block">{t('auth.emailLabel')}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 truncate block">
                    {worker?.email}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block">{t('auth.phoneLabel')}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    {worker?.mobile}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Profession & Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-slate-800 mb-4">
                  <Briefcase className="text-blue-600 dark:text-blue-400" size={20} />
                  <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    {t('workerAuth.tradeLabel')}
                  </h2>
                </div>

                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('workerAuth.tradeLabel')}
                </label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-slate-900 dark:text-white transition-all cursor-pointer"
                >
                  {professionsList.map((prof) => (
                    <option key={prof} value={prof}>
                      {tService(prof)}
                    </option>
                  ))}
                </select>
                {errors.profession && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.profession}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Experience */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t('workerAuth.experienceLabel')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className={`mt-1.5 block w-full px-4 py-3 border ${
                      errors.experience ? 'border-red-300' : 'border-slate-200 dark:border-slate-800'
                    } bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-slate-900 dark:text-white transition-all`}
                  />
                  {errors.experience && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.experience}</p>
                  )}
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t('workerAuth.hourlyRateLabel')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 25"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className={`mt-1.5 block w-full px-4 py-3 border ${
                      errors.rate ? 'border-red-300' : 'border-slate-200 dark:border-slate-800'
                    } bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-slate-900 dark:text-white transition-all`}
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1 block">
                    ${minRate} - ${maxRate}/hr
                  </span>
                  {errors.rate && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.rate}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('workerDetails.aboutWorker')}
                </label>
                <textarea
                  rows="3"
                  placeholder={t('workerAuth.registerSubtitle')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`mt-1.5 block w-full px-4 py-3 border ${
                    errors.description ? 'border-red-300' : 'border-slate-200 dark:border-slate-800'
                  } bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-slate-900 dark:text-white transition-all resize-none`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500 font-semibold">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Upload Documents */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50 dark:border-slate-800 mb-6">
              <FileText className="text-blue-600 dark:text-blue-400" size={20} />
              <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                {t('workerAuth.uploadDocTitle')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Profile Photo */}
              <div className="flex flex-col">
                <UploadCard
                  title={t('workerAuth.uploadDocTitle')}
                  description="Recent front face photo"
                  accept="image/*"
                  file={profilePhoto}
                  previewUrl={profilePhotoPreview}
                  isCircular={true}
                  onChange={(file) => handleFileChange(file, setProfilePhoto, setProfilePhotoPreview)}
                  onRemove={() => {
                    setProfilePhoto(null);
                    setProfilePhotoPreview('');
                  }}
                />
                {errors.profilePhoto && (
                  <p className="mt-2 text-center text-xs text-red-500 font-semibold">{errors.profilePhoto}</p>
                )}
              </div>

              {/* Aadhaar Card */}
              <div className="flex flex-col">
                <UploadCard
                  title="Aadhaar / ID Card"
                  description="Scan copy under 5MB"
                  accept="image/*,application/pdf"
                  file={aadhaarCard}
                  previewUrl={aadhaarCardPreview}
                  onChange={(file) => handleFileChange(file, setAadhaarCard, setAadhaarCardPreview)}
                  onRemove={() => {
                    setAadhaarCard(null);
                    setAadhaarCardPreview('');
                  }}
                />
                {errors.aadhaarCard && (
                  <p className="mt-2 text-center text-xs text-red-500 font-semibold">{errors.aadhaarCard}</p>
                )}
              </div>

              {/* PAN Card */}
              <div className="flex flex-col">
                <UploadCard
                  title="PAN / Tax Card"
                  description="Scan copy under 5MB"
                  accept="image/*,application/pdf"
                  file={panCard}
                  previewUrl={panCardPreview}
                  onChange={(file) => handleFileChange(file, setPanCard, setPanCardPreview)}
                  onRemove={() => {
                    setPanCard(null);
                    setPanCardPreview('');
                  }}
                />
                {errors.panCard && (
                  <p className="mt-2 text-center text-xs text-red-500 font-semibold">{errors.panCard}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="py-4 px-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {t('workerAuth.submitForVerificationBtn')}
                </>
              )}
            </motion.button>
          </div>

        </form>
      </div>
    </div>
  );
}
