/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Brain, Play, Trophy, Star, Target, ArrowLeft } from 'lucide-react';

interface QuizLandingProps {
  onStart: () => void;
  onBack: () => void;
  totalWords: number;
}

export const QuizLanding: React.FC<QuizLandingProps> = ({ onStart, onBack, totalWords }) => {
  return (
    <div className="space-y-8 pb-10">
      {/* Header with Back */}
      <section className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-3 bg-white border border-black/5 rounded-2xl text-m3-outline hover:text-brand-saffron transition-colors shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Quiz Arena</h2>
          <p className="text-xs font-medium text-m3-outline">Master {totalWords} words through quick challenges</p>
        </div>
      </section>

      <section className="text-center space-y-4 pt-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-brand-saffron/10 rounded-full flex items-center justify-center text-brand-saffron mx-auto"
        >
          <Brain size={64} />
        </motion.div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        {[
          { label: 'Daily Streak', value: '4 Days', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Total Score', value: '1,250', icon: Trophy, color: 'text-brand-green', bg: 'bg-brand-green/5' },
          { label: 'Accuracy', value: '88%', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Completed', value: '12 Quizzes', icon: Brain, color: 'text-brand-saffron', bg: 'bg-brand-saffron/5' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`${stat.bg} p-6 rounded-[32px] border border-black/5 space-y-2`}
          >
            <stat.icon className={stat.color} size={20} />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-m3-outline opacity-60">{stat.label}</p>
              <p className="text-xl font-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="bg-white rounded-[40px] p-8 border border-black/5 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black">Ready for a challenge?</h3>
            <p className="text-sm text-m3-outline font-medium">Test your knowledge on random words from all departments.</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm font-bold text-m3-on-surface bg-brand-green/5 p-3 rounded-2xl">
              <div className="p-1 bg-brand-green text-white rounded-md">
                <Play size={12} fill="currentColor" />
              </div>
              5 Random Questions
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-m3-on-surface bg-brand-saffron/5 p-3 rounded-2xl">
              <div className="p-1 bg-brand-saffron text-white rounded-md">
                <Trophy size={12} />
              </div>
              +50 XP for perfect score
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="w-full bg-brand-saffron text-white py-6 rounded-[28px] font-black text-lg shadow-xl shadow-brand-saffron/20 flex items-center justify-center gap-3"
          >
            Start Quiz Now
            <Play size={20} fill="currentColor" />
          </motion.button>
        </div>
      </section>
    </div>
  );
};
