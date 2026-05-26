import { NextResponse } from 'next/server';
import { Quote } from '@/src/lib/models';

type Params = {
  id: string;
};

export async function DELETE(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const quote = await Quote.findByPk(id);

    if (!quote) {
      return NextResponse.json(
        { success: false, message: 'Quote not found' },
        { status: 404 }
      );
    }

    await quote.destroy();

    return NextResponse.json({
      success: true,
      message: 'Quote deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting quote:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
