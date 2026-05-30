import { NextResponse } from 'next/server';
import { ServiceLocation, Location, Service, Seo } from '@/src/lib/models';

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
    const { 
      service_id, 
      location_id, 
      content, 
      description, 
      faqs,
      meta_title,
      meta_description,
      meta_keywords,
      canonical_url,
      og_title,
      og_description,
      og_image,
      header_scripts,
      footer_scripts
    } = body;

    const serviceLoc = await ServiceLocation.findByPk(parseInt(id, 10));

    if (!serviceLoc) {
      return NextResponse.json(
        { success: false, message: 'Service Location not found' },
        { status: 404 }
      );
    }

    const oldServiceId = serviceLoc.service_id;
    const oldLocationId = serviceLoc.location_id;

    const newServiceId = service_id ? parseInt(service_id, 10) : oldServiceId;
    const newLocationId = location_id ? parseInt(location_id, 10) : oldLocationId;

    await serviceLoc.update({
      service_id: newServiceId,
      location_id: newLocationId,
      content: content !== undefined ? content : serviceLoc.content,
      description: description !== undefined ? description : serviceLoc.description,
      faqs: faqs !== undefined ? (typeof faqs === 'string' ? faqs : JSON.stringify(faqs || [])) : serviceLoc.faqs
    });

    // Upsert SEO record in the Seo table
    const service = await Service.findByPk(newServiceId);
    const location = await Location.findByPk(newLocationId);
    if (service && location) {
      const page_path = `/location/${service.slug}-in-${location.slug}`;
      const oldService = await Service.findByPk(oldServiceId);
      const oldLocation = await Location.findByPk(oldLocationId);
      const oldPagePath = (oldService && oldLocation) ? `/location/${oldService.slug}-in-${oldLocation.slug}` : null;

      const finalFaqs = faqs !== undefined 
        ? (typeof faqs === 'string' ? faqs : JSON.stringify(faqs || [])) 
        : serviceLoc.faqs || '[]';

      let existingSeo = await Seo.findOne({ where: { page_path } });
      if (!existingSeo && oldPagePath) {
        existingSeo = await Seo.findOne({ where: { page_path: oldPagePath } });
      }

      await Seo.upsert({
        page_path,
        title: meta_title !== undefined ? (meta_title || '') : (existingSeo?.title || ''),
        description: meta_description !== undefined ? (meta_description || '') : (existingSeo?.description || ''),
        keywords: meta_keywords !== undefined ? (meta_keywords || '') : (existingSeo?.keywords || ''),
        canonical_url: canonical_url !== undefined ? (canonical_url || '') : (existingSeo?.canonical_url || ''),
        og_title: og_title !== undefined ? (og_title || '') : (existingSeo?.og_title || ''),
        og_description: og_description !== undefined ? (og_description || '') : (existingSeo?.og_description || ''),
        og_image: og_image !== undefined ? (og_image || '') : (existingSeo?.og_image || ''),
        header_scripts: header_scripts !== undefined ? (header_scripts || '') : (existingSeo?.header_scripts || ''),
        footer_scripts: footer_scripts !== undefined ? (footer_scripts || '') : (existingSeo?.footer_scripts || ''),
        faqs: finalFaqs
      });

      if (oldPagePath && oldPagePath !== page_path) {
        // Delete old SEO record if slug changed
        await Seo.destroy({ where: { page_path: oldPagePath } });
      }
    }

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

    const oldService = await Service.findByPk(serviceLoc.service_id);
    const oldLocation = await Location.findByPk(serviceLoc.location_id);
    const page_path = (oldService && oldLocation) ? `/location/${oldService.slug}-in-${oldLocation.slug}` : null;

    await serviceLoc.destroy();

    if (page_path) {
      await Seo.destroy({ where: { page_path } });
    }

    return NextResponse.json({ success: true, message: 'Service Location deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting service location:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
