/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WordEntry, Subject, StreakData, UserSettings } from '../model/Word';

const GLOSSARY_DB_KEY = 'nalla_nudi_glossary_db';
const STREAK_KEY = 'nalla_nudi_streak_data';
const SETTINGS_KEY = 'nalla_nudi_settings';

export const databaseService = {
  getStreakData: (): StreakData => {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : { count: 0, lastVisit: '', bestStreak: 0 };
  },

  updateStreak: (): StreakData => {
    const today = new Date().toDateString();
    const data = databaseService.getStreakData();
    
    if (data.lastVisit === today) return data;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newCount = 1;
    if (data.lastVisit === yesterdayStr) {
      newCount = data.count + 1;
    }

    const newData = {
      count: newCount,
      lastVisit: today,
      bestStreak: Math.max(newCount, data.bestStreak)
    };

    localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
    return newData;
  },

  getSettings: (): UserSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { 
      appLanguage: 'English', 
      notificationsEnabled: true, 
      darkMode: false,
      soundEffects: true,
      dailyGoal: 10,
      userName: 'Bhuvan L',
      userEmail: 'blbhuvan2@gmail.com',
      lockType: 'none',
      isProtectionEnabled: false
    };
  },

  updateSettings: (settings: UserSettings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  getAllWords: (): WordEntry[] => {
    const data = localStorage.getItem(GLOSSARY_DB_KEY);
    return data ? JSON.parse(data) : [];
  },

  initDb: (initialData: WordEntry[]): WordEntry[] => {
    const data = localStorage.getItem(GLOSSARY_DB_KEY);
    if (!data) {
      localStorage.setItem(GLOSSARY_DB_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(data);
  },

  saveWord: (wordId: number, isSaved: boolean): void => {
    const words = databaseService.getAllWords();
    const updated = words.map(w => 
      w.id === wordId ? { ...w, isSaved } : w
    );
    localStorage.setItem(GLOSSARY_DB_KEY, JSON.stringify(updated));
  }
};
