import { NextResponse } from 'next/server';
import { Province } from '@/src/lib/models';

export async function GET() {
  try {
    const provinces = await Province.findAll({ order: [['name', 'ASC']] });
    return NextResponse.json({ success: true, provinces });
  } catch (error: any) {
    console.error('Provinces GET Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, message: 'Name and slug are required' }, { status: 400 });
    }

    const province = await Province.create({ name, slug });
    return NextResponse.json({ success: true, province }, { status: 201 });
  } catch (error: any) {
    console.error('Province POST Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
