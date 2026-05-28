import { NextResponse } from 'next/server';
import { District, Province } from '@/src/lib/models';

export async function GET() {
  try {
    const districts = await District.findAll({ 
        include: [{ model: Province, as: 'province', attributes: ['name', 'slug'] }],
        order: [['name', 'ASC']] 
    });
    return NextResponse.json({ success: true, districts });
  } catch (error: any) {
    console.error('Districts GET Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, province_id } = body;

    if (!name || !slug || !province_id) {
      return NextResponse.json({ success: false, message: 'Name, slug, and province_id are required' }, { status: 400 });
    }

    const district = await District.create({ name, slug, province_id });
    return NextResponse.json({ success: true, district }, { status: 201 });
  } catch (error: any) {
    console.error('District POST Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
