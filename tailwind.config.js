/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FF2E93',
          pinkHover: '#E01A7D',
          pinkLight: '#FFF0F6',
          pinkSubtle: '#FFF5F8',
          teal: '#00B4D8',
          tealDark: '#0096C7',
          tealLight: '#E0F7FA',
          yellow: '#FFB703',
          dark: '#1E293B',
          muted: '#64748B',
          border: '#FCE7F3'
        }
      },
      fontFamily: {
        script: ['"Dancing Script"', 'cursive'],
        sans: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'brand': '0 10px 25px -5px rgba(255, 46, 147, 0.2), 0 8px 10px -6px rgba(255, 46, 147, 0.1)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 30px -4px rgba(255, 46, 147, 0.18)',
      }
    },
  },
  plugins: [],
}
