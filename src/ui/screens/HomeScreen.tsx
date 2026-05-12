/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Trophy, Play, Brain, Mic, LayoutGrid, ChevronRight, BookOpen, Search, X, Loader2 } from 'lucide-react';
import { WordEntry, Subject, StreakData } from '../../model/Word';
import { SUBJECT_CONFIG, WordCard } from '../components/WordCard';
import { Logo } from '../components/Logo';
import { speechService } from '../../services/speechService';

interface HomeScreenProps {
  onStartLearn: () => void;
  onStartQuiz: () => void;
  onStartPractice: () => void;
  onWordClick: (word: WordEntry) => void;
  onToggleSave: (id: number) => void;
  onSeeMore: () => void;
  wordOfTheDay: WordEntry | null;
  streak: StreakData | null;
  selectedSubject: Subject | 'All';
  setSelectedSubject: (subject: Subject | 'All') => void;
  words: WordEntry[];
  dailySubjectWords: WordEntry[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartLearn,
  onStartQuiz,
  onStartPractice,
  onWordClick,
  onToggleSave,
  onSeeMore,
  wordOfTheDay,
  streak,
  selectedSubject,
  setSelectedSubject,
  words,
  dailySubjectWords,
}) => {
  const SUBJECTS: Subject[] = ['Science', 'Mathematics', 'Commerce', 'Technology', 'Social Science', 'Arts', 'Sports', 'Literature'];
  const config = wordOfTheDay ? (SUBJECT_CONFIG[wordOfTheDay.subject] || SUBJECT_CONFIG['All']) : null;

  return (
    <div className="space-y-8 pb-10">
      {/* User Progress Header */}
      <section className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0">
            <Logo className="w-full h-full" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-m3-on-surface">ನಮಸ್ಕಾರ!</h2>
            <p className="text-sm font-medium text-m3-outline">Ready to learn Kannada today?</p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onSeeMore}
            className="w-12 h-12 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-m3-outline hover:text-brand-saffron transition-colors shadow-sm"
          >
            <Search size={22} />
          </motion.button>
          <div className="bg-orange-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-orange-100 shadow-sm shadow-orange-500/5">
            <Flame size={18} className="text-orange-500" />
            <span className="font-black text-orange-900">{streak?.count || 0}</span>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative group">
        <div 
          onClick={onSeeMore}
          className="relative cursor-pointer"
        >
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-m3-outline group-hover:text-brand-saffron transition-colors">
            <Search size={20} />
          </div>
          <div className="w-full bg-white border border-black/5 rounded-[24px] py-4 pl-14 pr-12 font-bold text-sm shadow-sm transition-all text-m3-outline/50 flex items-center">
            Search words in English or Kannada...
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center">
            <div className="w-8 h-8 rounded-xl bg-brand-saffron/10 flex items-center justify-center text-brand-saffron">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </section>
      {wordOfTheDay && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-m3-outline">Daily Word</h3>
          </div>
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={onStartLearn}
            className="bg-brand-saffron rounded-[32px] p-8 text-white shadow-xl shadow-brand-saffron/20 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform">
              <LayoutGrid size={240} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full w-fit">
                {config && React.cloneElement(config.icon as React.ReactElement, { size: 14, className: "text-white" })}
                <span className="text-[10px] font-black uppercase tracking-wider">{wordOfTheDay.subject}</span>
              </div>
              <h4 className="text-5xl font-black font-kannada leading-tight">{wordOfTheDay.kannadaMeaning.split(' (')[0]}</h4>
              <div>
                <p className="text-xl font-bold opacity-90">{wordOfTheDay.englishWord}</p>
                <div className="h-1 w-12 bg-white/40 rounded-full mt-2" />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold bg-white/20 px-4 py-2 rounded-full w-fit">
                Tap to learn more <ChevronRight size={14} />
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Daily Challenge Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-m3-outline">Daily Challenge</h3>
        </div>
        <motion.div 
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartQuiz}
          className="bg-brand-green rounded-[32px] p-8 text-white shadow-xl shadow-brand-green/20 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute -right-6 -top-6 opacity-20 group-hover:scale-110 transition-transform">
            <Brain size={120} />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full w-fit">
                <Trophy size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">+50 Points</span>
              </div>
              <h4 className="text-2xl font-black tracking-tight">Today's Quick Quiz</h4>
              <p className="text-sm opacity-80 font-medium">Test your knowledge and keep your streak!</p>
            </div>
            <div className="bg-white text-brand-green p-4 rounded-2xl shadow-lg">
              <Play size={24} fill="currentColor" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Departments / Subjects Filter */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-m3-outline px-2">Departments</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedSubject('All')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border ${
              selectedSubject === 'All' 
                ? 'bg-brand-saffron text-white border-brand-saffron shadow-lg shadow-brand-saffron/20 text-sm scale-105' 
                : 'bg-white border-black/5 text-m3-outline text-xs text-m3-outline'
            }`}
          >
            <LayoutGrid size={selectedSubject === 'All' ? 18 : 16} />
            All Topics
          </motion.button>
          
          {SUBJECTS.map(subject => {
            const subjectConfig = SUBJECT_CONFIG[subject];
            const isActive = selectedSubject === subject;
            
            return (
              <motion.button
                key={subject}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSubject(subject)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border ${
                  isActive 
                    ? `bg-brand-saffron text-white border-brand-saffron shadow-lg shadow-brand-saffron/20 text-sm scale-105` 
                    : 'bg-white border-black/5 text-m3-outline text-xs text-m3-outline'
                }`}
              >
                {subjectConfig && React.cloneElement(subjectConfig.icon as React.ReactElement, { size: isActive ? 18 : 16 })}
                {subject}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Daily Focus for Department */}
      {dailySubjectWords.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-m3-outline">
              Daily Focus: {selectedSubject === 'All' ? 'All Topics' : selectedSubject}
            </h3>
            <span className="text-[10px] font-black text-brand-saffron bg-brand-saffron/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Today's Picks</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
            {dailySubjectWords.map((word) => (
              <motion.div
                key={word.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onWordClick(word)}
                className="min-w-[240px] flex-shrink-0 bg-white border border-black/5 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-saffron/5 rounded-bl-[64px] -z-0 group-hover:scale-110 transition-transform" />
                <div className="relative z-10 space-y-3">
                  <div className="bg-brand-saffron/10 p-2 rounded-xl w-fit text-brand-saffron">
                    {React.cloneElement(SUBJECT_CONFIG[word.subject]?.icon as React.ReactElement, { size: 16 })}
                  </div>
                  <h4 className="text-lg font-black tracking-tight">{word.englishWord}</h4>
                  <p className="text-base font-black font-kannada text-brand-saffron">{word.kannadaMeaning.split(' (')[0]}</p>
                  <p className="text-[10px] text-m3-outline font-bold leading-tight line-clamp-2">
                    {word.explanationKannada}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="grid grid-cols-1 gap-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-m3-outline px-2">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <motion.button 
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStartLearn}
            className="m3-card p-6 flex flex-col items-center gap-4 text-center group"
          >
            <div className="bg-brand-green/10 p-4 rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-colors">
              <Play size={28} />
            </div>
            <div>
              <p className="font-black text-sm">Learn</p>
              <p className="text-[10px] text-m3-outline">New Vocabulary</p>
            </div>
          </motion.button>

          <motion.button 
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStartQuiz}
            className="m3-card p-6 flex flex-col items-center gap-4 text-center group"
          >
            <div className="bg-brand-saffron/10 p-4 rounded-2xl group-hover:bg-brand-saffron group-hover:text-white transition-colors">
              <Brain size={28} />
            </div>
            <div>
              <p className="font-black text-sm">Quiz</p>
              <p className="text-[10px] text-m3-outline">Test yourself</p>
            </div>
          </motion.button>
        </div>

        <motion.button 
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStartPractice}
          className="m3-card p-6 flex items-center gap-6 group"
        >
          <div className="bg-brand-green p-4 rounded-2xl text-white shadow-lg shadow-brand-green/20">
            <Mic size={28} />
          </div>
          <div className="text-left">
            <p className="font-black text-lg">Practice Speaking</p>
            <p className="text-xs text-m3-outline">Improve your pronunciation</p>
          </div>
          <ChevronRight className="ml-auto text-m3-outline group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </section>

      {/* Explore Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-m3-outline">
            {selectedSubject === 'All' ? 'Vocabulary' : `${selectedSubject} Words`}
          </h3>
          <button 
            onClick={onSeeMore}
            className="text-[10px] font-black text-brand-saffron uppercase tracking-widest hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {words.slice(0, 20).map(word => (
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
          {words.length === 0 && (
            <div className="m3-card p-10 text-center space-y-2 opacity-60">
              <p className="font-black">No words found</p>
              <p className="text-xs">Try searching for something else</p>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSeeMore}
            className="w-full py-6 mt-4 bg-white border border-black/5 rounded-[32px] flex items-center justify-center gap-3 text-brand-saffron font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:shadow-md transition-all"
          >
            <Search size={16} />
            Search to see more words
          </motion.button>
        </div>
      </section>
    </div>
  );
};
