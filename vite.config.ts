import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from a GitHub Pages project subpath:
// https://evanisacoder26.github.io/singapore-transport-live-application/
export default defineConfig({
  base: '/singapore-transport-live-application/',
  plugins: [react()],
});
