/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, Award, Flame, BookOpen, Clock, ChevronRight, Bell, Shield, Languages, CheckCircle2, Moon, Volume2, Target, Share2, Trash2, Info, Edit3, Mail, Camera, Save, X, KeyRound, Grid3X3, Fingerprint, LogOut, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { StreakData, UserSettings } from '../../model/Word';
import { shareService } from '../../services/shareService';

interface ProfileScreenProps {
  streak: StreakData | null;
  savedCount: number;
  settings: UserSettings;
  updateSettings: (settings: UserSettings) => void;
  achievements: {
    vocabMaster: boolean;
    nightOwl: boolean;
    fastLearner: boolean;
  };
  onLogout: () => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  streak, 
  savedCount, 
  settings, 
  updateSettings,
  achievements,
  onLogout,
  onBack
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(settings.userName || 'Bhuvan L');
  const [tempEmail, setTempEmail] = useState(settings.userEmail || 'blbhuvan2@gmail.com');
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const handleShareProgress = () => {
    shareService.shareProgress({
      streak: streak?.count || 0,
      wordsLearned: savedCount, // Using savedCount as proxy for words learned
      level: 4 // Hardcoded level for now
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 720 }
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera access denied or error:", err);
      // Fallback: Trigger native camera input
      cameraInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      // Create a square crop
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const xOffset = (video.videoWidth - size) / 2;
        const yOffset = (video.videoHeight - size) / 2;
        ctx.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        updateSettings({
          ...settings,
          avatarUrl: dataUrl
        });
        stopCamera();
        setShowPhotoOptions(false);
      }
    }
  };

  const BADGES = [
    { 
      icon: <Award size={24} />, 
      label: 'Fast Learner', 
      color: achievements.fastLearner ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400 grayscale',
      unlocked: achievements.fastLearner
    },
    { 
      icon: <BookOpen size={24} />, 
      label: 'Vocab Master', 
      color: achievements.vocabMaster ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400 grayscale',
      unlocked: achievements.vocabMaster
    },
    { 
      icon: <Clock size={24} />, 
      label: 'Night Owl', 
      color: achievements.nightOwl ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400 grayscale',
      unlocked: achievements.nightOwl
    },
  ];

  const handleToggleSetting = (key: keyof UserSettings) => {
    const newVal = !settings[key];
    updateSettings({ ...settings, [key]: newVal });
  };

  const handleToggleLanguage = () => {
    const newLang = settings.appLanguage === 'English' ? 'Kannada' : 'English';
    updateSettings({ ...settings, appLanguage: newLang });
  };

  const handleSaveProfile = () => {
    updateSettings({
      ...settings,
      userName: tempName,
      userEmail: tempEmail.toLowerCase()
    });
    setIsEditing(false);
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      setShowPhotoOptions(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({
          ...settings,
          avatarUrl: reader.result as string
        });
        setShowPhotoOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEdit = () => {
    setTempName(settings.userName);
    setTempEmail(settings.userEmail);
    setIsEditing(false);
  };

  const [selectedDoc, setSelectedDoc] = useState<'privacy' | 'terms' | 'about' | null>(null);

  const LEGAL_CONTENT = {
    privacy: {
      title: 'Privacy Policy',
      content: `Your privacy is important to us. Nalla Nudi collects minimal data to enhance your learning experience.

1. Data Collection: We store your username, email address, and profile picture preference.
2. Local Storage: Your saved words, streak data, and progress are stored locally on your device or in our secure database.
3. Usage: Data is used solely for personalization, progress tracking, and providing relevant language lessons.
4. Security: We use industry-standard encryption to protect your account information.
5. Deletion: You can clear your data at any time through the "Danger Zone" in your profile settings.`
    },
    terms: {
      title: 'Terms of Service',
      content: `By using Nalla Nudi, you agree to the following terms:

1. User Conduct: Use the app for personal, non-commercial language learning purposes.
2. Account Responsibility: You are responsible for maintaining the security of your account and lock patterns.
3. Intellectual Property: The vocabulary database and pronunciation recordings are property of Nalla Nudi.
4. Service Availability: We strive for 100% uptime but do not guarantee uninterrupted access to all features.
5. Modifications: We reserve the right to update these terms to reflect changes in local laws or app features.`
    },
    about: {
      title: 'About Nalla Nudi',
      content: `Nalla Nudi (ನಲ್ಲ ನುಡಿ) is a modern technical English-Kannada dictionary and language learning companion.

Our Mission: To bridge the linguistic gap in technical education and make Kannada vocabulary accessible to everyone.

Key Features:
• Technical terminology with detailed meanings.
• Real-time audio pronunciation.
• Gamified learning with Streaks and Achievements.
• Offline access to saved words.
• Secure App Protection with Pattern & Fingerprint support.

Version 2.0 • Built with love for Kannada learners.`
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Legal Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-6" onClick={() => setSelectedDoc(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-m3-on-surface">{LEGAL_CONTENT[selectedDoc].title}</h3>
                <button onClick={() => setSelectedDoc(null)} className="p-2 bg-gray-50 rounded-full text-m3-outline hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-sm leading-relaxed text-m3-on-surface font-medium whitespace-pre-line">
                  {LEGAL_CONTENT[selectedDoc].content}
                </p>
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDoc(null)}
                className="mt-8 py-4 bg-brand-green text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-green/20"
              >
                I Understand
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Top Header with Settings icon */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-black/5 rounded-2xl text-m3-outline hover:text-brand-saffron transition-colors shadow-sm"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-black text-m3-on-surface">Profile</h1>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(true)}
              className="p-3 bg-white rounded-2xl shadow-sm border border-black/5 text-brand-green flex items-center gap-2 font-bold text-xs"
            >
              <Edit3 size={18} />
              Edit Profile
            </motion.button>
          ) : (
            <div className="flex gap-2">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleCancelEdit}
                className="p-3 bg-white rounded-2xl shadow-sm border border-black/5 text-red-500"
              >
                <X size={18} />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleSaveProfile}
                className="p-3 bg-brand-green text-white rounded-2xl shadow-lg shadow-brand-green/20 flex items-center gap-2 font-bold text-xs"
              >
                <Save size={18} />
                Save
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <section className="flex flex-col items-center py-4">
        <div className="relative group" onClick={handlePhotoClick}>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
          />
          <input 
            type="file" 
            ref={cameraInputRef} 
            className="hidden" 
            accept="image/*" 
            capture="user"
            onChange={handleFileUpload}
          />
          <div className={`w-32 h-32 bg-brand-saffron rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-saffron/20 border-8 border-white mb-4 overflow-hidden ${isEditing ? 'cursor-pointer' : ''}`}>
            {settings.avatarUrl ? (
              <img src={settings.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={64} />
            )}
            
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={32} className="text-white" />
              </div>
            )}
          </div>
          {!isEditing && (
            <div className="absolute bottom-6 right-1 p-2 bg-brand-green text-white rounded-full shadow-lg border-2 border-white">
              <CheckCircle2 size={14} />
            </div>
          )}
        </div>
        
        {isEditing && (
          <p className="text-[10px] font-black uppercase tracking-widest text-m3-outline mt-[-12px] mb-4">Click photo to update</p>
        )}

        {/* Photo Options Backdrop */}
        <AnimatePresence>
          {showPhotoOptions && (
            <div className="fixed inset-0 bg-black/60 z-40 flex items-end justify-center p-6 pb-32" onClick={() => setShowPhotoOptions(false)}>
              <motion.div 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                style={{ borderRadius: '32px' }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-white p-8 space-y-6 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black text-m3-on-surface">Update Photo</h3>
                  <button onClick={() => setShowPhotoOptions(false)} className="p-2 text-m3-outline"><X size={20}/></button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={startCamera}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-black/5 hover:bg-brand-saffron/10 transition-colors group"
                  >
                    <div className="p-3 bg-brand-saffron/10 text-brand-saffron rounded-xl group-hover:bg-brand-saffron group-hover:text-white transition-colors">
                      <Camera size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-m3-on-surface">Take Photo</p>
                      <p className="text-[10px] text-m3-outline uppercase tracking-widest font-black">Use Device Camera</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-black/5 hover:bg-brand-saffron/10 transition-colors group"
                  >
                    <div className="p-3 bg-brand-saffron/10 text-brand-saffron rounded-xl group-hover:bg-brand-saffron group-hover:text-white transition-colors">
                      <ImageIcon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-m3-on-surface">Gallery</p>
                      <p className="text-[10px] text-m3-outline uppercase tracking-widest font-black">Select from Phone</p>
                    </div>
                  </button>

                  {settings.avatarUrl && (
                    <button 
                      onClick={() => { updateSettings({ ...settings, avatarUrl: undefined }); setShowPhotoOptions(false); }}
                      className="flex items-center gap-4 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors group"
                    >
                      <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Trash2 size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold">Remove Photo</p>
                        <p className="text-[10px] uppercase tracking-widest">Back to default</p>
                      </div>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Live Camera Modal */}
        <AnimatePresence>
          {isCameraOpen && (
            <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-between p-6">
              <div className="w-full flex justify-between items-center px-2 pt-4">
                <h3 className="text-white text-lg font-black tracking-tight">Camera Preview</h3>
                <button 
                  onClick={stopCamera}
                  className="p-3 bg-white/10 text-white rounded-full backdrop-blur-md"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="relative w-full aspect-square max-w-sm rounded-[40px] overflow-hidden border-4 border-white/20 shadow-2xl">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-[80%] h-[80%] border-2 border-dashed border-white/40 rounded-full" />
                </div>
              </div>

              <div className="w-full flex justify-center pb-20">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={capturePhoto}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-1 border-4 border-white/30"
                >
                  <div className="w-full h-full bg-white rounded-full border-2 border-black/5" />
                </motion.button>
              </div>
              
              <div className="pb-10 text-center">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Position your face in the circle</p>
              </div>
            </div>
          )}
        </AnimatePresence>
        
        {isEditing ? (
          <div className="w-full max-w-xs space-y-3 mt-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-outline" size={16} />
              <input 
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="User Name"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-black/5 focus:border-brand-saffron outline-none font-bold text-sm"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-outline" size={16} />
              <input 
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value.toLowerCase())}
                placeholder="Gmail Address"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-black/5 focus:border-brand-saffron outline-none font-bold text-sm"
              />
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black text-m3-on-surface">{settings.userName || 'Bhuvan L'}</h2>
            <p className="text-sm font-bold text-m3-outline tracking-widest">{settings.userEmail || 'blbhuvan2@gmail.com'}</p>
            <p className="text-[10px] font-black text-brand-green mt-1 uppercase tracking-[0.2em] bg-brand-green/10 px-3 py-1 rounded-full">Level 4 Learner</p>
          </>
        )}
        
        <div className="mt-6 flex gap-2">
          {BADGES.map((badge, idx) => (
            <div 
              key={idx}
              className={`p-2 rounded-lg ${badge.color.split(' ')[0]} ${badge.color.split(' ')[1]}`}
              title={badge.label}
            >
              {React.cloneElement(badge.icon as React.ReactElement, { size: 16 })}
            </div>
          ))}
        </div>
      </section>

      {/* Stats Summary */}
      <section className="grid grid-cols-2 gap-4">
        <div className="m3-card p-6 flex flex-col items-center gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Info size={12} className="text-m3-outline" />
          </div>
          <div className="bg-orange-50 p-3 rounded-2xl text-orange-600">
            <Flame size={24} />
          </div>
          <p className="text-2xl font-black">{streak?.count || 0}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-m3-outline text-center">Current Streak</p>
        </div>

        <div className="m3-card p-6 flex flex-col items-center gap-2 group">
          <div className="bg-brand-green/10 p-3 rounded-2xl text-brand-green group-hover:rotate-6 transition-transform">
            <BookOpen size={24} />
          </div>
          <p className="text-2xl font-black">{savedCount}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-m3-outline text-center">Saved Words</p>
        </div>
      </section>

      {/* Share Section */}
      <section className="px-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShareProgress}
          className="w-full py-4 bg-brand-saffron text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-brand-saffron/20"
        >
          <Share2 size={20} />
          Share Progress
        </motion.button>
      </section>

      {/* Achievements */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-m3-outline px-2">Achievements</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {BADGES.map((badge, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: badge.unlocked ? -4 : 0 }}
              className={`flex-shrink-0 w-32 h-40 rounded-[28px] p-4 flex flex-col items-center justify-center gap-3 text-center transition-all m3-card ${badge.color.split(' ')[0]}`}
            >
              <div className={`${badge.color.split(' ')[1]} p-3 rounded-full bg-white/50 relative`}>
                {badge.icon}
                {badge.unlocked && (
                  <div className="absolute -top-1 -right-1 bg-white rounded-full">
                    <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-50" />
                  </div>
                )}
              </div>
              <p className={`text-[10px] font-black leading-tight ${badge.color.split(' ')[1]}`}>{badge.label}</p>
              {!badge.unlocked && <p className="text-[8px] font-bold text-gray-400 mt-auto">Locked</p>}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Account Settings List */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Settings size={14} className="text-m3-outline" />
          <h3 className="text-xs font-black uppercase tracking-widest text-m3-outline">Account Settings</h3>
        </div>
        <div className="m3-card overflow-hidden divide-y divide-black/5">
          <button 
            onClick={handleToggleLanguage}
            className="w-full flex items-center justify-between p-6 hover:bg-black/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-saffron/10 text-brand-saffron rounded-xl group-hover:bg-brand-saffron group-hover:text-white transition-colors">
                <Languages size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-m3-on-surface">App Language</p>
                <p className="text-xs text-m3-outline">{settings.appLanguage}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-m3-outline" />
          </button>

          <button 
            onClick={() => handleToggleSetting('notificationsEnabled')}
            className="w-full flex items-center justify-between p-6 hover:bg-black/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Bell size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-m3-on-surface">Notifications</p>
                <p className="text-xs text-m3-outline">{settings.notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-all relative ${settings.notificationsEnabled ? 'bg-brand-green' : 'bg-gray-200'}`}>
              <motion.div 
                animate={{ x: settings.notificationsEnabled ? 24 : 0 }}
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </div>
          </button>

          <button 
            onClick={() => handleToggleSetting('isProtectionEnabled')}
            className="w-full flex items-center justify-between p-6 hover:bg-black/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Shield size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-m3-on-surface">App Protection</p>
                <p className="text-xs text-m3-outline">
                  {settings.isProtectionEnabled 
                    ? `${settings.lockType === 'none' ? 'Enabled' : settings.lockType.charAt(0).toUpperCase() + settings.lockType.slice(1)} active` 
                    : 'None'
                  }
                </p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-all relative ${settings.isProtectionEnabled ? 'bg-brand-green' : 'bg-gray-200'}`}>
              <motion.div 
                animate={{ x: settings.isProtectionEnabled ? 24 : 0 }}
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </div>
          </button>

          {settings.isProtectionEnabled && (
            <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar">
              {[
                { type: 'password', icon: <KeyRound size={16} />, label: 'Pass' },
                { type: 'pattern', icon: <Grid3X3 size={16} />, label: 'Pattern' },
                { type: 'fingerprint', icon: <Fingerprint size={16} />, label: 'Finger' }
              ].map((lock) => (
                <button
                  key={lock.type}
                  onClick={() => {
                    const val = lock.type === 'password' ? '1234' : 'pattern_val';
                    updateSettings({ ...settings, lockType: lock.type as any, lockValue: val });
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    settings.lockType === lock.type 
                      ? 'bg-brand-green text-white shadow-md' 
                      : 'bg-white text-m3-outline border border-black/5'
                  }`}
                >
                  {lock.icon}
                  {lock.label}
                </button>
              ))}
            </div>
          )}

          <button 
            onClick={() => handleToggleSetting('darkMode')}
            className="w-full flex items-center justify-between p-6 hover:bg-black/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-700 rounded-xl group-hover:bg-slate-700 group-hover:text-white transition-colors">
                <Moon size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-m3-on-surface">Dark Mode</p>
                <p className="text-xs text-m3-outline">{settings.darkMode ? 'Always On' : 'Follow System'}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-all relative ${settings.darkMode ? 'bg-brand-green' : 'bg-gray-200'}`}>
              <motion.div 
                animate={{ x: settings.darkMode ? 24 : 0 }}
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </div>
          </button>

          <button 
            onClick={() => handleToggleSetting('soundEffects')}
            className="w-full flex items-center justify-between p-6 hover:bg-black/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Volume2 size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-m3-on-surface">Sound Effects</p>
                <p className="text-xs text-m3-outline">{settings.soundEffects ? 'Active' : 'Muted'}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-all relative ${settings.soundEffects ? 'bg-brand-green' : 'bg-gray-200'}`}>
              <motion.div 
                animate={{ x: settings.soundEffects ? 24 : 0 }}
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </div>
          </button>

          <div className="w-full p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Target size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-m3-on-surface">Daily Goal</p>
                  <p className="text-xs text-m3-outline">{settings.dailyGoal} Minutes / Day</p>
                </div>
              </div>
            </div>
            <input 
              type="range" 
              min="5" 
              max="60" 
              step="5"
              value={settings.dailyGoal}
              onChange={(e) => updateSettings({ ...settings, dailyGoal: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-saffron"
            />
            <div className="flex justify-between text-[10px] font-black uppercase text-m3-outline">
              <span>5m</span>
              <span>10m</span>
              <span>15m</span>
              <span>30m</span>
              <span>45m</span>
              <span>60m</span>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-m3-outline px-2">Support & Legal</h3>
        <div className="space-y-3">
          <div className="m3-card p-6 flex items-center justify-between bg-brand-green/5 border-brand-green/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <p className="font-bold text-brand-green">User Guide</p>
            </div>
            <ChevronRight size={18} className="text-brand-green" />
          </div>

          <div className="m3-card overflow-hidden divide-y divide-black/5">
            <button 
              onClick={() => setSelectedDoc('privacy')}
              className="w-full flex items-center justify-between p-5 hover:bg-black/5 transition-colors"
            >
              <span className="text-sm font-bold text-m3-on-surface">Privacy Policy</span>
              <ChevronRight size={16} className="text-m3-outline" />
            </button>
            <button 
              onClick={() => setSelectedDoc('terms')}
              className="w-full flex items-center justify-between p-5 hover:bg-black/5 transition-colors"
            >
              <span className="text-sm font-bold text-m3-on-surface">Terms of Service</span>
              <ChevronRight size={16} className="text-m3-outline" />
            </button>
            <button 
              onClick={() => setSelectedDoc('about')}
              className="w-full flex items-center justify-between p-5 hover:bg-black/5 transition-colors"
            >
              <span className="text-sm font-bold text-m3-on-surface">About Nalla Nudi</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-m3-outline">v2.0</span>
                <ChevronRight size={16} className="text-m3-outline" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-m3-outline px-2">Account Session</h3>
        <div className="m3-card overflow-hidden">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-between p-6 hover:bg-black/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 text-gray-600 rounded-xl group-hover:bg-brand-saffron group-hover:text-white transition-colors">
                <LogOut size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-m3-on-surface">Log Out</p>
                <p className="text-xs text-m3-outline">Sign out of your account</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-m3-outline opacity-30" />
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-red-500 px-2">Danger Zone</h3>
        <div className="m3-card overflow-hidden border-red-100 bg-red-50/30">
          <button className="w-full flex items-center justify-between p-6 hover:bg-red-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Trash2 size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-red-600">Clear All Data</p>
                <p className="text-xs text-red-400">Reset streak and saved words</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-red-300" />
          </button>
        </div>
      </section>
    </div>
  );
};
