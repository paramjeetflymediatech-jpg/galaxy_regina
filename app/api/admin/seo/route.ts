import { NextResponse } from 'next/server';
import { Seo } from '@/src/lib/models';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page_path, title, description, keywords, canonical_url, og_title, og_description, og_image, header_scripts, footer_scripts, faqs } = body;

    if (!page_path) {
      return NextResponse.json(
        { success: false, message: 'page_path is required' },
        { status: 400 }
      );
    }

    const payload = {
      page_path,
      title,
      description,
      keywords,
      canonical_url,
      og_title,
      og_description,
      og_image,
      header_scripts,
      footer_scripts,
      faqs: faqs ? (typeof faqs === 'string' ? faqs : JSON.stringify(faqs)) : '[]',
    };

    const [seo, created] = await Seo.upsert(payload, { returning: true });

    return NextResponse.json({
      success: true,
      message: created ? 'SEO created successfully' : 'SEO updated successfully',
      seo,
    });
  } catch (error: any) {
    console.error('Error saving SEO:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save SEO', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page_path = url.searchParams.get('page_path');

    if (!page_path) {
      const seos = await Seo.findAll({ order: [['page_path', 'ASC']] });
      return NextResponse.json({
        success: true,
        seos,
      });
    }

    const seo = await Seo.findOne({ where: { page_path } });

    return NextResponse.json({
      success: true,
      seo,
    });
  } catch (error: any) {
    console.error('Error fetching SEO:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const page_path = url.searchParams.get('page_path');

    if (!page_path) {
      return NextResponse.json(
        { success: false, message: 'page_path parameter is required' },
        { status: 400 }
      );
    }

    const deletedCount = await Seo.destroy({ where: { page_path } });

    return NextResponse.json({
      success: true,
      message: deletedCount > 0 ? 'SEO deleted successfully' : 'SEO not found',
    });
  } catch (error: any) {
    console.error('Error deleting SEO:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}


