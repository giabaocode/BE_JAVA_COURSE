/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette uses CSS variables so the same Tailwind classes flip
        // between dark (default) and light themes. See :root and
        // [data-theme="light"] in src/index.css for the values.
        brand: {
          50:  'rgb(var(--brand-50)  / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
        },
        ink: {
          50:  'rgb(var(--ink-50)  / <alpha-value>)',
          100: 'rgb(var(--ink-100) / <alpha-value>)',
          200: 'rgb(var(--ink-200) / <alpha-value>)',
          300: 'rgb(var(--ink-300) / <alpha-value>)',
          400: 'rgb(var(--ink-400) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
        },
        neon: {
          cyan:    '#00e5ff',
          magenta: '#ff2bd6',
          purple:  '#a855f7',
          lime:    '#aaff2b',
          amber:   '#ffb000'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['Orbitron', 'Inter', 'ui-sans-serif', 'sans-serif']
      },
      boxShadow: {
        'soft':         '0 1px 2px 0 rgb(0 0 0 / 0.4)',
        'card':         '0 12px 32px -12px rgb(0 0 0 / 0.7)',
        'glow':         '0 0 22px -4px rgb(var(--glow-color) / 0.55)',
        'glow-sm':      '0 0 12px -2px rgb(var(--glow-color) / 0.5)',
        'glow-magenta': '0 0 22px -4px rgb(255 43 214 / 0.5)',
        'glow-purple':  '0 0 22px -4px rgb(168 85 247 / 0.5)',
        'glow-emerald': '0 0 22px -4px rgb(16 185 129 / 0.5)',
        'glow-rose':    '0 0 22px -4px rgb(244 63 94 / 0.5)'
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 16px -6px rgb(var(--glow-color) / 0.5)' },
          '50%':      { boxShadow: '0 0 26px -2px rgb(var(--glow-color) / 0.85)' }
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '92%':      { opacity: '1' },
          '94%':      { opacity: '0.6' },
          '96%':      { opacity: '1' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' }
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.2' },
          '50%':      { opacity: '1' }
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' }
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'bounce-in': {
          '0%':   { transform: 'scale(0.3)', opacity: '0' },
          '50%':  { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-up': {
          '0%':   { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fire-flicker': {
          '0%, 100%': { transform: 'scale(1) rotate(-2deg)', filter: 'brightness(1)' },
          '25%':      { transform: 'scale(1.06) rotate(2deg)', filter: 'brightness(1.15)' },
          '50%':      { transform: 'scale(0.98) rotate(-1deg)', filter: 'brightness(1)' },
          '75%':      { transform: 'scale(1.03) rotate(1deg)', filter: 'brightness(1.1)' }
        }
      },
      animation: {
        'glow-pulse':     'glow-pulse 2.4s ease-in-out infinite',
        'flicker':        'flicker 4s linear infinite',
        'float-slow':     'float-slow 5s ease-in-out infinite',
        'twinkle':        'twinkle 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'shimmer':        'shimmer 2.4s linear infinite',
        'bounce-in':      'bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-up':       'slide-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fire-flicker':   'fire-flicker 1.2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
