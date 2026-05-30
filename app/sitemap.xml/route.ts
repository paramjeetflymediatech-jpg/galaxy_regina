import { Seo } from '@/src/lib/models';
import { Op } from 'sequelize';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const host = request.headers.get('host') || 'moversinregina.ca';
    // Use https unless it's localhost
    const protocol = host.includes('localhost') ? 'http:' : 'https:';
    const baseUrl = `${protocol}//${host}`;

    // Standard static pages
    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/about', priority: '0.8', changefreq: 'monthly' },
      { path: '/book-appointment', priority: '0.8', changefreq: 'monthly' },
      { path: '/faqs', priority: '0.8', changefreq: 'weekly' },
      { path: '/house-moving', priority: '0.8', changefreq: 'monthly' },
      { path: '/Insurance', priority: '0.8', changefreq: 'monthly' },
      { path: '/insurance-and-policy-claims', priority: '0.8', changefreq: 'monthly' },
      { path: '/License', priority: '0.8', changefreq: 'monthly' },
      { path: '/licensee', priority: '0.8', changefreq: 'monthly' },
      { path: '/manpower', priority: '0.8', changefreq: 'monthly' },
      { path: '/StorageServices', priority: '0.8', changefreq: 'monthly' },
      { path: '/blogs', priority: '0.8', changefreq: 'weekly' },
    ];

    // Fetch all SEO paths from the database, excluding 'global' and admin paths
    const dbSeos = await Seo.findAll({
      where: {
        page_path: {
          [Op.and]: [
            { [Op.ne]: 'global' },
            { [Op.notLike]: '/admin%' },
            { [Op.notLike]: 'admin%' }
          ]
        }
      },
      attributes: ['page_path', 'updatedAt']
    });

    // We keep track of added paths to prevent duplicates
    const addedPaths = new Set<string>();
    const urls: string[] = [];

    // Add static pages first
    for (const page of staticPages) {
      addedPaths.add(page.path);
      const lastmod = new Date().toISOString();
      urls.push(`  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    }

    // Add dynamic SEO pages from DB
    for (const seo of dbSeos) {
      let path = seo.page_path;
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      
      // Clean up path if it ends with / (except the root which is already handled)
      if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
      }

      if (addedPaths.has(path)) continue;
      addedPaths.add(path);

      const lastmod = seo.updatedAt ? new Date(seo.updatedAt).toISOString() : new Date().toISOString();
      
      // Determine priority and changefreq based on path type
      let priority = '0.6';
      let changefreq = 'weekly';
      if (path.startsWith('/location/')) {
        priority = '0.7';
        changefreq = 'weekly';
      } else if (path.startsWith('/blogs/')) {
        priority = '0.7';
        changefreq = 'weekly';
      }

      urls.push(`  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=600'
      }
    });
  } catch (error: any) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
