/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, UserPlus, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../components/Logo';

interface LoginScreenProps {
  onLogin: (email: string, name: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('devas@gmail.com');
  const [name, setName] = useState('Devas');
  const [password, setPassword] = useState('enter');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup
    onLogin(email.toLowerCase(), name);
  };

  return (
    <div className="min-h-screen bg-brand-warm-surface flex flex-col p-8 items-center justify-center">
      {/* Logo Section */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 text-center"
      >
        <div className="w-32 h-32 mx-auto mb-6">
          <Logo className="w-full h-full" size={48} />
        </div>
        <h1 className="text-4xl font-black text-m3-on-surface tracking-tight mb-2">Nalla Nudi</h1>
        <p className="text-m3-outline font-bold text-sm uppercase tracking-[0.2em]">Master your Language</p>
      </motion.div>

      {/* Main Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm bg-white rounded-[40px] p-10 shadow-2xl shadow-black/5 border border-white"
      >
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-brand-saffron shadow-sm' : 'text-m3-outline'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-brand-saffron shadow-sm' : 'text-m3-outline'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-m3-outline uppercase tracking-widest ml-4">Full Name</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-m3-outline" size={18} />
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Devas"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-saffron focus:bg-white outline-none font-bold text-sm transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-m3-outline uppercase tracking-widest ml-4">Gmail Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-m3-outline" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="devas@gmail.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-saffron focus:bg-white outline-none font-bold text-sm transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-m3-outline uppercase tracking-widest ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-m3-outline" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-brand-saffron focus:bg-white outline-none font-bold text-sm transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-m3-outline hover:text-m3-on-surface"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-[10px] font-black text-brand-saffron uppercase tracking-widest hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-brand-saffron text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-brand-saffron/30 flex items-center justify-center gap-2 group"
          >
            {isLogin ? 'Login Now' : 'Create Account'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>
      </motion.div>

      {/* Social Login Hint */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-[10px] font-black text-m3-outline uppercase tracking-widest text-center max-w-[200px]"
      >
        By continuing, you agree to our Terms of Service and Privacy Policy
      </motion.p>
    </div>
  );
};
