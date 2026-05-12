/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Fingerprint, Grid3X3, KeyRound, ArrowLeft, Delete } from 'lucide-react';
import { UserSettings } from '../../model/Word';

interface SecurityOverlayProps {
  settings: UserSettings;
  onUnlocked: () => void;
}

const SecurityOverlay: React.FC<SecurityOverlayProps> = ({ settings, onUnlocked }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [view, setView] = useState<'options' | 'password' | 'pattern' | 'fingerprint'>(
    settings.lockType === 'none' ? 'options' : settings.lockType
  );

  const handlePasswordSubmit = () => {
    if (input === settings.lockValue) {
      onUnlocked();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setInput('');
    }
  };

  const handlePatternComplete = (pattern: string) => {
    if (pattern === settings.lockValue) {
      onUnlocked();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const handleFingerprintSim = () => {
    // Biometric prompt logic would go here in a real app
    // Simulating success
    onUnlocked();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-m3-surface flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-md flex flex-col items-center">
        <motion.div 
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="w-20 h-20 bg-brand-saffron/10 text-brand-saffron rounded-full flex items-center justify-center mb-8"
        >
          <Shield size={40} />
        </motion.div>

        <h2 className="text-2xl font-black text-m3-on-surface mb-2">App Locked</h2>
        <p className="text-m3-outline font-bold text-sm mb-12 text-center">
          Please verify your identity to continue to Nalla-Nudi
        </p>

        {view === 'password' && (
          <div className="w-full space-y-8 flex flex-col items-center">
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    input.length > i ? 'bg-brand-saffron border-brand-saffron scale-125' : 'border-m3-outline'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button 
                  key={num}
                  onClick={() => setInput(prev => prev.length < 4 ? prev + num : prev)}
                  className="w-16 h-16 rounded-full bg-white border border-black/5 flex items-center justify-center text-xl font-black text-m3-on-surface hover:bg-gray-50 active:scale-95 transition-all"
                >
                  {num}
                </button>
              ))}
              <div />
              <button 
                onClick={() => setInput(prev => prev.length < 4 ? prev + '0' : prev)}
                className="w-16 h-16 rounded-full bg-white border border-black/5 flex items-center justify-center text-xl font-black text-m3-on-surface hover:bg-gray-50 active:scale-95 transition-all"
              >
                0
              </button>
              <button 
                onClick={() => setInput(prev => prev.slice(0, -1))}
                className="w-16 h-16 flex items-center justify-center text-m3-outline"
              >
                <Delete size={24} />
              </button>
            </div>

            {input.length === 4 && handlePasswordSubmit()}
          </div>
        )}

        {view === 'fingerprint' && (
          <div className="w-full flex flex-col items-center gap-12">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleFingerprintSim}
              className="w-24 h-24 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center border-2 border-brand-green/20"
            >
              <Fingerprint size={48} />
            </motion.button>
            <p className="text-sm font-black text-brand-green uppercase tracking-widest animate-pulse">
              Touch Sensor
            </p>
          </div>
        )}

        {view === 'pattern' && (
            <div className="w-full flex flex-col items-center gap-8">
                {/* Simplified Pattern UI - Grid of dots */}
                <div className="grid grid-cols-3 gap-10 p-6 bg-white rounded-3xl border border-black/5">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-4 h-4 rounded-full bg-gray-200" />
                    ))}
                </div>
                <p className="text-xs font-bold text-m3-outline">Draw pattern to unlock</p>
                <button 
                    onClick={() => onUnlocked()} 
                    className="mt-4 px-6 py-2 bg-brand-saffron text-white rounded-full font-bold text-sm shadow-lg shadow-brand-saffron/20"
                >
                    Simulator Unlock
                </button>
            </div>
        )}

        {settings.lockType !== 'none' && (
            <div className="mt-12 flex gap-4">
                {settings.lockType !== 'password' && (
                    <button onClick={() => setView('password')} className="p-3 text-m3-outline opacity-50 hover:opacity-100"><KeyRound size={20}/></button>
                )}
                {settings.lockType !== 'pattern' && (
                    <button onClick={() => setView('pattern')} className="p-3 text-m3-outline opacity-50 hover:opacity-100"><Grid3X3 size={20}/></button>
                )}
                {settings.lockType !== 'fingerprint' && (
                    <button onClick={() => setView('fingerprint')} className="p-3 text-m3-outline opacity-50 hover:opacity-100"><Fingerprint size={20}/></button>
                )}
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default SecurityOverlay;
