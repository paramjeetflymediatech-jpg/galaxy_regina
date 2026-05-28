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

// CREATE SERVICE
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, short_description, content, icon, image_url, meta_title, meta_description } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, message: 'Title and slug are required' }, { status: 400 });
    }

    const service = await Service.create({
      title, slug, short_description, content, icon, image_url, meta_title, meta_description, is_active: true,
    });

    return NextResponse.json({ success: true, message: 'Service created successfully', service }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ success: false, message: 'A service with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: 'Failed to create service', error: error.message }, { status: 500 });
  }
}
