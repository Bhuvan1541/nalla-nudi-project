/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WordEntry, Subject } from '../../model/Word';
import { BookOpen, FlaskConical, Calculator, Landmark, Cpu, BookmarkCheck, BookmarkPlus, Globe, Palette, Trophy, Library, Share2, Eye, EyeOff, Search } from 'lucide-react';
import { shareService } from '../../services/shareService';

export const SUBJECT_CONFIG: Record<Subject | 'All', { icon: React.ReactNode, color: string, bgColor: string, borderColor: string }> = {
  'All': { 
    icon: <BookOpen size={18} />, 
    color: 'text-m3-on-primary-container', 
    bgColor: 'bg-m3-primary-container',
    borderColor: 'border-m3-primary/20'
  },
  'Science': { 
    icon: <FlaskConical size={18} />, 
    color: 'text-emerald-900', 
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200'
  },
  'Mathematics': { 
    icon: <Calculator size={18} />, 
    color: 'text-amber-900', 
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200'
  },
  'Commerce': { 
    icon: <Landmark size={18} />, 
    color: 'text-rose-900', 
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-200'
  },
  'Technology': { 
    icon: <Cpu size={18} />, 
    color: 'text-blue-900', 
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  'Social Science': { 
    icon: <Globe size={18} />, 
    color: 'text-indigo-900', 
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-200'
  },
  'Arts': { 
    icon: <Palette size={18} />, 
    color: 'text-purple-900', 
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  },
  'Sports': { 
    icon: <Trophy size={18} />, 
    color: 'text-orange-900', 
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200'
  },
  'Literature': { 
    icon: <Library size={18} />, 
    color: 'text-teal-900', 
    bgColor: 'bg-teal-100',
    borderColor: 'border-teal-200'
  }
};

interface WordCardProps {
  word: WordEntry;
  isSaved: boolean;
  onClick: () => void;
  onToggleSave: (e: React.MouseEvent) => void;
  variant?: 'default' | 'primary';
}

export const WordCard: React.FC<WordCardProps> = ({ 
  word, 
  isSaved, 
  onClick, 
  onToggleSave,
  variant = 'default' 
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const toggleReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevealed(!isRevealed);
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-6 rounded-[24px] transition-all cursor-pointer border ${
        variant === 'primary' 
          ? 'bg-brand-saffron text-white shadow-xl shadow-brand-saffron/20 border-transparent' 
          : 'bg-white border-black/5 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <div className={`opacity-60 ${variant === 'primary' ? 'text-white' : 'text-brand-saffron'}`}>
              {React.cloneElement(SUBJECT_CONFIG[word.subject]?.icon as React.ReactElement, { size: 14 })}
            </div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${variant === 'primary' ? 'text-white/60' : 'text-m3-outline'}`}>
              {word.subject}
            </p>
          </div>
          <h3 className="text-xl font-black tracking-tight">{word.englishWord}</h3>
          
          <div className="mt-2 h-8 flex items-center">
            <AnimatePresence mode="wait">
              {isRevealed ? (
                <motion.p 
                  key="meaning"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`text-lg font-black font-kannada leading-tight ${variant === 'primary' ? 'text-white' : 'text-brand-saffron'}`}
                >
                  {word.kannadaMeaning.split(' (')[0]}
                </motion.p>
              ) : (
                <motion.button
                  key="reveal-btn"
                  onClick={toggleReveal}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                    variant === 'primary' 
                      ? 'border-white/20 text-white hover:bg-white/10' 
                      : 'border-brand-saffron/20 text-brand-saffron hover:bg-brand-saffron/5'
                  }`}
                >
                  <Eye size={12} />
                  Tap to Reveal
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://www.google.com/search?q=${encodeURIComponent(word.englishWord)}+meaning`, '_blank');
            }}
            className={`p-3 rounded-xl transition-all ${
              variant === 'primary' 
                ? 'bg-white/20 text-white' 
                : 'bg-black/5 text-m3-outline hover:bg-brand-saffron/10 hover:text-brand-saffron'
            }`}
            title="Search on Google"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              shareService.shareWord(word.englishWord, word.kannadaMeaning);
            }}
            className={`p-3 rounded-xl transition-all ${
              variant === 'primary' 
                ? 'bg-white/20 text-white' 
                : 'bg-black/5 text-m3-outline'
            }`}
          >
            <Share2 size={20} />
          </button>
          <div 
            onClick={onToggleSave}
            className={`p-3 rounded-xl transition-all ${
              variant === 'primary' 
                ? 'bg-white/20 text-white' 
                : isSaved ? 'bg-brand-saffron/10 text-brand-saffron' : 'bg-black/5 text-m3-outline'
            }`}
          >
            {isSaved ? <BookmarkCheck size={20} /> : <BookmarkPlus size={20} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
