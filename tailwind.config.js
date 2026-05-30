/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neon cyan — primary accent. Low shades are dark cyan tints so that
        // `bg-brand-50/100` (used for active/hover states) read correctly on a
        // dark surface, while high shades glow bright.
        brand: {
          50:  '#06141b',
          100: '#0a2630',
          200: '#0e3a49',
          300: '#0e7490',
          400: '#22d3ee',
          500: '#0fd8f5',
          600: '#00e5ff',
          700: '#5eecff',
          800: '#9af2ff',
          900: '#cdf8ff'
        },
        // Slate scale — INVERTED vs. a light theme so that existing semantic
        // usage flips to dark mode automatically: ink-50 = darkest background,
        // ink-900 = brightest text.
        ink: {
          50:  '#0a0a12',
          100: '#13131f',
          200: '#262640',
          300: '#3a3a5c',
          400: '#6b6b90',
          500: '#8a8ab2',
          600: '#a8a8cc',
          700: '#c9c9e6',
          800: '#e4e4f6',
          900: '#f5f5ff'
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
        'glow':         '0 0 22px -4px rgb(0 229 255 / 0.55)',
        'glow-sm':      '0 0 12px -2px rgb(0 229 255 / 0.5)',
        'glow-magenta': '0 0 22px -4px rgb(255 43 214 / 0.5)',
        'glow-purple':  '0 0 22px -4px rgb(168 85 247 / 0.5)',
        'glow-emerald': '0 0 22px -4px rgb(16 185 129 / 0.5)',
        'glow-rose':    '0 0 22px -4px rgb(244 63 94 / 0.5)'
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 16px -6px rgb(0 229 255 / 0.5)' },
          '50%':      { boxShadow: '0 0 26px -2px rgb(0 229 255 / 0.85)' }
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '92%':      { opacity: '1' },
          '94%':      { opacity: '0.6' },
          '96%':      { opacity: '1' }
        }
      },
      animation: {
        'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
        'flicker': 'flicker 4s linear infinite'
      }
    },
  },
  plugins: [],
}
