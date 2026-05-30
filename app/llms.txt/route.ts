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
- [Blog Directory](${baseUrl}/blogs): Latest news, moving tips, and checklist resources.
- [Location](${baseUrl}/location): Locations served by Galaxy Movers Regina, offering specialized moving services.
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
