/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        nysc: {
          green: '#006633',
          'green-light': '#008744',
          'green-dark': '#004724',
          'green-deep': '#002E17',
          gold: '#F4C430',
          'gold-light': '#FFDF79',
          'gold-dark': '#C69A12',
          khaki: '#C3B091',
        },
        sdg: {
          1: '#E5243B', // No Poverty
          2: '#DDA63A', // Zero Hunger
          3: '#4C9F38', // Good Health
          4: '#C5192D', // Quality Education
          5: '#FF3A21', // Gender Equality
          6: '#26BDE2', // Clean Water
          7: '#FCC30B', // Affordable Energy
          8: '#A21942', // Decent Work
          9: '#FD6925', // Industry & Innovation
          10: '#DD1367', // Reduced Inequalities
          11: '#FD9D24', // Sustainable Cities
          12: '#BF8B2E', // Responsible Consumption
          13: '#3F7E44', // Climate Action
          14: '#0A97D9', // Life Below Water
          15: '#56C02B', // Life on Land
          16: '#00689D', // Peace, Justice
          17: '#19486A', // Partnerships
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
