/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { WordEntry, Subject, StreakData, UserSettings } from '../model/Word';
import { WordRepository } from '../repository/WordRepository';
import Fuse from 'fuse.js';

export const useWordViewModel = () => {
  const repository = WordRepository.getInstance();
  const [words, setWords] = useState<WordEntry[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [settings, setSettings] = useState<UserSettings>(() => repository.getSettings());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);

  useEffect(() => {
    const initializedWords = repository.initialize();
    setWords(initializedWords);
    setStreak(repository.getStreak());
  }, []);

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    repository.saveSettings(newSettings);
  };

  const fuse = useMemo(() => {
    return new Fuse(words, {
      keys: ['englishWord', 'kannadaMeaning'],
      threshold: 0.35,
    });
  }, [words]);

  const filteredWords = useMemo(() => {
    let result = words;
    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map(r => r.item);
    }
    if (selectedSubject !== 'All') {
      result = result.filter(w => w.subject === selectedSubject);
    }
    return result;
  }, [words, searchQuery, selectedSubject, fuse]);

  const toggleSave = (wordId: number) => {
    const word = words.find(w => w.id === wordId);
    if (word) {
      const newStatus = !word.isSaved;
      repository.saveWord(wordId, newStatus);
      setWords(prev => prev.map(w => w.id === wordId ? { ...w, isSaved: newStatus } : w));
    }
  };

  const wordOfTheDay = useMemo(() => {
    if (words.length === 0) return null;
    
    let pool = words;
    if (selectedSubject !== 'All') {
      pool = words.filter(w => w.subject === selectedSubject);
    }
    
    // If specific pool is empty, don't fallback to all words for Word of the Day
    // to strictly respect selected department
    if (pool.length === 0) return null;

    const now = new Date();
    const daySinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
    
    // Create a deterministic index based on date and subject
    const subjectHash = selectedSubject === 'All' 
      ? 0 
      : selectedSubject.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return pool[(daySinceEpoch + subjectHash) % pool.length];
  }, [words, selectedSubject]);

  const dailySubjectWords = useMemo(() => {
    if (words.length === 0) return [];
    
    let pool = words;
    if (selectedSubject !== 'All') {
      pool = words.filter(w => w.subject === selectedSubject);
    }
    
    if (pool.length === 0) return [];

    const now = new Date();
    const daySinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
    const subjectHash = selectedSubject === 'All' 
      ? 0 
      : selectedSubject.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Pick 3 words deterministically
    return [
      pool[(daySinceEpoch + subjectHash) % pool.length],
      pool[(daySinceEpoch + subjectHash + 1) % pool.length],
      pool[(daySinceEpoch + subjectHash + 2) % pool.length]
    ].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i); // Ensure unique
  }, [words, selectedSubject]);

  // Achievement logic
  const achievements = useMemo(() => {
    const savedCount = words.filter(w => w.isSaved).length;
    const hour = new Date().getHours();
    
    return {
      vocabMaster: true, // Force unlocked as requested
      nightOwl: true,    // Force unlocked as requested
      fastLearner: true  // Force unlocked as requested
    };
  }, [words, streak]);

  return {
    words: filteredWords,
    allWords: words,
    streak,
    settings,
    updateSettings,
    achievements,
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    selectedWord,
    setSelectedWord,
    toggleSave,
    wordOfTheDay,
    dailySubjectWords
  };
};
