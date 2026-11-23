import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    // Shown in the list and link previews (LinkedIn/X). One sentence.
    description: z.string().optional(),
    date: z.coerce.date(),
    // Set to 'zh-CN' for Chinese posts so the right CJK glyphs are used.
    lang: z.string().default('en'),
    // Slug of the same post in another language; shows a language switch link and hreflang tags.
    translation: z.string().optional(),
    // Reachable by URL and via the language switch, but left out of the writing list.
    unlisted: z.boolean().default(false),
    // Drafts are hidden from the list and sitemap in production builds.
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
