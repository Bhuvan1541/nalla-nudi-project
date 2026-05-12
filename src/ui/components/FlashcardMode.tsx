/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, RotateCcw, Volume2, ArrowLeft } from 'lucide-react';
import { WordEntry } from '../../model/Word';
import { speechService } from '../../services/speechService';

interface FlashcardModeProps {
  words: WordEntry[];
  onClose: () => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({ words, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next

  if (words.length === 0) return null;

  const currentWord = words[currentIndex];

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speechService.speak(currentWord.englishWord);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex items-center gap-4 text-white">
          <button 
            onClick={onClose}
            className="p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-black tracking-tight">Flashcard Mode</h2>
            <p className="text-xs font-medium opacity-80">{currentIndex + 1} of {words.length} words</p>
          </div>
          <button 
            onClick={onClose}
            className="bg-white/20 p-3 rounded-2xl hover:bg-white/30 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Card Container */}
        <div className="relative h-[440px] perspective-1000">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ x: direction * 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -direction * 100, opacity: 0 }}
              className="w-full h-full cursor-pointer"
              onClick={handleFlip}
            >
              <div className="relative w-full h-full transition-transform duration-500 preserve-3d" 
                   style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-[40px] shadow-2xl p-10 flex flex-col items-center justify-center text-center space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-m3-outline">Analyze this word</span>
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="text-4xl font-black tracking-tighter text-m3-on-surface">
                      {currentWord.englishWord}
                    </h3>
                    <button 
                      onClick={handleSpeak}
                      className="p-4 bg-brand-saffron/10 text-brand-saffron rounded-full hover:bg-brand-saffron/20 transition-all active:scale-90"
                    >
                      <Volume2 size={32} />
                    </button>
                  </div>
                  <div className="text-brand-saffron text-[10px] font-black uppercase tracking-[0.2em] animate-bounce mt-4">Tap to reveal</div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden bg-brand-saffron rounded-[40px] shadow-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 text-white"
                     style={{ transform: 'rotateY(180deg)' }}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">English</span>
                    <h4 className="text-2xl font-black">{currentWord.englishWord}</h4>
                  </div>
                  
                  <div className="w-12 h-px bg-white/20" />

                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Kannada Meaning</span>
                    <h3 className="text-3xl font-black tracking-tight leading-tight font-kannada">
                      {currentWord.kannadaMeaning.split(' (')[0]}
                    </h3>
                  </div>

                  <p className="text-sm font-medium opacity-80 leading-relaxed max-w-[240px] px-2 italic">
                    "{currentWord.explanationEnglish}"
                  </p>

                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-6 flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full">
                    <RotateCcw size={12} />
                    Click to flip
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 bg-white/20 text-white py-5 rounded-[28px] font-black flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/30 transition-all"
          >
            <ChevronLeft size={20} />
            Prev
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            className="flex-1 bg-white text-brand-saffron py-5 rounded-[28px] font-black flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all shadow-xl shadow-brand-saffron/20"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
