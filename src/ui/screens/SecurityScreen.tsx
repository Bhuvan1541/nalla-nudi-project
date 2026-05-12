/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Delete, Fingerprint, Grid3X3, KeyRound, CheckCircle2 } from 'lucide-react';
import { UserSettings } from '../../model/Word';

interface SecurityScreenProps {
  onUnlock: () => void;
  settings: UserSettings;
}

export const SecurityScreen: React.FC<SecurityScreenProps> = ({ onUnlock, settings }) => {
  const [pin, setPin] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const [view, setView] = useState<'password' | 'pattern' | 'fingerprint'>(
    settings.lockType === 'none' ? 'password' : settings.lockType
  );

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = [...pin, num];
      setPin(newPin);
      
      if (newPin.length === 4) {
        const pinString = newPin.join('');
        if (settings.lockValue && pinString !== settings.lockValue) {
          setIsError(true);
          setTimeout(() => {
            setIsError(false);
            setPin([]);
          }, 500);
        } else {
          onUnlock();
        }
      }
    }
  };

  const handleFingerprintTap = () => {
    // In a real app, this would trigger native biometrics
    onUnlock();
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 bg-brand-warm-surface z-[120] flex flex-col items-center justify-center p-8">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center gap-6 mb-12"
      >
        <div className="w-20 h-20 bg-brand-saffron/10 rounded-3xl flex items-center justify-center text-brand-saffron shadow-lg shadow-brand-saffron/5">
          <Shield size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-m3-on-surface">App Protected</h2>
          <p className="text-sm font-medium text-m3-outline">
            {view === 'password' ? 'Enter PIN to access Nalla Nudi' : 
             view === 'pattern' ? 'Draw pattern to access Nalla Nudi' : 
             'Use Fingerprint to access Nalla Nudi'}
          </p>
        </div>
      </motion.div>

      {view === 'password' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full flex flex-col items-center"
        >
          {/* PIN Indicators */}
          <div className={`flex gap-4 mb-16 ${isError ? 'animate-shake' : ''}`}>
            {[0, 1, 2, 3].map((idx) => (
              <div 
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                  pin[idx] 
                    ? 'bg-brand-saffron border-brand-saffron scale-125' 
                    : 'bg-transparent border-m3-outline/20'
                } ${isError ? 'bg-red-500 border-red-500' : ''}`}
              />
            ))}
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-6 max-w-xs w-full">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <motion.button
                key={num}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleKeyPress(num)}
                className="w-20 h-20 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center text-2xl font-black text-m3-on-surface hover:bg-brand-saffron/5 active:bg-brand-saffron active:text-white transition-colors"
              >
                {num}
              </motion.button>
            ))}
            <div className="w-20 h-20" />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleKeyPress('0')}
              className="w-20 h-20 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center text-2xl font-black text-m3-on-surface hover:bg-brand-saffron/5 active:bg-brand-saffron active:text-white transition-colors"
            >
              0
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBackspace}
              className="w-20 h-20 rounded-full flex items-center justify-center text-m3-outline hover:bg-black/5"
            >
              <Delete size={24} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {view === 'pattern' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center gap-12"
        >
          <div className="grid grid-cols-3 gap-10 p-10 bg-white rounded-[48px] shadow-2xl border border-black/5 relative overflow-hidden">
            {[...Array(9)].map((_, i) => (
              <motion.div 
                key={i} 
                whileTap={{ scale: 1.5 }}
                className="w-4 h-4 rounded-full bg-gray-200 border-2 border-transparent transition-all hover:bg-brand-saffron shadow-inner" 
              />
            ))}
            <div className="absolute inset-0 p-10 pointer-events-none opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <path d="M 16 16 L 84 16 L 84 84" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUnlock}
            className="px-12 py-4 bg-brand-saffron text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-saffron/30"
          >
            Draw to Unlock
          </motion.button>
        </motion.div>
      )}

      {view === 'fingerprint' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center gap-12"
        >
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleFingerprintTap}
              className="w-32 h-32 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center border-4 border-brand-green/20 relative z-10"
            >
              <Fingerprint size={64} />
            </motion.button>
            <motion.div 
              animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-full bg-brand-green pointer-events-none"
            />
            <motion.div 
              animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
              className="absolute inset-0 rounded-full bg-brand-green pointer-events-none"
            />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-black text-brand-green uppercase tracking-[0.3em] animate-pulse">
              Touch Sensor
            </p>
            <p className="text-[10px] font-bold text-m3-outline uppercase tracking-widest">
              Biometric verification active
            </p>
          </div>
        </motion.div>
      )}

      {/* Switch Lock Type */}
      <div className="mt-16 flex gap-6">
        {settings.lockType !== 'password' && (
          <button onClick={() => setView('password')} className={`p-4 rounded-2xl transition-all ${view === 'password' ? 'bg-brand-saffron text-white shadow-lg' : 'bg-white text-m3-outline border border-black/5'}`}>
            <KeyRound size={20} />
          </button>
        )}
        <button onClick={() => setView('pattern')} className={`p-4 rounded-2xl transition-all ${view === 'pattern' ? 'bg-brand-saffron text-white shadow-lg' : 'bg-white text-m3-outline border border-black/5'}`}>
          <Grid3X3 size={20} />
        </button>
        <button onClick={() => setView('fingerprint')} className={`p-4 rounded-2xl transition-all ${view === 'fingerprint' ? 'bg-brand-saffron text-white shadow-lg' : 'bg-white text-m3-outline border border-black/5'}`}>
          <Fingerprint size={20} />
        </button>
      </div>

      <button 
        onClick={() => {}} 
        className="mt-12 text-[10px] font-black text-m3-outline uppercase tracking-widest opacity-40"
      >
        Forgot your lock?
      </button>
    </div>
  );
};

