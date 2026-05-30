import { Seo } from './models';

interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string;
  alternates?: {
    canonical?: string;
  };
  openGraph?: {
    title?: string;
    description?: string;
    images?: Array<{ url: string }>;
  };
}

/**
 * Retrieves page-specific SEO metadata from the database.
 * If not found, falls back to the provided defaults.
 * 
 * @param pageName Unique identifier or path for the page (e.g. 'home', 'about', '/blogs')
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
    // Normalize pageName (e.g., 'home' or '' -> '/')
    let normalizedPath = pageName;
    if (normalizedPath === 'home' || normalizedPath === '') {
      normalizedPath = '/';
    } else if (!normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath;
    }

    const seoRecord = await Seo.findOne({
      where: { page_path: normalizedPath }
    });

    if (seoRecord) {
      return {
        title: seoRecord.title || defaultTitle,
        description: seoRecord.description || defaultDesc,
        keywords: seoRecord.keywords || 'movers, moving services, local movers, Regina movers',
        alternates: seoRecord.canonical_url ? { canonical: seoRecord.canonical_url } : undefined,
        openGraph: {
          title: seoRecord.og_title || seoRecord.title || defaultTitle,
          description: seoRecord.og_description || seoRecord.description || defaultDesc,
          images: seoRecord.og_image ? [{ url: seoRecord.og_image }] : undefined,
        }
      };
    }
  } catch (error) {
    console.error(`❌ Failed to fetch SEO metadata for page "${pageName}":`, error);
  }

  // Fallback to defaults
  return {
    title: defaultTitle,
    description: defaultDesc,
    keywords: 'movers, moving services, local movers, Regina movers',
  };
}

