import { NextResponse } from 'next/server';
import { Service } from '@/src/lib/models';

// GET ALL SERVICES
export async function GET() {
  try {
    const services = await Service.findAll({ order: [['createdAt', 'DESC']] });
    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to load services', error: error.message }, { status: 500 });
  }
}

import { saveUploadedFile } from '@/src/lib/uploadHelper';

// CREATE SERVICE
export async function POST(request: Request) {
  try {
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

    let image_url = formData.get('image_url') as string | null;
    if (file) {
      const savedPath = await saveUploadedFile(file);
      if (savedPath) image_url = savedPath;
    }

    const service = await Service.create({
      title,
      slug,
      short_description,
      content,
      icon,
      image_url,
      meta_title,
      meta_description,
      is_active: true,
    });

    return NextResponse.json({ success: true, message: 'Service created successfully', service }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ success: false, message: 'A service with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: 'Failed to create service', error: error.message }, { status: 500 });
  }
}
