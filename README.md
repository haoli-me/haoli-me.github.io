# haoli-me.github.io

Personal site: writing + about. Built with [Astro](https://astro.build), published to GitHub Pages.

## Add a post

Create `src/content/writing/my-post.md`:

```md
---
title: My post
description: One sentence shown in the list and in link previews.
date: 2026-11-18
lang: zh-CN   # optional; only for Chinese posts
draft: true   # optional; hides it from production
---

Body in Markdown.
```

The filename becomes the URL: `/writing/my-post/`. Push to `master` and the site redeploys.

## Edit pages

- About page: `src/pages/about.astro`
- Name, description, footer links: `src/consts.ts`
- Look and feel: `src/styles/global.css`
- Default link-preview image: `node scripts/make-og.mjs` regenerates `public/og.png`

## Commands

```
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
```

## Moving to a custom domain

1. Change `site` in `astro.config.mjs`.
2. Add `public/CNAME` containing the bare domain.
3. Add the DNS records at the registrar and set the domain in the repo's Pages settings.
