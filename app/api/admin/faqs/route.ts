import { NextResponse } from 'next/server';
import { Faq } from '@/src/lib/models';

// GET ALL FAQs (including locked ones)
export async function GET() {
  try {
    const faqs = await Faq.findAll({
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({
      success: true,
      faqs,
    });
  } catch (error: any) {
    console.error('Error fetching admin FAQs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load FAQs', error: error.message },
      { status: 500 }
    );
  }
}

// CREATE FAQ
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, message: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const newFaq = await Faq.create({
      question,
      answer,
      locked: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'FAQ created successfully',
        faqId: newFaq.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create FAQ', error: error.message },
      { status: 500 }
    );
  }
}
