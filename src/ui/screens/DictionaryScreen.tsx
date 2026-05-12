/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Mic, ArrowLeft, Loader2, Filter, LayoutGrid } from 'lucide-react';
import { WordEntry, Subject } from '../../model/Word';
import { WordCard, SUBJECT_CONFIG } from '../components/WordCard';
import { speechService } from '../../services/speechService';

interface DictionaryScreenProps {
  words: WordEntry[];
  onBack: () => void;
  onWordClick: (word: WordEntry) => void;
  onToggleSave: (id: number) => void;
}

export const DictionaryScreen: React.FC<DictionaryScreenProps> = ({
  words,
  onBack,
  onWordClick,
  onToggleSave
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [isListening, setIsListening] = useState(false);

  const SUBJECTS: Subject[] = ['Science', 'Mathematics', 'Commerce', 'Technology', 'Social Science', 'Arts', 'Sports', 'Literature'];

  const filteredWords = useMemo(() => {
    return words.filter(word => {
      const matchesQuery = query === '' || 
        word.englishWord.toLowerCase().includes(query.toLowerCase()) ||
        word.kannadaMeaning.toLowerCase().includes(query.toLowerCase());
      
      const matchesSubject = selectedSubject === 'All' || word.subject === selectedSubject;
      
      return matchesQuery && matchesSubject;
    });
  }, [words, query, selectedSubject]);

  const addToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const newHistory = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(newHistory);
    localStorage.setItem('recentSearches', JSON.stringify(newHistory));
  };

  const handleVoiceSearch = () => {
    if (isListening) {
      speechService.stopListening();
    } else {
      speechService.startListening(
        (result) => {
          setQuery(result);
          addToHistory(result);
          setIsListening(false);
        },
        (error) => {
          console.error('Speech error:', error);
          setIsListening(false);
        },
        (listening) => setIsListening(listening)
      );
    }
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <section className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-3 bg-white border border-black/5 rounded-2xl text-m3-outline hover:text-brand-saffron transition-colors shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Full Dictionary</h2>
          <p className="text-xs font-medium text-m3-outline">Browse all {words.length} words</p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="space-y-4 sticky top-0 bg-brand-warm-surface z-20 pb-2">
        <div className="relative flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-m3-outline">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addToHistory(query);
              }}
              placeholder="Search in English or Kannada..."
              className="w-full bg-white border border-black/5 rounded-[24px] py-4 pl-14 pr-12 font-bold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-saffron/20 transition-all placeholder:text-m3-outline/50"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-4 flex items-center text-m3-outline hover:text-brand-saffron"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleVoiceSearch}
            className={`flex items-center justify-center w-[58px] h-[58px] rounded-[24px] shadow-lg transition-all ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-red-200' 
                : 'bg-brand-saffron text-white shadow-brand-saffron/20'
            }`}
          >
            {isListening ? <Loader2 className="animate-spin" size={24} /> : <Mic size={24} />}
          </motion.button>
        </div>

        {/* Categories Bar in Search */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
          <button
            onClick={() => setSelectedSubject('All')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap border text-xs transition-all ${
              selectedSubject === 'All' 
                ? 'bg-brand-saffron text-white border-brand-saffron shadow-md shadow-brand-saffron/20' 
                : 'bg-white border-black/5 text-m3-outline hover:bg-black/5'
            }`}
          >
            <LayoutGrid size={14} />
            All
          </button>
          
          {SUBJECTS.map(subject => {
            const config = SUBJECT_CONFIG[subject];
            const isActive = selectedSubject === subject;
            return (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap border text-xs transition-all ${
                  isActive 
                    ? 'bg-brand-saffron text-white border-brand-saffron shadow-md shadow-brand-saffron/20' 
                    : 'bg-white border-black/5 text-m3-outline hover:bg-black/5'
                }`}
              >
                {config && React.cloneElement(config.icon as React.ReactElement, { size: 14 })}
                {subject}
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent searches */}
      {query === '' && recentSearches.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-m3-outline">Recent Searches</h3>
            <button 
              onClick={clearHistory}
              className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s, i) => (
              <button
                key={i}
                onClick={() => setQuery(s)}
                className="bg-white border border-black/5 px-4 py-2 rounded-xl text-xs font-bold text-m3-outline hover:border-brand-saffron hover:text-brand-saffron transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Results List */}
      <section className="flex-1 space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-m3-outline">
            {filteredWords.length} results found
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredWords.map(word => (
              <WordCard 
                key={word.id}
                word={word}
                isSaved={word.isSaved}
                onClick={() => onWordClick(word)}
                onToggleSave={(e) => {
                  e.stopPropagation();
                  onToggleSave(word.id);
                }}
              />
            ))}
          </AnimatePresence>
          
          {filteredWords.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/50 border border-black/5 border-dashed rounded-[32px] p-12 text-center space-y-4"
            >
              <div className="bg-black/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-m3-outline">
                <Search size={32} />
              </div>
              <div className="space-y-1">
                <p className="font-black">No matching words</p>
                <p className="text-xs text-m3-outline">Try a different search term or category</p>
              </div>
              <button 
                onClick={() => { setQuery(''); setSelectedSubject('All'); }}
                className="text-xs font-black text-brand-saffron uppercase tracking-widest"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};
