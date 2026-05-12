/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WordEntry, Subject, StreakData, UserSettings } from '../model/Word';
import { databaseService } from '../data/databaseService';
import { DICTIONARY } from '../data/dictionary';

export class WordRepository {
  private static instance: WordRepository;

  private constructor() {}

  public static getInstance(): WordRepository {
    if (!WordRepository.instance) {
      WordRepository.instance = new WordRepository();
    }
    return WordRepository.instance;
  }

  initialize(): WordEntry[] {
    return databaseService.initDb(DICTIONARY);
  }

  getWords(): WordEntry[] {
    return databaseService.getAllWords();
  }

  saveWord(wordId: number, isSaved: boolean): void {
    databaseService.saveWord(wordId, isSaved);
  }

  getStreak(): StreakData {
    return databaseService.updateStreak();
  }

  getSettings(): UserSettings {
    return databaseService.getSettings();
  }

  saveSettings(settings: UserSettings): void {
    databaseService.updateSettings(settings);
  }

  getWordOfTheDay(): WordEntry {
    const words = this.getWords();
    const now = new Date();
    const daySinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
    return words[daySinceEpoch % words.length];
  }
}
