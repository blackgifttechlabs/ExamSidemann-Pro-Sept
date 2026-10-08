import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        nunito: ['"Nunito"', 'sans-serif'],
      },
      colors: {
        navy: { 800: '#121212', 900: '#000000', 950: '#000000' },
        orange: { DEFAULT: '#7C3AED', 500: '#8B5CF6', 600: '#7C3AED' },
        android: { green: '#3DDC84', blue: '#4285F4' },
        card: '#171717',
        'sidebar-card': '#353535',
        premium: '#f7b91c',
      },
      animation: {
        'dropdown-reveal': 'dropdownReveal 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        'slide-in-left': 'slideInLeft 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        marquee: 'marquee 120s linear infinite',
        'marquee-reverse': 'marquee-reverse 120s linear infinite',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' } },
        'marquee-reverse': { '0%': { transform: 'translateX(-50%)' }, '100%': { transform: 'translateX(0%)' } },
        dropdownReveal: {
          '0%': { opacity: '0', transform: 'translateY(-30px) scale(0.9) rotateX(-10deg)', filter: 'blur(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1) rotateX(0)', filter: 'blur(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.5)' },
        },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        slideInLeft: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [forms, typography, aspectRatio],
};
