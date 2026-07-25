/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc',
          900: '#0f172a',
        },
        indigo: {
          500: '#6366f1',
          600: '#4f46e5',
        },
        emerald: {
          500: '#10b981',
        },
        amber: {
          500: '#f59e0b',
        },
        rose: {
          500: '#f43f5e',
        }
      },
    },
  },
  plugins: [],
}