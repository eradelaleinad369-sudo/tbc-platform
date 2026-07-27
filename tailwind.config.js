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
      },
    },
  },
  plugins: [],
}
