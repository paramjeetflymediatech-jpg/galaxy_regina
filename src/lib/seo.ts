import { Content } from './models';

interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string;
}

/**
 * Retrieves page-specific SEO metadata from the database.
 * If not found, falls back to the provided defaults.
 * 
 * @param pageName Unique identifier for the page (e.g. 'home', 'about', 'faq')
 * @param defaultTitle Default title tag
 * @param defaultDesc Default meta description tag
 * @returns Metadata object compatible with Next.js page metadata
 */
export async function getSeoMetadata(
  pageName: string,
  defaultTitle: string,
  defaultDesc: string
): Promise<SeoMetadata> {
  try {
    const results = await Content.findAll({
      where: { page: pageName, section: 'seo' },
    });

    const seo = results.reduce((acc: Record<string, string>, item) => {
      acc[item.key] = item.value || '';
      return acc;
    }, {});

    // Note: in admin forms, we save keys as 'title', 'description', and 'keywords'
    return {
      title: seo.title || defaultTitle,
      description: seo.description || defaultDesc,
      keywords: seo.keywords || 'movers, moving services, local movers, Regina movers',
    };
  } catch (error) {
    console.error(`❌ Failed to fetch SEO metadata for page "${pageName}":`, error);
    return {
      title: defaultTitle,
      description: defaultDesc,
      keywords: 'movers, moving services, local movers, Regina movers',
    };
  }
}
