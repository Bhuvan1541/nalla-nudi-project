/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 32 }) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative flex items-center justify-center overflow-hidden rounded-full bg-white shadow-xl ${className}`}
      style={{ width: size * 2, height: size * 2 }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-2"
      >
        {/* Background Circle Gradient */}
        <circle cx="50" cy="50" r="48" fill="url(#logo-grad)" />
        
        {/* Open Book Base */}
        <path
          d="M20 70C20 65 35 60 50 65C65 60 80 65 80 70V80C80 75 65 70 50 75C35 70 20 75 20 80V70Z"
          fill="#1B4332"
        />
        <path
          d="M50 65V75"
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />

        {/* Tree Trunk */}
        <path
          d="M50 70C50 60 48 55 50 40"
          stroke="#1B4332"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Leaves / Pages */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          d="M50 45C35 45 25 35 30 25C35 15 50 15 50 25"
          fill="#EE964B"
          fillOpacity="0.2"
          stroke="#EE964B"
          strokeWidth="2"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          d="M50 45C65 45 75 35 70 25C65 15 50 15 50 25"
          fill="#2D6A4F"
          fillOpacity="0.2"
          stroke="#2D6A4F"
          strokeWidth="2"
        />

        {/* Characters */}
        <text
          x="35"
          y="32"
          fill="#EE964B"
          fontSize="12"
          fontWeight="900"
          textAnchor="middle"
          className="font-kannada"
        >
          ಅ
        </text>
        <text
          x="65"
          y="32"
          fill="#2D6A4F"
          fontSize="12"
          fontWeight="900"
          textAnchor="middle"
        >
          A
        </text>

        {/* Decorative Berries/Dots */}
        <circle cx="50" cy="20" r="2" fill="#EE964B" />
        <circle cx="42" cy="18" r="1.5" fill="#2D6A4F" />
        <circle cx="58" cy="18" r="1.5" fill="#2D6A4F" />

        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8F9FA" />
            <stop offset="1" stopColor="#E9ECEF" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

