/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Dark slate
        accent: "#8B5CF6", // Purple glow
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          500: '#64748B',
          800: '#1E293B',
          900: '#0F172A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
