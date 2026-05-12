/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Mic, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { WordEntry } from '../../model/Word';
import { HighlightedText } from './HighlightedText';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  startListening: () => void;
  isListening: boolean;
  suggestions: WordEntry[];
  showSuggestions: boolean;
  setShowSuggestions: (s: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  startListening,
  isListening,
  suggestions,
  showSuggestions,
  setShowSuggestions
}) => {
  return (
    <header className="bg-m3-surface/60 backdrop-blur-2xl px-6 py-3 sticky top-0 z-10 transition-all border-b border-m3-surface-variant/10">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <Logo size={10} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-m3-on-surface leading-none font-kannada">ನಲ್ಲ-ನುಡಿ</h1>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-m3-primary opacity-50 mt-0.5">Dictionary</span>
          </div>
        </div>
        
        <div className="relative group flex-1 max-w-sm hidden sm:block">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-m3-on-surface-variant group-focus-within:text-m3-primary transition-colors" />
          <input
            type="text"
            placeholder="Search words..."
            className="w-full bg-m3-surface-variant/20 border border-transparent focus:bg-white focus:border-m3-primary/30 rounded-full py-2 pl-11 pr-4 outline-none transition-all text-xs font-medium"
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="relative group mt-4 sm:hidden">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-m3-on-surface-variant flex items-center gap-2">
          <Search size={20} className="group-focus-within:text-m3-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="ಪದಗಳನ್ನು ಹುಡುಕಿ / Search words..."
          className="w-full bg-m3-surface-variant/40 border-2 border-transparent hover:bg-m3-surface-variant/60 focus:bg-white focus:border-m3-primary rounded-[24px] py-4 pl-14 pr-20 outline-none transition-all text-lg font-medium placeholder:text-m3-on-surface-variant shadow-sm focus:shadow-lg"
          value={searchQuery}
          onFocus={() => setShowSuggestions(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button 
            onClick={startListening}
            className={`p-3 rounded-full transition-all ${isListening ? 'bg-m3-primary text-m3-on-primary animate-pulse' : 'bg-transparent text-m3-on-surface-variant hover:bg-m3-primary/10'}`}
          >
            <Mic size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchQuery && showSuggestions && suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-6 right-6 mt-2 bg-white rounded-[24px] shadow-2xl p-3 z-50 border border-m3-surface-variant overflow-hidden max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-2 mb-2 px-3 py-1 border-b border-m3-surface-variant/10">
              <Sparkles size={12} className="text-m3-primary" />
              <span className="text-[10px] font-bold text-m3-on-surface-variant uppercase tracking-wider">Suggestions</span>
            </div>
            <div className="space-y-0.5">
              {suggestions.map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setSearchQuery(suggestion.englishWord);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-m3-primary-container/30 group flex justify-between items-center transition-all"
                >
                  <div>
                    <p className="font-bold text-sm text-m3-on-surface group-hover:text-m3-primary">
                      <HighlightedText text={suggestion.englishWord} query={searchQuery} />
                    </p>
                    <p className="text-[11px] text-m3-on-surface-variant font-medium">{suggestion.kannadaMeaning}</p>
                  </div>
                  <ChevronRight size={16} className="text-m3-on-surface-variant/20 group-hover:text-m3-primary transition-all" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
