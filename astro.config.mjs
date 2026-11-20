// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// When moving to a custom domain (e.g. https://haoli.blog), change `site`
// below and add a `public/CNAME` file containing the bare domain.
export default defineConfig({
  site: 'https://haoli-me.github.io',
  integrations: [sitemap()],
});
