import baseConfig from '@quake-map/config/tailwind/base.js';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@quake-map/ui/src/**/*.{html,js,svelte,ts}'
  ]
};