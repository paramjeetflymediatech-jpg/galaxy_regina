import { NextResponse } from 'next/server';
import { Quote } from '@/src/lib/models';

export async function GET() {
  try {
    const quotes = await Quote.findAll({
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({
      success: true,
      data: quotes,
    });
  } catch (error: any) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
