import { NextResponse } from 'next/server';
import { Location } from '@/src/lib/models';

export async function GET() {
  try {
    const locations = await Location.findAll({
      order: [['location_name', 'ASC']],
    });

    return NextResponse.json({
      success: true,
      locations,
    });
  } catch (error: any) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { success: false, message: 'Database error', error: error.message },
      { status: 500 }
    );
  }
}
