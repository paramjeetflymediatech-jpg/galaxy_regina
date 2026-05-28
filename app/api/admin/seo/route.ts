import { NextResponse } from 'next/server';
import { Seo } from '@/src/lib/models';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page_path, title, description, keywords, canonical_url, og_title, og_description, og_image, header_scripts, footer_scripts } = body;

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
