import { NextResponse } from 'next/server';
import { Faq } from '@/src/lib/models';

export async function GET() {
  try {
    // Fetch all public (unlocked) FAQs sorted by creation date descending
    const faqs = await Faq.findAll({
      where: { locked: false },
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({
      success: true,
      faqs,
    });
  } catch (error: any) {
    console.error('Error fetching public FAQs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load FAQs', error: error.message },
      { status: 500 }
    );
  }
}
