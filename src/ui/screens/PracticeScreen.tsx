/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, ChevronLeft, CheckCircle2, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { WordEntry } from '../../model/Word';

interface PracticeScreenProps {
  word: WordEntry;
  onBack: () => void;
  onPlayAudio: (text: string) => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  word,
  onBack,
  onPlayAudio
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none');
  const [attempts, setAttempts] = useState(0);

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setFeedback('none');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript.toLowerCase();
      setTranscript(result);
      setAttempts(prev => prev + 1);

      // Simple fuzzy match
      const target = word.englishWord.toLowerCase();
      if (result.includes(target) || target.includes(result)) {
        setFeedback('success');
      } else {
        setFeedback('error');
      }
    };

    recognition.start();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-8 pb-10"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm border border-black/5 active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-black">Pronunciation</h2>
          <p className="text-xs font-bold text-m3-outline uppercase tracking-widest">Speaking Practice</p>
        </div>
      </div>

      {/* Word Focus Area */}
      <div className="bg-white rounded-[40px] p-10 text-center shadow-sm border border-black/5 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-saffron">Try Saying</p>
          <h3 className="text-5xl font-black text-m3-on-surface tracking-tight">{word.englishWord}</h3>
          <p className="text-xl font-black font-kannada text-m3-outline opacity-60">{word.kannadaMeaning.split(' (')[0]}</p>
        </div>

        <button 
          onClick={() => onPlayAudio(word.englishWord)}
          className="mx-auto flex items-center gap-3 bg-brand-saffron/10 text-brand-saffron px-6 py-3 rounded-full font-black hover:bg-brand-saffron hover:text-white transition-all active:scale-95"
        >
          <Volume2 size={20} /> Listen to Guide
        </button>
      </div>

      {/* Speaking Interaction */}
      <div className="flex flex-col items-center gap-8 py-4">
        <div className="relative">
          <AnimatePresence>
            {isListening && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.2 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-0 bg-brand-saffron rounded-full"
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </AnimatePresence>
          
          <button 
            onClick={isListening ? () => {} : startListening}
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all relative z-10 ${
              isListening ? 'bg-m3-on-surface text-white' : 'bg-brand-saffron text-white shadow-brand-saffron/30 hover:scale-105 active:scale-95'
            }`}
          >
            {isListening ? <MicOff size={48} /> : <Mic size={48} />}
          </button>
        </div>

        <div className="text-center space-y-4 w-full">
          {!transcript && !isListening && (
            <p className="text-m3-outline font-bold animate-pulse italic">Tap the mic and speak clearly</p>
          )}

          {isListening && (
            <p className="text-brand-saffron font-black text-lg tracking-widest uppercase animate-bounce">Listening...</p>
          )}

          {transcript && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-[32px] border-2 transition-all ${
                feedback === 'success' 
                  ? 'bg-brand-green/5 border-brand-green/20' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {feedback === 'success' ? (
                  <CheckCircle2 size={20} className="text-brand-green" />
                ) : (
                  <AlertCircle size={20} className="text-red-500" />
                )}
                <span className={`text-xs font-black uppercase tracking-widest ${feedback === 'success' ? 'text-brand-green' : 'text-red-500'}`}>
                  {feedback === 'success' ? 'Perfect Match!' : 'Try Again'}
                </span>
              </div>
              <p className="text-2xl font-black">"{transcript}"</p>
            </motion.div>
          )}
        </div>
      </div>

      {feedback === 'success' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-green text-white p-8 rounded-[32px] flex items-center justify-between shadow-xl shadow-brand-green/20"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl"><Sparkles size={24} /></div>
            <div>
              <p className="font-black text-lg">Great Job!</p>
              <p className="text-xs opacity-80">You're sounding more natural.</p>
            </div>
          </div>
          <button onClick={onBack} className="bg-white text-brand-green px-6 py-3 rounded-xl font-black shadow-sm">
            Next Word
          </button>
        </motion.div>
      )}

      {feedback === 'error' && (
        <button onClick={startListening} className="btn-primary w-full flex items-center justify-center gap-2">
          <RotateCcw size={20} /> Retry Pronunciation
        </button>
      )}
    </motion.div>
  );
};
