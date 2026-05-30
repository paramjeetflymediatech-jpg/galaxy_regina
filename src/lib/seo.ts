import { Seo } from './models';

interface SeoMetadata {
  title: string;
  description: string;
  keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  header_scripts: string;
  footer_scripts: string;
  faqs: string;
  faqSchema: any;
}

/**
 * Retrieves page-specific SEO metadata and FAQ schema from the database.
 * If not found, falls back to the provided defaults.
 * 
 * @param pageName Unique identifier or path for the page (e.g. 'home', 'about', '/blogs')
 * @param defaultTitle Default title tag
 * @param defaultDesc Default meta description tag
 * @returns Metadata object compatible with Next.js page layout / manual rendering
 */
export async function getSeoMetadata(
  pageName: string,
  defaultTitle: string = 'Galaxy Movers Regina | Trusted Local Moving Company',
  defaultDesc: string = 'Professional moving and storage services in Regina, Saskatchewan. Get a free quote today!'
): Promise<SeoMetadata> {
  try {
    // Normalize pageName (e.g., 'home' or '' -> '/')
    let normalizedPath = pageName || '/';
    if (normalizedPath === 'home') {
      normalizedPath = '/';
    } else if (normalizedPath !== '/' && !normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath;
    }

    const seoRecord = await Seo.findOne({
      where: { page_path: normalizedPath }
    });

    const title = seoRecord?.title || defaultTitle;
    const description = seoRecord?.description || defaultDesc;
    const keywords = seoRecord?.keywords || 'movers, moving services, local movers, Regina movers';
    const canonical_url = seoRecord?.canonical_url || '';
    const og_title = seoRecord?.og_title || title;
    const og_description = seoRecord?.og_description || description;
    const og_image = seoRecord?.og_image || '';
    const header_scripts = seoRecord?.header_scripts || '';
    const footer_scripts = seoRecord?.footer_scripts || '';
    const faqs = seoRecord?.faqs || '[]';

    // Build FAQ Schema JSON-LD
    let faqSchema = null;
    if (faqs) {
      try {
        const parsedFaqs = typeof faqs === 'string' ? JSON.parse(faqs) : faqs;
        if (Array.isArray(parsedFaqs) && parsedFaqs.length > 0) {
          faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": parsedFaqs.map(faq => ({
              "@type": "Question",
              "name": faq.q || faq.question || '',
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a || faq.answer || ''
              }
            }))
          };
        }
      } catch (e) {
        console.error("❌ Failed to parse FAQs for schema generation in getSeoMetadata:", e);
      }
    }

    return {
      title,
      description,
      keywords,
      canonical_url,
      og_title,
      og_description,
      og_image,
      header_scripts,
      footer_scripts,
      faqs,
      faqSchema
    };
  } catch (error) {
    console.error(`❌ Failed to fetch SEO metadata for page "${pageName}":`, error);
    return {
      title: defaultTitle,
      description: defaultDesc,
      keywords: 'movers, moving services, local movers, Regina movers',
      canonical_url: '',
      og_title: defaultTitle,
      og_description: defaultDesc,
      og_image: '',
      header_scripts: '',
      footer_scripts: '',
      faqs: '[]',
      faqSchema: null
    };
  }
}
