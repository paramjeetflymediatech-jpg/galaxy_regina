import { NextResponse } from 'next/server';
import { Quote } from '@/src/lib/models';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      full_name,
      email,
      mobile,
      move_type,
      pickup_address,
      dropoff_address,
      moving_date,
      comments,
    } = body;

    if (!full_name) {
      return NextResponse.json(
        { success: false, message: 'Full name is required' },
        { status: 400 }
      );
    }

    const newQuote = await Quote.create({
      full_name,
      email,
      mobile,
      move_type,
      pickup_address,
      dropoff_address,
      moving_date,
      comments,
      status: 'pending',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Quote submitted successfully!',
        id: newQuote.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting quote:', error);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: error.message },
      { status: 500 }
    );
  }
}
