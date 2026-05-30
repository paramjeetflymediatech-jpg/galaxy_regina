import { NextResponse } from 'next/server';
import { Blog, Seo } from '@/src/lib/models';
import { saveUploadedFile } from '@/src/lib/uploadHelper';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string | null;
    const content = formData.get('content') as string | null;
    const category = formData.get('category') as string | null;
    const meta_title = formData.get('meta_title') as string | null;
    const meta_description = formData.get('meta_description') as string | null;
    const image = formData.get('image');

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, message: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Save image if uploaded
    const image_url = await saveUploadedFile(image, 'blogs');

    await Blog.create({
      title,
      slug,
      description,
      content,
      category,
      image_url,
      meta_title,
      meta_description,
    });

    // Also upsert in the Seo table
    await Seo.upsert({
      page_path: `/blogs/${slug}`,
      title: meta_title || title || '',
      description: meta_description || description || '',
      keywords: '',
      canonical_url: '',
      og_title: title || '',
      og_description: description || '',
      og_image: image_url || '',
      header_scripts: '',
      footer_scripts: '',
      faqs: '[]'
    });

    return NextResponse.json({
      success: true,
      message: 'Blog Added Successfully',
    });
  } catch (error: any) {
    console.error('Error adding blog:', error);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: error.message },
      { status: 500 }
    );
  }
}
