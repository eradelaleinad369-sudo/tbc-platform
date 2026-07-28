/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#04162E',
          light: '#0A2748',
        },
        brand: {
          orange: '#FC700E',
          green: '#63A15A',
        },
      },
      fontFamily: {
        display: ['"Archivo Black"', 'Arial Black', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        draw: {
          to: { strokeDashoffset: 0 },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 20s linear infinite',
        float: 'float 5s ease-in-out infinite',
        draw: 'draw 2.5s ease-out forwards',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        blink: 'blink 1s step-start infinite',
      },
    },
  },
  plugins: [],
}
