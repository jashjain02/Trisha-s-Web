/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          baby: '#12030A',
          soft: '#1A050F',
          DEFAULT: '#FF2E93',
          dark: '#FF2E93',
          accent: '#FF2E93',
        },
        blue: {
          powder: '#0A1020',
          DEFAULT: '#38BDF8',
        },
        lavender: {
          soft: '#130E1F',
          DEFAULT: '#A855F7',
        },
        success: '#34D399',
        obsidian: {
          DEFAULT: '#0A0A0C',
          800: '#111115',
          700: '#1A1A22',
          600: '#222230',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '60px',
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
        glass: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        'glass-lg': '0 16px 56px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)',
        card: '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover': '0 8px 40px rgba(255,46,147,0.22), 0 0 0 1px rgba(255,46,147,0.15)',
        glow: '0 0 24px rgba(255,46,147,0.35)',
        'glow-sm': '0 0 12px rgba(255,46,147,0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':
          'radial-gradient(at 30% 20%, rgba(255,46,147,0.06) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(168,85,247,0.04) 0px, transparent 50%), radial-gradient(at 5% 80%, rgba(255,46,147,0.03) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
