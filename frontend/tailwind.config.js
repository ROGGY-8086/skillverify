/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B3A36", // Deep teal from Gusto footer
        accent: "#F25C54", // Coral/Red from hero
        "teal-dark": "#0A2522",
        "warm-50": "#FDFBF7",
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          500: '#64748B',
          800: '#1E293B',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}
