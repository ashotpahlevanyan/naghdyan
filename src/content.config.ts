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

/** Global branding, contact, and SEO — a single settings/site.yaml. */
const site = defineCollection({
  loader: glob({ pattern: 'site.yaml', base: './src/content/settings' }),
  schema: z.object({
    brand: bilingual,
    logo: z.string().default(''),
    favicon: z.string().default(''),
    portrait: z.string().default(''),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }),
    contact: z.object({
      email: z.string().default(''),
      telegram: z.string().default(''),
    }),
    footer: z.object({
      rights: bilingual,
    }),
  }),
});

/** Homepage section copy — a single settings/home.yaml. */
const home = defineCollection({
  loader: glob({ pattern: 'home.yaml', base: './src/content/settings' }),
  schema: z.object({
    hero: z.object({
      eyebrow: bilingual,
      lede: bilingual,
      tags: z.array(bilingual).default([]),
      ctaPrimary: bilingual,
      ctaSecondary: bilingual,
    }),
    about: z.object({
      kicker: bilingual,
      heading: bilingual,
      body: z.array(bilingual).default([]),
    }),
    focus: z.object({
      kicker: bilingual,
      heading: bilingual,
      cards: z
        .array(
          z.object({
            icon: z.string(),
            sub: bilingual,
            title: bilingual,
            body: bilingual,
          }),
        )
        .default([]),
    }),
    psychoontology: z.object({
      kicker: bilingual,
      heading: bilingual,
      intro: bilingual,
      quote: bilingual,
      points: z.array(bilingual).default([]),
    }),
    contact: z.object({
      kicker: bilingual,
      heading: bilingual,
      body: bilingual,
    }),
  }),
});

export const collections = { books, articles, lectures, site, home };
