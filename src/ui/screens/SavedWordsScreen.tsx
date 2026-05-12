/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Home, Search, Brain, Play, ArrowLeft } from 'lucide-react';
import { WordEntry } from '../../model/Word';
import { WordCard } from '../components/WordCard';
import { FlashcardMode } from '../components/FlashcardMode';

interface SavedWordsScreenProps {
  words: WordEntry[];
  toggleSave: (id: number) => void;
  onWordClick: (word: WordEntry) => void;
  onExploreClick: () => void;
  onBack: () => void;
}

export const SavedWordsScreen: React.FC<SavedWordsScreenProps> = ({
  words,
  toggleSave,
  onWordClick,
  onExploreClick,
  onBack
}) => {
  const [showFlashcards, setShowFlashcards] = useState(false);
  const savedWords = words.filter(w => w.isSaved);

  return (
    <div className="space-y-8">
      {/* Flashcard Overlay */}
      <AnimatePresence>
        {showFlashcards && (
          <FlashcardMode 
            words={savedWords} 
            onClose={() => setShowFlashcards(false)} 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-3 bg-white border border-black/5 rounded-2xl text-m3-outline hover:text-brand-saffron transition-colors shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-black tracking-tight text-m3-on-surface">My Collections</h2>
          <p className="text-xs font-bold text-m3-outline uppercase tracking-widest mt-1">{savedWords.length} Words Saved</p>
        </div>
        <div className="w-12 h-12 bg-brand-saffron/10 rounded-2xl flex items-center justify-center text-brand-saffron">
          <Bookmark size={24} />
        </div>
      </div>

      {savedWords.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFlashcards(true)}
          className="w-full bg-brand-green text-white p-6 rounded-[32px] flex items-center justify-between shadow-xl shadow-brand-green/20 overflow-hidden relative group"
        >
          <div className="absolute -right-4 -top-4 opacity-20 rotate-12 group-hover:scale-110 transition-transform">
            <Brain size={120} />
          </div>
          <div className="space-y-1 text-left relative z-10">
            <h3 className="text-xl font-black">Flashcard Mode</h3>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Master your saved words</p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md relative z-10">
            <Play size={24} fill="white" />
          </div>
        </motion.button>
      )}

      {savedWords.length > 0 ? (
        <div className="space-y-3">
          {savedWords.map(word => (
            <WordCard 
              key={word.id} 
              word={word} 
              isSaved={true}
              onClick={() => onWordClick(word)}
              onToggleSave={(e) => { e.stopPropagation(); toggleSave(word.id); }}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-8">
          <div className="bg-brand-saffron/5 w-32 h-32 rounded-full flex items-center justify-center mx-auto text-brand-saffron/30">
            <Bookmark size={64} />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-black text-m3-on-surface">ನಿಮ್ಮ ಪಟ್ಟಿ ಖಾಲಿ ಇದೆ</p>
            <p className="text-sm font-medium text-m3-outline">Start saving words to build your vocabulary!</p>
          </div>
          <button 
            onClick={onExploreClick}
            className="btn-primary w-full max-w-xs mx-auto"
          >
            Explore Dictionary
          </button>
        </div>
      )}
    </div>
  );
};
