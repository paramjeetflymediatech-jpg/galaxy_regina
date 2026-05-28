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

import { saveUploadedFile, deleteUploadedFile } from '@/src/lib/uploadHelper';

// UPDATE
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const service = await Service.findByPk(id);
    if (!service) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const short_description = formData.get('short_description') as string | null;
    const content = formData.get('content') as string | null;
    const icon = formData.get('icon') as string | null;
    const meta_title = formData.get('meta_title') as string | null;
    const meta_description = formData.get('meta_description') as string | null;
    const file = formData.get('image');

    if (!title || !slug) {
      return NextResponse.json({ success: false, message: 'Title and slug are required' }, { status: 400 });
    }

    let image_url = service.image_url;
    if (file) {
      const savedPath = await saveUploadedFile(file, 'services');
      if (savedPath) {
        if (service.image_url) {
          await deleteUploadedFile(service.image_url);
        }
        image_url = savedPath;
      }
    }

    await service.update({
      title,
      slug,
      short_description,
      content,
      icon,
      image_url,
      meta_title,
      meta_description,
    });

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
    
    if (service.image_url) {
      await deleteUploadedFile(service.image_url);
    }
    
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
