import { NextResponse } from 'next/server';
import { Content, Seo } from '@/src/lib/models';

type Params = {
  page: string;
  section: string;
};

export async function PUT(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { page, section } = await context.params;
    const body = await request.json();

    if (!page || !section) {
      return NextResponse.json(
        { success: false, message: 'Page and section are required' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Update payload is required' },
        { status: 400 }
      );
    }

    // Save global scripts in the Seo table instead of Content table
    if (page === 'global' && section === 'scripts') {
      const { header, footer } = body;
      await Seo.upsert({
        page_path: 'global',
        header_scripts: header || '',
        footer_scripts: footer || '',
      });

      return NextResponse.json({
        success: true,
        message: 'Global scripts updated successfully in Seo table',
      });
    }

    // Map dictionary key-values into database rows
    const rows = Object.entries(body).map(([key, value]) => ({
      page,
      section,
      key,
      value: value !== null && value !== undefined ? String(value) : null,
    }));

    // Perform bulk create with Postgres ON CONFLICT DO UPDATE
    const result = await Content.bulkCreate(rows, {
      updateOnDuplicate: ['value'],
      conflictAttributes: ['page', 'section', 'key'], // Required for PostgreSQL
    });

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      updated: result.length,
    });
  } catch (error: any) {
    console.error('Error updating page content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save content', error: error.message },
      { status: 500 }
    );
  }
}
