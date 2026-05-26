import { NextResponse } from 'next/server';
import { Quote } from '@/src/lib/models';

type Params = {
  id: string;
};

export async function PUT(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status is required' },
        { status: 400 }
      );
    }

    const quote = await Quote.findByPk(id);

    if (!quote) {
      return NextResponse.json(
        { success: false, message: 'Quote not found' },
        { status: 404 }
      );
    }

    await quote.update({ status });

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating quote status:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
