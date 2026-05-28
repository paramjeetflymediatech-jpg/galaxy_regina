import { NextResponse } from 'next/server';
import { Service } from '@/src/lib/models';

// GET SINGLE
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const service = await Service.findByPk(id);
    if (!service) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// UPDATE
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const service = await Service.findByPk(id);
    if (!service) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    const body = await request.json();
    await service.update(body);
    return NextResponse.json({ success: true, message: 'Service updated successfully', service });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to update service', error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const service = await Service.findByPk(id);
    if (!service) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    await service.destroy();
    return NextResponse.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to delete service', error: error.message }, { status: 500 });
  }
}

// TOGGLE ACTIVE
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const service = await Service.findByPk(id);
    if (!service) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    const { is_active } = await request.json();
    await service.update({ is_active });
    return NextResponse.json({ success: true, message: `Service ${is_active ? 'activated' : 'deactivated'}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
