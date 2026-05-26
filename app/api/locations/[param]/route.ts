import { NextResponse } from 'next/server';
import { Location } from '@/src/lib/models';
import { saveUploadedFile } from '@/src/lib/uploadHelper';

type Params = {
  param: string;
};

const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

// GET LOCATION BY ID OR SLUG
export async function GET(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { param } = await context.params;

    // Check if the param is a numeric ID or a string slug
    const isNumeric = /^\d+$/.test(param);
    const location = await Location.findOne({
      where: isNumeric ? { id: parseInt(param, 10) } : { slug: param },
    });

    if (!location) {
      return NextResponse.json(
        { success: false, message: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      location,
    });
  } catch (error: any) {
    console.error('Error fetching location:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE LOCATION BY ID
export async function PUT(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { param } = await context.params;
    const id = parseInt(param, 10);

    const formData = await request.formData();
    const location_name = formData.get('location_name') as string;
    const hero_title = formData.get('hero_title') as string | null;
    const hero_subtitle = formData.get('hero_subtitle') as string | null;
    const content = formData.get('content') as string | null;
    const meta_title = formData.get('meta_title') as string | null;
    const meta_description = formData.get('meta_description') as string | null;
    const meta_keywords = formData.get('meta_keywords') as string | null;
    const image = formData.get('image');

    if (!location_name) {
      return NextResponse.json(
        { success: false, message: 'Location name is required' },
        { status: 400 }
      );
    }

    const location = await Location.findByPk(id);

    if (!location) {
      return NextResponse.json(
        { success: false, message: 'Location not found' },
        { status: 404 }
      );
    }

    const slug = createSlug(location_name);
    
    // Save image if uploaded
    const image_url = await saveUploadedFile(image);

    await location.update({
      location_name,
      slug,
      hero_title: hero_title !== null ? hero_title : location.hero_title,
      hero_subtitle: hero_subtitle !== null ? hero_subtitle : location.hero_subtitle,
      content: content !== null ? content : location.content,
      meta_title: meta_title !== null ? meta_title : location.meta_title,
      meta_description: meta_description !== null ? meta_description : location.meta_description,
      meta_keywords: meta_keywords !== null ? meta_keywords : location.meta_keywords,
      image_url: image_url !== null ? image_url : location.image_url,
    });

    return NextResponse.json({
      success: true,
      message: 'Location updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update location', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE LOCATION BY ID
export async function DELETE(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { param } = await context.params;
    const id = parseInt(param, 10);

    const location = await Location.findByPk(id);

    if (!location) {
      return NextResponse.json(
        { success: false, message: 'Location not found' },
        { status: 404 }
      );
    }

    await location.destroy();

    return NextResponse.json({
      success: true,
      message: 'Location deleted',
    });
  } catch (error: any) {
    console.error('Error deleting location:', error);
    return NextResponse.json(
      { success: false, message: 'Delete failed', error: error.message },
      { status: 500 }
    );
  }
}
