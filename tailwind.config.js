/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    screens: {
      sm: '640px',   // Mobile landscape
      md: '768px',   // Tablet portrait (iPad Mini)
      lg: '1024px',  // Tablet landscape / Desktop
      xl: '1280px',  // Desktop
      '2xl': '1536px', // Large desktop
    },
    fontFamily: {
      sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      display: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    extend: {
      colors: {
        // Monochrome Primary - Pure grayscale with slight warmth
        primary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },

        // Accent - Subtle warm tone for highlights
        accent: {
          warm: '#f5f5f4',
          cool: '#fafafa',
          muted: '#a8a29e',
        },

        // Income - Muted emerald (still functional but less vibrant)
        income: {
          light: '#d1fae5',
          DEFAULT: '#059669',
          dark: '#047857',
          darker: '#065f46',
          muted: '#6ee7b7',
        },

        // Expense - Muted rose (still functional but less vibrant)
        expense: {
          light: '#fecdd3',
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
          darker: '#991b1b',
          muted: '#fda4af',
        },

        // Neutral - Refined grayscale
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },

        // Dark mode specific - Deep blacks
        dark: {
          bg: '#0a0a0a',
          surface: '#141414',
          card: '#1c1c1c',
          border: '#2a2a2a',
          hover: '#333333',
        },

        // Legacy colors for backward compatibility
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
      },

      // Custom shadows - Monochrome focused
      boxShadow: {
        'ux-soft': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'ux-base': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'ux-elevated': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'ux-glow': '0 0 15px rgb(0 0 0 / 0.1)',
        'ux-dark-soft': '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
        'ux-dark-lg': '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      },

      // Extended border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      // Custom gradients - Monochrome focused
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #171717 0%, #262626 100%)',
        'gradient-primary-light': 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
        'gradient-income': 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        'gradient-expense': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #141414 100%)',
        'gradient-light': 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
        'gradient-radial': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
        'gradient-radial-dark': 'radial-gradient(ellipse at top, #1c1c1c 0%, #0a0a0a 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(0, 0, 0, 0.03) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(0, 0, 0, 0.02) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(0, 0, 0, 0.03) 0px, transparent 50%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },

      // Animation extensions
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-up': 'scaleUp 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 30px rgba(0, 0, 0, 0.15)' },
        },
        bounceSoft: {
          '0%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
          '60%': { transform: 'translateY(-3px)' },
          '100%': { transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },

      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },

      // Z-index scale
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },

      // Transition timing functions
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      // Letter spacing
      letterSpacing: {
        'tighter': '-0.05em',
        'tightest': '-0.075em',
      },
    },
  },
  plugins: [],
}
