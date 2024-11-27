/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors:{
          'primary-color': '#201E43',
          'secondary-color': '#134B70',
          'text-color': '#28A745',
          'bg-color': '#F9FAFB'
      }
    },
  },
  plugins: [],
}

