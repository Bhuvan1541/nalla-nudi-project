/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Subject = 'Science' | 'Mathematics' | 'Commerce' | 'Technology' | 'Social Science' | 'Arts' | 'Sports' | 'Literature';

export interface WordEntry {
  id: number;
  englishWord: string;
  kannadaMeaning: string;
  explanationKannada: string;
  subject: Subject;
  isSaved: boolean;
  pronunciation?: string;
}

export interface StreakData {
  count: number;
  lastVisit: string;
  bestStreak: number;
}

export interface UserSettings {
  appLanguage: 'English' | 'Kannada';
  notificationsEnabled: boolean;
  darkMode: boolean;
  soundEffects: boolean;
  dailyGoal: number; // minutes
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  lockType: 'none' | 'pattern' | 'password' | 'fingerprint';
  lockValue?: string; // Hashed or stored pattern/password
  isProtectionEnabled: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  type: 'fast_learner' | 'vocab_master' | 'night_owl';
}
