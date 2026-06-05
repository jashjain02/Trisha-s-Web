/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          baby: '#FFD6E7',
          soft: '#FFECF4',
          DEFAULT: '#FF6B9D',
          dark: '#E91E8C',
        },
        blue: {
          powder: '#D9F2FF',
          DEFAULT: '#90CDF4',
        },
        lavender: {
          soft: '#F2E7FF',
          DEFAULT: '#C084FC',
        },
        success: '#6DDC91',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'float-slow': 'float 8s ease-in-out infinite 1s',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(5deg)' },
          '66%': { transform: 'translateY(-10px) rotate(-3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(255, 107, 157, 0.12)',
        'glass-lg': '0 16px 48px 0 rgba(255, 107, 157, 0.18)',
        card: '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 40px rgba(255, 107, 157, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':
          'radial-gradient(at 40% 20%, #FFD6E7 0px, transparent 50%), radial-gradient(at 80% 0%, #F2E7FF 0px, transparent 50%), radial-gradient(at 0% 50%, #D9F2FF 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
