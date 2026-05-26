import { NextResponse } from 'next/server';
import { Blog } from '@/src/lib/models';

export async function GET() {
  try {
    const blogs = await Blog.findAll({
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({
      success: true,
      blogs,
    });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: error.message },
      { status: 500 }
    );
  }
}
