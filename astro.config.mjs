// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://naghdyan.com',
  output: 'static',
  integrations: [react(), sitemap()],
  scopedStyleStrategy: 'class',
  // Canonicals and the sitemap use /path/ — keep links and dev routing in line.
  trailingSlash: 'always',
});
