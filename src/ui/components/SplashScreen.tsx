/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-brand-warm-surface flex flex-col items-center justify-center z-[100]">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.8
        }}
        className="flex flex-col items-center"
      >
        <div className="w-32 h-32 mb-6">
          <Logo className="w-full h-full" size={64} />
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-black tracking-tight text-m3-on-surface font-kannada">ನಲ್ಲ-ನುಡಿ</h1>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-saffron mt-1">Nalla Nudi</p>
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-12 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="w-2 h-2 rounded-full bg-brand-saffron animate-bounce" />
        <div className="w-2 h-2 rounded-full bg-brand-saffron animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-brand-saffron animate-bounce [animation-delay:-0.3s]" />
      </motion.div>
    </div>
  );
};
