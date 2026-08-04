/**
 * schema.org nodes. The site's whole SEO case rests on a name search
 * ("Ruben Naghdyan", "Рубен Нагдян", "naghdyan ruben"), so the Person node is
 * the important one: it declares the name variants and transliterations Google
 * can't infer, and `sameAs` ties this domain to the same person's profiles
 * elsewhere. Books and articles reference the Person by @id rather than
 * repeating it, so the graph stays connected across pages.
 */

const SITE = 'https://naghdyan.com';

/** Stable @id so Book/Article nodes on other pages point at the same Person. */
export const PERSON_ID = `${SITE}/#person`;

type SiteSeo = {
  seo: { title: string; description: string; image: string; sameAs: string[] };
  portrait?: string;
};

export function personNode(site: SiteSeo) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Ruben Naghdyan',
    // Cyrillic and Armenian spellings, plus the transliterations people
    // actually type. Without these, a search in one script has nothing to
    // match a page whose title is in another.
    alternateName: [
      'Рубен Нагдян',
      'Ռուբեն Նաղդյան',
      'Ruben Nagdyan',
      'Ruben Naghdian',
      'Naghdyan Ruben',
      'Нагдян Рубен',
    ],
    jobTitle: ['Scientist', 'Psychologist'],
    description: site.seo.description,
    url: SITE,
    image: new URL(site.portrait || site.seo.image, SITE).href,
    knowsAbout: [
      'Psychoontology',
      'Психоонтология',
      'Neuro-Linguistic Programming',
      'Emotional-Image Therapy',
      'Transcendental psychology',
      'Philosophy of mind',
    ],
    ...(site.seo.sameAs.length ? { sameAs: site.seo.sameAs } : {}),
  };
}

export function websiteNode(site: SiteSeo) {
  return {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: 'Ruben Naghdyan',
    description: site.seo.description,
    inLanguage: ['ru', 'en', 'hy'],
    about: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  };
}

/** Wraps nodes in the @graph envelope Google prefers for multi-node pages. */
export function graph(nodes: Record<string, unknown>[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
