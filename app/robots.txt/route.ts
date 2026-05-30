export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const host = request.headers.get('host') || 'moversinregina.ca';
    // Use https unless it's localhost
    const protocol = host.includes('localhost') ? 'http:' : 'https:';
    const baseUrl = `${protocol}//${host}`;

    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

    return new Response(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=600'
      }
    });
  } catch (error: any) {
    console.error('Error generating robots.txt:', error);
    return new Response('Error generating robots.txt', { status: 500 });
  }
}
