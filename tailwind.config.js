export default {
  darkMode: ['class'],
  content: ['./client/index.html', './client/src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: '#F7F7F7',
        foreground: '#2D2D2D',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D2D2D',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D2D2D',
        },
        primary: {
          DEFAULT: '#FF4500',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#FFE0CC',
          foreground: '#2D2D2D',
        },
        muted: {
          DEFAULT: '#F0F0F0',
          foreground: '#6B6B6B',
        },
        accent: {
          DEFAULT: '#FFE0CC',
          foreground: '#2D2D2D',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        border: '#E0E0E0',
        input: '#E0E0E0',
        ring: '#FF4500',
        chart: {
          1: '#FF4500',
          2: '#FF6B35',
          3: '#FF8A65',
          4: '#FFAB91',
          5: '#FFCCBC',
        },
      },
      backgroundImage: {
        'gradient-sheesh': 'linear-gradient(135deg, #FF4500 0%, #FF6B35 25%, #FF8A65 50%, #FFAB91 75%, #FFCCBC 100%)',
        'gradient-sheesh-light': 'linear-gradient(135deg, #FFE0CC 0%, #FFF2E8 100%)',
        'gradient-sheesh-hover': 'linear-gradient(135deg, #FF4500 0%, #FF6B35 50%, #FFAB91 100%)',
        'gradient-sheesh-dark': 'linear-gradient(135deg, #E03E00 0%, #D63502 25%, #CC3300 50%, #B82E00 75%, #A32900 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
