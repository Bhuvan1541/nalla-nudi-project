/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, BookmarkCheck, BookmarkPlus, Copy, BookOpen } from 'lucide-react';
import { WordEntry } from '../../model/Word';
import { SUBJECT_CONFIG } from './WordCard';

interface WordDetailProps {
  word: WordEntry | null;
  onClose: () => void;
  onToggleSave: (word: WordEntry) => void;
  isSaved: boolean;
  playPronunciation: (text: string) => void;
}

export const WordDetail: React.FC<WordDetailProps> = ({
  word,
  onClose,
  onToggleSave,
  isSaved,
  playPronunciation
}) => {
  if (!word) return null;
  const config = SUBJECT_CONFIG[word.subject] || SUBJECT_CONFIG['All'];

  return (
    <AnimatePresence>
      {word && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-m3-on-surface/40 backdrop-blur-md">
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-m3-surface w-full max-w-2xl rounded-t-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden border-t border-white/20"
          >
            <div className="w-12 h-1.5 bg-m3-surface-variant rounded-full mx-auto mt-4 mb-2 opacity-50" />
            
            <div className="p-8 sm:p-10 space-y-10">
              <div className="flex justify-between items-start gap-6">
                <div className="space-y-4">
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] w-fit ${config.bgColor} ${config.color} border ${config.borderColor}`}>
                    {React.cloneElement(config.icon as React.ReactElement, { size: 16 })}
                    {word.subject}
                  </div>
                  <h2 className="text-5xl font-black text-m3-on-surface -tracking-widest leading-tight">{word.englishWord}</h2>
                </div>
                <button onClick={onClose} className="p-4 bg-m3-surface-variant/40 rounded-full hover:bg-m3-surface-variant transition-all">
                  <X size={28} />
                </button>
              </div>

              <div className="p-8 bg-m3-primary-container text-m3-on-primary-container rounded-[32px] space-y-4 shadow-inner">
                <div className="flex justify-between items-center opacity-70">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">KANNADA MEANING</p>
                  <button onClick={() => playPronunciation(word.englishWord)} className="p-3 bg-white/40 rounded-full hover:bg-white transition-all active:scale-90">
                    <Volume2 size={24} />
                  </button>
                </div>
                <p className="text-4xl font-black font-kannada leading-tight">{word.kannadaMeaning}</p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-m3-on-surface-variant font-black uppercase tracking-[0.2em] text-[10px]">
                    <BookOpen size={14} />
                    EXPLANATION
                  </div>
                  <p className="text-xl text-m3-on-surface font-medium leading-relaxed font-kannada opacity-90">{word.explanationKannada}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-10 border-t border-m3-surface-variant/20">
                <button 
                  onClick={() => onToggleSave(word)}
                  className={`flex-[2] flex items-center justify-center gap-4 py-6 rounded-[32px] font-black text-lg transition-all ${
                    isSaved ? 'bg-m3-primary-container text-m3-on-primary-container ring-4 ring-m3-primary-container/50' : 'bg-m3-primary text-white shadow-xl shadow-m3-primary/20'
                  }`}
                >
                  {isSaved ? <><BookmarkCheck size={28} /> SAVED</> : <><BookmarkPlus size={28} /> SAVE WORD</>}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
