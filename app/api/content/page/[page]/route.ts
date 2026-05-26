import { NextResponse } from 'next/server';
import { Content } from '@/src/lib/models';

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
