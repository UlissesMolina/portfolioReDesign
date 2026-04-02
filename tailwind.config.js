/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: 'var(--accent, #c62d42)',
          light: 'var(--accent-light, #e8556b)',
          dark: '#8f2436',
        },
        surface: {
          bg: 'rgb(var(--surface-bg) / <alpha-value>)',
          inset: 'rgb(var(--surface-inset) / <alpha-value>)',
          card: 'rgb(var(--surface-card) / <alpha-value>)',
          border: 'rgb(var(--surface-border) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          dim: 'rgb(var(--ink-dim) / <alpha-value>)',
        },
      },
      backgroundImage: {
        'grid-subtle': 'linear-gradient(rgba(198,45,66,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(198,45,66,0.045) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
    },
  },
  plugins: [],
}
