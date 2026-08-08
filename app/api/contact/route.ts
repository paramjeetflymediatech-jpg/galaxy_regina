import { NextResponse } from 'next/server';
import { sendContactNotificationEmail } from '@/src/lib/nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name || body.full_name;
    const email = body.email;
    const mobile = body.mobile || body.phone;
    const message = body.message || body.comments;

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    // Send email notification to dynamic recipients
    const result = await sendContactNotificationEmail({
      name,
      email,
      mobile,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Contact message submitted successfully!',
        emailSent: result.success,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in contact API route:', error);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: error.message },
      { status: 500 }
    );
  }
}
