import type { Config } from 'tailwindcss/types/config';

export default {
  theme: {
    extend: {
      colors: {
        onyx: {
          DEFAULT: '#16141A',
          50: '#E8E6EA',
          100: '#C4C1C9',
          200: '#A09BA7',
          300: '#7C7685',
          400: '#575262',
          500: '#37333D',
          600: '#221F28',
          700: '#1C1921',
          800: '#16141A',
          900: '#0E0C11',
        },
        bone: {
          DEFAULT: '#F4F0E6',
          50: '#FDFCF8',
          100: '#F8F5EE',
          200: '#F4F0E6',
          300: '#D8D2C4',
          400: '#B8B09C',
          500: '#9A9078',
          600: '#7A705C',
          700: '#5A5242',
          800: '#3C3630',
          900: '#24201C',
        },
        crimson: {
          DEFAULT: '#B3122F',
          50: '#FDECEF',
          100: '#FAC5CC',
          200: '#F5919F',
          300: '#EB5D72',
          400: '#D63850',
          500: '#B3122F',
          600: '#8F0E25',
          700: '#6B0A1C',
          800: '#4D0814',
          900: '#33050D',
        },
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
