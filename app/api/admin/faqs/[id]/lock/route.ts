import { NextResponse } from 'next/server';
import { Faq } from '@/src/lib/models';

type Params = {
  id: string;
};

// LOCK / UNLOCK FAQ
export async function PATCH(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { locked } = body;

    if (typeof locked === 'undefined') {
      return NextResponse.json(
        { success: false, message: 'Locked value is required' },
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

    await faq.update({ locked: !!locked });

    return NextResponse.json({
      success: true,
      message: `FAQ has been ${locked ? 'locked' : 'unlocked'} successfully`,
    });
  } catch (error: any) {
    console.error('Error locking/unlocking FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update FAQ lock state', error: error.message },
      { status: 500 }
    );
  }
}
