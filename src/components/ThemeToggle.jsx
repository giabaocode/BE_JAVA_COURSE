import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../lib/theme.js'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-ink-200 bg-ink-100/40 text-ink-700 hover:text-brand-600 hover:border-brand-600/50 transition-all duration-200 overflow-hidden group"
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}
      >
        <Moon className="w-4 h-4" />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        <Sun className="w-4 h-4" />
      </span>
      <span
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: '0 0 18px -4px rgb(var(--brand-600) / 0.55)' }}
      />
    </button>
  )
}
