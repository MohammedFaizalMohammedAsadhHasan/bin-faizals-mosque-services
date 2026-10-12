/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#021a19',
          900: '#042f2e',
          800: '#064e3b',
          700: '#0f766e',
          600: '#0d9488',
          500: '#14b8a6',
        },
        royal: {
          950: '#060d1f',
          900: '#0c1e3d',
          800: '#153268',
          700: '#1d4ed8',
          600: '#2563eb',
          500: '#3b82f6',
          400: '#60a5fa',
          300: '#93c5fd',
          200: '#bfdbfe',
          100: '#dbeafe',
        },
        sapphire: {
          950: '#040d1a',
          900: '#0b2545',
          800: '#134074',
          700: '#0284c7',
          600: '#0ea5e9',
          500: '#38bdf8',
          400: '#7dd3fc',
          300: '#bae6fd',
        },
        gold: {
          600: '#1d4ed8',
          500: '#2563eb',
          400: '#38bdf8',
          300: '#7dd3fc',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        arabic: ['Readex Pro', 'Amiri', 'serif'],
      },
    },
  },
  plugins: [],
};
