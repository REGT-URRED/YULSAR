import baseConfig from '@extension/tailwindcss-config';
import type { Config } from 'tailwindcss/types/config';

export default {
  ...baseConfig,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        progress: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glow-breath': {
          '0%, 100%': { opacity: '0.35', transform: 'scaleX(0.98)' },
          '50%': { opacity: '0.9', transform: 'scaleX(1)' },
        },
        'glow-drift': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        'status-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 6px 2px rgba(179,18,47,0.7)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 2px 0 rgba(179,18,47,0.4)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        progress: 'progress 1.5s infinite ease-in-out',
        'glow-breath': 'glow-breath 2.4s ease-in-out infinite',
        'glow-drift': 'glow-drift 3s linear infinite',
        'status-pulse': 'status-pulse 1.6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.25s ease-out both',
      },
    },
  },
} as Config;
