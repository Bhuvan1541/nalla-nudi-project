/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Volume2, ChevronLeft, BookmarkPlus, BookmarkCheck, LayoutGrid, BookOpen } from 'lucide-react';
import { WordEntry } from '../../model/Word';
import { SUBJECT_CONFIG } from '../components/WordCard';

interface LearningScreenProps {
  word: WordEntry;
  isSaved: boolean;
  onToggleSave: () => void;
  onBack: () => void;
  onPlayAudio: (text: string) => void;
}

export const LearningScreen: React.FC<LearningScreenProps> = ({
  word,
  isSaved,
  onToggleSave,
  onBack,
  onPlayAudio
}) => {
  const config = SUBJECT_CONFIG[word.subject] || SUBJECT_CONFIG['All'];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 pb-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm border border-black/5 active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={onToggleSave}
          className={`p-3 rounded-2xl shadow-sm border active:scale-90 transition-all ${
            isSaved ? 'bg-brand-saffron border-brand-saffron text-white' : 'bg-white border-black/5 text-m3-outline'
          }`}
        >
          {isSaved ? <BookmarkCheck size={24} /> : <BookmarkPlus size={24} />}
        </button>
      </div>

      {/* Main Word Display */}
      <div className="bg-white rounded-[40px] p-10 text-center shadow-sm border border-black/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-brand-saffron rotate-12">
          <LayoutGrid size={200} />
        </div>
        
        <div className="space-y-6 relative z-10">
          <div className="mx-auto w-16 h-1 w-12 bg-brand-saffron/20 rounded-full mb-8" />
          <h2 className="text-6xl font-black font-kannada text-m3-on-surface leading-tight tracking-tighter">
            {word.kannadaMeaning.split(' (')[0]}
          </h2>
          <div className="space-y-1">
            <p className="text-2xl font-black text-brand-saffron">{word.englishWord}</p>
            <div className="flex items-center justify-center gap-2">
              <div className="text-brand-saffron opacity-60">
                {React.cloneElement(config.icon as React.ReactElement, { size: 14 })}
              </div>
              <p className="text-xs font-bold text-m3-outline uppercase tracking-widest">{word.subject}</p>
            </div>
          </div>
          
          <button 
            onClick={() => onPlayAudio(word.englishWord)}
            className="mx-auto mt-8 w-20 h-20 bg-brand-saffron rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-saffron/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Volume2 size={32} />
          </button>
        </div>
      </div>

      {/* Details Sections */}
      <div className="space-y-4">
        <section className="m3-card p-8 space-y-4">
          <div className="flex items-center gap-3 text-brand-green">
            <BookOpen size={20} />
            <h4 className="text-xs font-black uppercase tracking-widest">Description</h4>
          </div>
          <p className="text-lg font-medium text-m3-on-surface font-kannada leading-relaxed">
            {word.explanationKannada}
          </p>
        </section>

        <section className="bg-brand-green/5 m3-card p-8 border-brand-green/10 space-y-2">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-green opacity-60">Example Usage</h4>
          <p className="text-base font-bold text-m3-on-surface leading-relaxed italic">
            "The {word.englishWord.toLowerCase()} is fundamental to our understanding of {word.subject.toLowerCase()}."
          </p>
        </section>
      </div>

      <button onClick={onBack} className="btn-primary w-full py-5 text-lg">
        Keep Exploring
      </button>
    </motion.div>
  );
};
