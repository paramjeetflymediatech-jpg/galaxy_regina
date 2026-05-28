import { NextResponse } from 'next/server';
import { Province, District, Location } from '@/src/lib/models';

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name, slug } = body;

    const province = await Province.findByPk(id);
    if (!province) {
      return NextResponse.json({ success: false, message: 'Province not found' }, { status: 404 });
    }

    await province.update({ name, slug });
    return NextResponse.json({ success: true, province });
  } catch (error: any) {
    console.error('Province PUT Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const province = await Province.findByPk(id);
    if (!province) {
      return NextResponse.json({ success: false, message: 'Province not found' }, { status: 404 });
    }

    // Unlink locations and cascade delete districts manually to avoid foreign key restrict errors
    await Location.update({ province_id: null }, { where: { province_id: id } });
    await District.destroy({ where: { province_id: id } });

    await province.destroy();
    return NextResponse.json({ success: true, message: 'Province deleted' });
  } catch (error: any) {
    console.error('Province DELETE Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
