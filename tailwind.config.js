/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Team colors
        seahawks: {
          navy: '#002244',
          green: '#69BE28',
          grey: '#A5ACAF',
        },
        patriots: {
          navy: '#002244',
          red: '#C60C30',
          silver: '#B0B7BC',
        },
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { textShadow: '0 0 20px rgba(249, 115, 22, 0.5)' },
          '50%': { textShadow: '0 0 40px rgba(249, 115, 22, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
