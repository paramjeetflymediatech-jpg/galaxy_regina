import { Seo } from '@/src/lib/models';
import { Op } from 'sequelize';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const host = request.headers.get('host') || 'moversinregina.ca';
    const protocol = host.includes('localhost') ? 'http:' : 'https:';
    const baseUrl = `${protocol}//${host}`;

    // Fetch dynamic location paths to include in the llms.txt index
    const locationSeos = await Seo.findAll({
      where: {
        page_path: {
          [Op.like]: '/location/%'
        }
      },
      attributes: ['page_path', 'title', 'description'],
      order: [['page_path', 'ASC']]
    });

    // Fetch blog paths
    const blogSeos = await Seo.findAll({
      where: {
        page_path: {
          [Op.like]: '/blogs/%'
        }
      },
      attributes: ['page_path', 'title', 'description'],
      order: [['page_path', 'ASC']]
    });

    let markdown = `# Galaxy Movers Regina - LLM Directory

> Galaxy Movers Regina is a professional moving company providing local, long-distance, residential, commercial, packing, and secure storage services in Regina and across Saskatchewan.

## Main Services & Info

- [Home Page](${baseUrl}/): Main entry point for Galaxy Movers Regina, featuring a quick booking form and list of services.
- [About Us](${baseUrl}/about): Information about the company history, our professional moving team, and credentials.
- [Book Appointment](${baseUrl}/book-appointment): Dynamic moving quote and reservation request form.
- [FAQs](${baseUrl}/faqs): Answers to frequently asked questions about rates, insurance, scheduling, and packing.
- [House Moving](${baseUrl}/house-moving): Details about our specialized residential house moving services.
- [Storage Services](${baseUrl}/StorageServices): Information on secure short-term and long-term storage facilities.
- [Insurance Info](${baseUrl}/Insurance): Details on moving insurance options, coverage levels, and transit protection.
- [Insurance & Policy Claims](${baseUrl}/insurance-and-policy-claims): Policy terms, claim forms, and submission instructions.
- [License Info](${baseUrl}/License): Licensing details, regulatory compliance, and operating authority.
- [Licensee Registration](${baseUrl}/licensee): Application form for licensing partners and subcontractors.
- [Manpower Services](${baseUrl}/manpower): Loading, unloading, and labor-only moving help.
- [Blog Directory](${baseUrl}/blogs): Latest news, moving tips, and checklist resources.

`;

    if (locationSeos.length > 0) {
      markdown += `## Service Locations (${locationSeos.length} areas served)

Below is the directory of all targeted service locations across Saskatchewan, offering specialized moving services.

`;
      for (const seo of locationSeos) {
        const title = seo.title || 'Moving Services';
        const desc = seo.description || 'Professional moving services.';
        markdown += `- [${title}](${baseUrl}${seo.page_path}): ${desc}\n`;
      }
      markdown += '\n';
    }

    if (blogSeos.length > 0) {
      markdown += `## Blog Posts

Latest insights and professional moving guides.

`;
      for (const seo of blogSeos) {
        const title = seo.title || 'Blog Post';
        const desc = seo.description || 'Read our moving advice.';
        markdown += `- [${title}](${baseUrl}${seo.page_path}): ${desc}\n`;
      }
      markdown += '\n';
    }

    return new Response(markdown, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=600'
      }
    });
  } catch (error: any) {
    console.error('Error generating llms.txt:', error);
    return new Response('Error generating llms.txt', { status: 500 });
  }
}
