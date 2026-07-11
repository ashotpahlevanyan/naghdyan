import { getEntry } from 'astro:content';

/** Global branding + contact settings (src/content/settings/site.yaml). */
export async function getSite() {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('Missing content: src/content/settings/site.yaml');
  return entry.data;
}

/** Homepage section copy (src/content/settings/home.yaml). */
export async function getHome() {
  const entry = await getEntry('home', 'home');
  if (!entry) throw new Error('Missing content: src/content/settings/home.yaml');
  return entry.data;
}
