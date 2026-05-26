import { NextResponse } from 'next/server';
import { Faq } from '@/src/lib/models';

type Params = {
  id: string;
};

// GET FAQ BY ID
export async function GET(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const faq = await Faq.findByPk(id);

    if (!faq) {
      return NextResponse.json(
        { success: false, message: 'FAQ not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      faq,
    });
  } catch (error: any) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load FAQ', error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE FAQ
export async function PUT(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { question, answer } = body;

    if (!question && !answer) {
      return NextResponse.json(
        { success: false, message: 'Question or answer must be provided to update' },
        { status: 400 }
      );
    }

    const faq = await Faq.findByPk(id);

    if (!faq) {
      return NextResponse.json(
        { success: false, message: 'FAQ not found' },
        { status: 404 }
      );
    }

    const updateFields: any = {};
    if (question !== undefined) updateFields.question = question;
    if (answer !== undefined) updateFields.answer = answer;

    await faq.update(updateFields);

    return NextResponse.json({
      success: true,
      message: 'FAQ updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update FAQ', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE FAQ
export async function DELETE(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const faq = await Faq.findByPk(id);

    if (!faq) {
      return NextResponse.json(
        { success: false, message: 'FAQ not found' },
        { status: 404 }
      );
    }

    await faq.destroy();

    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete FAQ', error: error.message },
      { status: 500 }
    );
  }
}
