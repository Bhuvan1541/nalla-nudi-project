/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home, Bookmark, User, Search, Brain, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from './ui/components/SplashScreen';
import { SecurityScreen } from './ui/screens/SecurityScreen';
import { LoginScreen } from './ui/screens/LoginScreen';
import { HomeScreen } from './ui/screens/HomeScreen';
import { LearningScreen } from './ui/screens/LearningScreen';
import { QuizScreen } from './ui/screens/QuizScreen';
import { QuizLanding } from './ui/screens/QuizLanding';
import { ProfileScreen } from './ui/screens/ProfileScreen';
import { PracticeScreen } from './ui/screens/PracticeScreen';
import { DictionaryScreen } from './ui/screens/DictionaryScreen';
import { SavedWordsScreen } from './ui/screens/SavedWordsScreen';
import { useWordViewModel } from './viewmodel/useWordViewModel';
import { WordEntry } from './model/Word';
import { speechService } from './services/speechService';

type AppState = 'splash' | 'main';
type Tab = 'home' | 'quiz' | 'saved' | 'profile';
type ActiveView = 'list' | 'learning' | 'practice' | 'dictionary';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [activeView, setActiveView] = useState<ActiveView>('list');
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  
  const {
    words,
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
  } = useWordViewModel();

  const handleStartLearn = () => {
    setActiveView('learning');
    if (!selectedWord) setSelectedWord(wordOfTheDay);
  };

  const handleStartPractice = () => {
    setActiveView('practice');
    if (!selectedWord) setSelectedWord(wordOfTheDay);
  };

  const handlePlayAudio = (text: string) => {
    speechService.speak(text);
  };

  const handleLogin = (email: string, name: string) => {
    updateSettings({ ...settings, userEmail: email, userName: name });
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUnlocked(false);
    localStorage.removeItem('isLoggedIn');
    setActiveTab('home');
  };

  useEffect(() => {
    const initMobile = async () => {
      try {
        await CapApp.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            CapApp.exitApp();
          } else {
            // If we're in a sub-view, go back to the home/list
            if (activeView !== 'list' || activeTab !== 'home') {
              setActiveView('list');
              setActiveTab('home');
            } else {
              CapApp.exitApp();
            }
          }
        });
      } catch (e) {
        console.log('Not running in mobile environment');
      }
    };

    initMobile();
  }, [activeView, activeTab]);

  if (appState === 'splash') {
    return <SplashScreen onComplete={() => setAppState('main')} />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (settings.isProtectionEnabled && !isUnlocked) {
    return <SecurityScreen onUnlock={() => setIsUnlocked(true)} settings={settings} />;
  }

  return (
    <div className="min-h-screen bg-brand-warm-surface font-sans text-m3-on-surface flex flex-col">
      {/* Scrollable Content Container */}
      <main className="flex-1 px-6 pt-12 pb-32 max-w-2xl mx-auto w-full overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {activeView === 'learning' && selectedWord ? (
            <LearningScreen 
              key="learning"
              word={selectedWord}
              isSaved={selectedWord.isSaved}
              onToggleSave={() => toggleSave(selectedWord.id)}
              onBack={() => setActiveView('list')}
              onPlayAudio={handlePlayAudio}
            />
          ) : activeView === 'practice' && selectedWord ? (
            <PracticeScreen 
              key="practice"
              word={selectedWord}
              onBack={() => setActiveView('list')}
              onPlayAudio={handlePlayAudio}
            />
          ) : activeView === 'dictionary' ? (
            <DictionaryScreen 
              key="dictionary"
              words={words}
              onBack={() => setActiveView('list')}
              onWordClick={(w) => {
                setSelectedWord(w);
                setActiveView('learning');
              }}
              onToggleSave={toggleSave}
            />
          ) : (
            <motion.div
              key="tabs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {activeTab === 'home' ? (
                <HomeScreen 
                  onStartLearn={handleStartLearn}
                  onStartQuiz={() => {
                    setActiveTab('quiz');
                    setIsQuizStarted(true);
                  }}
                  onStartPractice={handleStartPractice} 
                  onWordClick={(w) => {
                    setSelectedWord(w);
                    setActiveView('learning');
                  }}
                  onToggleSave={toggleSave}
                  onSeeMore={() => setActiveView('dictionary')}
                  wordOfTheDay={wordOfTheDay}
                  streak={streak}
                  selectedSubject={selectedSubject}
                  setSelectedSubject={setSelectedSubject}
                  words={words}
                  dailySubjectWords={dailySubjectWords}
                />
              ) : activeTab === 'quiz' ? (
                isQuizStarted ? (
                  <QuizScreen 
                    key="quiz"
                    words={words}
                    onBack={() => setIsQuizStarted(false)}
                    onComplete={() => setIsQuizStarted(false)}
                  />
                ) : (
                  <QuizLanding 
                    onStart={() => setIsQuizStarted(true)}
                    onBack={() => setActiveTab('home')}
                    totalWords={words.length}
                  />
                )
              ) : activeTab === 'saved' ? (
                <SavedWordsScreen 
                  words={words}
                  toggleSave={toggleSave}
                  onWordClick={(w) => {
                    setSelectedWord(w);
                    setActiveView('learning');
                  }}
                  onExploreClick={() => setActiveTab('home')}
                  onBack={() => setActiveTab('home')}
                />
              ) : (
                <ProfileScreen 
                  streak={streak} 
                  savedCount={words.filter(w => w.isSaved).length} 
                  settings={settings}
                  updateSettings={updateSettings}
                  achievements={achievements}
                  onLogout={handleLogout}
                  onBack={() => setActiveTab('home')}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-3xl rounded-[32px] shadow-2xl shadow-black/10 border border-white p-3 flex justify-around items-center">
          {[
            { id: 'home', icon: Home, label: 'Learn' },
            { id: 'quiz', icon: Brain, label: 'Quiz' },
            { id: 'saved', icon: Bookmark, label: 'Saved' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as Tab);
                  setActiveView('list');
                  if (tab.id !== 'quiz') setIsQuizStarted(false);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-saffron text-white scale-105 shadow-lg shadow-brand-saffron/20' 
                    : 'text-m3-outline hover:bg-black/5'
                }`}
              >
                <Icon size={isActive ? 22 : 20} />
                {isActive && <span className="text-[10px] font-black uppercase tracking-wider">{tab.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
