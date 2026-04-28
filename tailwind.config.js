/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#003366",
        secondary: "#00BFFF",
        background: "#F0FBFF",
      },
      fontFamily: {
        title: ['Bangers', 'cursive'],
        body: ['Fredoka One', 'cursive'],
        ui: ['Nunito', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      }
    },
  },
  plugins: [],
}
