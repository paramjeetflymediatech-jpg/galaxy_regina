import { NextResponse } from 'next/server';
import { ServiceLocation, Location, Service } from '@/src/lib/models';

// GET ALL SERVICE LOCATIONS WITH THEIR LOCATIONS AND SERVICES
export async function GET() {
  try {
    const serviceLocations = await ServiceLocation.findAll({
      include: [
        { model: Location, attributes: ['id', 'location_name'] },
        { model: Service, attributes: ['id', 'title'] }
      ],
      order: [['id', 'DESC']]
    });
    
    return NextResponse.json({ success: true, serviceLocations });
  } catch (error: any) {
    console.error('Error fetching service locations:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// CREATE A NEW SERVICE LOCATION
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { service_id, location_id, content, description, faqs } = body;

    if (!service_id || !location_id) {
      return NextResponse.json(
        { success: false, message: 'Service and Location are required' },
        { status: 400 }
      );
    }

    // Check if duplicate mapping exists
    const existing = await ServiceLocation.findOne({
      where: {
        service_id: parseInt(service_id, 10),
        location_id: parseInt(location_id, 10)
      }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'This Service Location mapping already exists.' },
        { status: 400 }
      );
    }

    const newServiceLocation = await ServiceLocation.create({
      service_id: parseInt(service_id, 10),
      location_id: parseInt(location_id, 10),
      content: content || '',
      description: description || '',
      faqs: typeof faqs === 'string' ? faqs : JSON.stringify(faqs || [])
    });

    return NextResponse.json({ success: true, serviceLocation: newServiceLocation });
  } catch (error: any) {
    console.error('Error creating service location:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
