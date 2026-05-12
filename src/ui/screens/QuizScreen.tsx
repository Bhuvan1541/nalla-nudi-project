/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Sparkles, ChevronRight, Share2 } from 'lucide-react';
import { WordEntry } from '../../model/Word';
import { shareService } from '../../services/shareService';

interface QuizScreenProps {
  words: WordEntry[];
  onComplete: () => void;
  onBack: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ words, onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [options, setOptions] = useState<WordEntry[]>([]);

  const handleShareResult = () => {
    shareService.share({
      title: 'My Quiz Results - Nalla Nudi',
      text: `I just finished a quiz on Nalla Nudi and scored ${score}/5! 🔥\n\nLearning technical English in Kannada has never been easier.\n\nCan you beat my score?`,
      url: window.location.origin
    });
  };

  const currentWord = words[currentIndex % words.length];

  useEffect(() => {
    // Generate 4 random options INCLUDING the current word
    const others = words.filter(w => w.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const newOptions = [...others, currentWord].sort(() => 0.5 - Math.random());
    setOptions(newOptions);
    setSelectedOption(null);
  }, [currentIndex, currentWord, words]);

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(idx);
    if (options[idx].id === currentWord.id) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentIndex < 4) {
        setCurrentIndex(i => i + 1);
      } else {
        setIsDone(true);
      }
    }, 1200);
  };

  if (isDone) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-8"
      >
        <div className="w-32 h-32 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green animate-bounce">
          <Sparkles size={64} />
        </div>
        <div>
          <h2 className="text-3xl font-black">Well Done!</h2>
          <p className="text-m3-outline font-medium">You completed today's quiz.</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5 w-64">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-m3-outline mb-2">Score</p>
          <p className="text-6xl font-black text-brand-saffron">{score}/5</p>
        </div>
        
        <div className="flex flex-col w-full max-w-xs gap-3">
          <button 
            onClick={handleShareResult} 
            className="w-full py-5 bg-brand-green/10 text-brand-green rounded-[24px] font-black flex items-center justify-center gap-2 hover:bg-brand-green/20 transition-all"
          >
            <Share2 size={20} />
            Share Results
          </button>
          
          <button onClick={onComplete} className="btn-primary w-full py-5">
            Finish Quiz
          </button>
        </div>
      </motion.div>
    );
  }

  const progress = ((currentIndex + 1) / 5) * 100;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Quiz Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <button onClick={onBack} className="text-m3-outline hover:text-m3-on-surface"><X size={24} /></button>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-saffron">Question {currentIndex + 1} of 5</span>
          <div className="w-8" />
        </div>
        <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-black/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-brand-saffron"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-[32px] p-10 text-center shadow-sm border border-black/5 space-y-4">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-m3-outline">What is the meaning of</p>
        <h3 className="text-5xl font-black font-kannada text-brand-saffron">{currentWord.kannadaMeaning.split(' (')[0]}</h3>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((option, idx) => {
          const isCorrect = option.id === currentWord.id;
          const isSelected = selectedOption === idx;
          const showResult = selectedOption !== null;

          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.98 }}
              disabled={showResult}
              onClick={() => handleOptionSelect(idx)}
              className={`p-6 rounded-[24px] text-left flex justify-between items-center transition-all border-2 ${
                showResult 
                  ? isCorrect 
                    ? 'bg-brand-green/10 border-brand-green text-brand-green' 
                    : isSelected 
                      ? 'bg-red-50 border-red-500 text-red-500' 
                      : 'bg-white border-transparent opacity-40'
                  : 'bg-white border-transparent shadow-sm hover:border-brand-saffron/20'
              }`}
            >
              <span className="text-lg font-black">{option.englishWord}</span>
              {showResult && isCorrect && <CheckCircle2 size={24} />}
              {showResult && isSelected && !isCorrect && <AlertCircle size={24} />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
