import { NextResponse } from 'next/server';
import { ServiceLocation } from '@/src/lib/models';

type Params = {
  id: string;
};

// UPDATE AN EXISTING SERVICE LOCATION BY ID
export async function PUT(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { service_id, location_id, content, description, faqs } = body;

    const serviceLoc = await ServiceLocation.findByPk(parseInt(id, 10));

    if (!serviceLoc) {
      return NextResponse.json(
        { success: false, message: 'Service Location not found' },
        { status: 404 }
      );
    }

    await serviceLoc.update({
      service_id: service_id ? parseInt(service_id, 10) : serviceLoc.service_id,
      location_id: location_id ? parseInt(location_id, 10) : serviceLoc.location_id,
      content: content !== undefined ? content : serviceLoc.content,
      description: description !== undefined ? description : serviceLoc.description,
      faqs: faqs !== undefined ? (typeof faqs === 'string' ? faqs : JSON.stringify(faqs || [])) : serviceLoc.faqs
    });

    return NextResponse.json({ success: true, message: 'Service Location updated successfully' });
  } catch (error: any) {
    console.error('Error updating service location:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE A SERVICE LOCATION BY ID
export async function DELETE(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const serviceLoc = await ServiceLocation.findByPk(parseInt(id, 10));

    if (!serviceLoc) {
      return NextResponse.json(
        { success: false, message: 'Service Location not found' },
        { status: 404 }
      );
    }

    await serviceLoc.destroy();

    return NextResponse.json({ success: true, message: 'Service Location deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting service location:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
