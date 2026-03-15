/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        critical: '#DC2626',
        high: '#EA580C',
        medium: '#D97706',
        low: '#16A34A',
        info: '#2563EB',
        unknown: '#6B7280',
      },
    },
  },
  plugins: [],
}
