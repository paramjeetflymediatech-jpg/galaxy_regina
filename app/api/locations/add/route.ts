import { NextResponse } from 'next/server';
import { Location } from '@/src/lib/models';
import { saveUploadedFile } from '@/src/lib/uploadHelper';

const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const location_name = formData.get('location_name') as string;
    const hero_title = formData.get('hero_title') as string | null;
    const hero_subtitle = formData.get('hero_subtitle') as string | null;
    const content = formData.get('content') as string | null;
    const meta_title = formData.get('meta_title') as string | null;
    const meta_description = formData.get('meta_description') as string | null;
    const meta_keywords = formData.get('meta_keywords') as string | null;
    const province_id_str = formData.get('province_id') as string | null;
    const district_id_str = formData.get('district_id') as string | null;
    const image = formData.get('image');

    if (!location_name) {
      return NextResponse.json(
        { success: false, message: 'Location name is required' },
        { status: 400 }
      );
    }

    const slug = createSlug(location_name);
    
    // Save image if uploaded
    const image_url = await saveUploadedFile(image);

    // Replicate ON DUPLICATE KEY UPDATE behavior with explicit find and create/update
    let location = await Location.findOne({ where: { slug } });
    if (location) {
      await location.update({
        location_name,
        hero_title: hero_title !== null ? hero_title : location.hero_title,
        hero_subtitle: hero_subtitle !== null ? hero_subtitle : location.hero_subtitle,
        content: content !== null ? content : location.content,
        meta_title: meta_title !== null ? meta_title : location.meta_title,
        meta_description: meta_description !== null ? meta_description : location.meta_description,
        meta_keywords: meta_keywords !== null ? meta_keywords : location.meta_keywords,
        province_id: province_id_str ? parseInt(province_id_str, 10) : location.province_id,
        district_id: district_id_str ? parseInt(district_id_str, 10) : location.district_id,
        image_url: image_url !== null ? image_url : location.image_url,
      });
    } else {
      location = await Location.create({
        location_name,
        slug,
        hero_title,
        hero_subtitle,
        content,
        meta_title,
        meta_description,
        meta_keywords,
        province_id: province_id_str ? parseInt(province_id_str, 10) : null,
        district_id: district_id_str ? parseInt(district_id_str, 10) : null,
        image_url,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Location added successfully',
      slug,
    });
  } catch (error: any) {
    console.error('Error adding location:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save location', error: error.message },
      { status: 500 }
    );
  }
}
