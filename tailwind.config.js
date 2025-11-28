/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      display: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
    },
    extend: {
      colors: {
        // Soft primary palette - Lavender/Purple
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Main brand color
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },

        // Soft accent colors
        accent: {
          pink: '#fda4af', // Soft pink
          peach: '#fdba74', // Soft peach/orange
          mint: '#86efac', // Soft mint green
          sky: '#7dd3fc', // Soft sky blue
          lavender: '#c4b5fd', // Soft lavender
        },

        // Income - Vibrant emerald/teal (more eye-catching)
        income: {
          light: '#a7f3d0',
          DEFAULT: '#10b981',  // Vibrant emerald
          dark: '#059669',
          darker: '#047857',
        },

        // Expense - Vibrant coral/salmon (more eye-catching)
        expense: {
          light: '#fecaca',
          DEFAULT: '#f43f5e',  // Vibrant rose/coral
          dark: '#e11d48',
          darker: '#be123c',
        },

        // Neutral - Soft warm grays for light mode
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },

        // Dark mode specific
        dark: {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          card: '#262626',
          border: '#404040',
        },

        // Legacy colors for backward compatibility
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },

      // Custom shadows - softer, more elevation
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 2px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg':
          '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 10px -5px rgba(0, 0, 0, 0.04)',
        'soft-xl':
          '0 20px 50px -12px rgba(0, 0, 0, 0.12), 0 8px 16px -8px rgba(0, 0, 0, 0.08)',
        'glow-primary': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-income': '0 0 20px rgba(16, 185, 129, 0.4)',  // Vibrant emerald glow
        'glow-expense': '0 0 20px rgba(244, 63, 94, 0.4)',  // Vibrant rose glow
      },

      // Extended border radius
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },

      // Custom gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
        'gradient-income': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',  // Vibrant emerald
        'gradient-expense': 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',  // Vibrant rose
        'gradient-soft': 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
        'gradient-radial': 'radial-gradient(circle at top right, var(--tw-gradient-stops))',
      },

      // Animation extensions
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        glow: 'glow 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
