import { NextResponse } from 'next/server';
import { District, Location } from '@/src/lib/models';

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name, slug, province_id } = body;

    const district = await District.findByPk(id);
    if (!district) {
      return NextResponse.json({ success: false, message: 'District not found' }, { status: 404 });
    }

    await district.update({ name, slug, province_id });
    return NextResponse.json({ success: true, district });
  } catch (error: any) {
    console.error('District PUT Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const district = await District.findByPk(id);
    if (!district) {
      return NextResponse.json({ success: false, message: 'District not found' }, { status: 404 });
    }

    // Manually unlink associated locations to avoid foreign key constraint errors
    await Location.update({ district_id: null }, { where: { district_id: id } });

    await district.destroy();
    return NextResponse.json({ success: true, message: 'District deleted' });
  } catch (error: any) {
    console.error('District DELETE Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
