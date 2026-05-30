import { NextResponse } from 'next/server';
import { Content, Seo } from '@/src/lib/models';

type Params = {
  page: string;
};

export async function GET(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { page } = await context.params;

    if (!page) {
      return NextResponse.json(
        { success: false, message: 'Page name is required' },
        { status: 400 }
      );
    }

    // Retrieve global scripts from Seo table instead of Content table
    if (page === 'global') {
      const seoRecord = await Seo.findOne({ where: { page_path: 'global' } });
      return NextResponse.json({
        success: true,
        page,
        content: {
          scripts: {
            header: seoRecord?.header_scripts || '',
            footer: seoRecord?.footer_scripts || '',
          }
        }
      });
    }

    // Mapped page path in Seo table
    const pagePathMap: Record<string, string> = {
      'home': '/',
      'about': '/about',
      'faq': '/faqs',
      'blogs': '/blogs',
      'house-moving': '/house-moving',
      'manpower': '/manpower',
      'storage-services': '/StorageServices',
      'insurance': '/Insurance',
      'license': '/License',
      'licensee': '/licensee',
      'insurance-policy-claims': '/insurance-and-policy-claims'
    };

    const page_path = pagePathMap[page];
    let seoRecord = null;
    if (page_path) {
      seoRecord = await Seo.findOne({ where: { page_path } });
    }

    // Retrieve all content rows matching the page name
    const results = await Content.findAll({
      where: { page },
    });

    // Reduce the list of rows into an object nested by section and key
    const content = results.reduce((acc: any, item) => {
      if (!acc[item.section]) {
        acc[item.section] = {};
      }
      acc[item.section][item.key] = item.value;
      return acc;
    }, {});

    // Ensure seo section is populated with data from the Seo table if it exists
    if (seoRecord) {
      if (!content.seo) {
        content.seo = {};
      }
      content.seo.title = seoRecord.title || content.seo.title || '';
      content.seo.description = seoRecord.description || content.seo.description || '';
      content.seo.keywords = seoRecord.keywords || content.seo.keywords || '';
      content.seo.faqs = seoRecord.faqs || '[]';
    }

    return NextResponse.json({
      success: true,
      page,
      content,
    });
  } catch (error: any) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load page content', error: error.message },
      { status: 500 }
    );
  }
}
