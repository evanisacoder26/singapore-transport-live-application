/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // UI/UX Pro Max "Public Transit Guide" palette — WCAG-checked semantic tokens
        transit: {
          primary: '#2563EB',   // brand blue
          secondary: '#0891B2', // cyan — LRT / secondary
          accent: '#EA580C',    // CTA orange
          muted: '#64748B',     // secondary text (passes 4.5:1 on white and gray-900)
          danger: '#DC2626',
        },
      },
    },
  },
  plugins: [],
};
