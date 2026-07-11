import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections — the data Sveltia CMS edits (public/admin/config.yml
 * maps 1:1 onto these). Every visible string is bilingual: { en, ru }.
 * Files live as YAML under src/content/<collection>/<id>.yaml, and the file
 * name becomes the entry id (books use it as the /books/<id> route).
 */
const bilingual = z.object({ en: z.string(), ru: z.string() });

const books = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/books' }),
  schema: z.object({
    order: z.number().default(0),
    title: bilingual,
    subtitle: bilingual.optional(),
    year: z.coerce.string(),
    cover: z.string().optional(),
    images: z.array(z.string()).default([]),
    facts: z.array(bilingual).default([]),
    buyLink: z.string().default(''),
    description: z.array(bilingual).default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/articles' }),
  schema: z.object({
    order: z.number().default(0),
    title: bilingual,
    source: bilingual.optional(),
    date: z.coerce.string(),
    url: z.string().default('#'),
  }),
});

const lectures = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/lectures' }),
  schema: z.object({
    order: z.number().default(0),
    title: bilingual,
    description: bilingual.optional(),
    tag: bilingual.optional(),
    video: z.object({
      type: z.enum(['youtube', 'vimeo']),
      id: z.string(),
    }),
  }),
});

export const collections = { books, articles, lectures };
