import { NextResponse } from 'next/server';
import { Blog } from '@/src/lib/models';
import { saveUploadedFile, deleteUploadedFile } from '@/src/lib/uploadHelper';

type Params = {
  param: string;
};

// GET BLOG BY ID OR SLUG
export async function GET(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { param } = await context.params;

    // Check if param is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(param);
    const blog = await Blog.findOne({
      where: isNumeric ? { id: parseInt(param, 10) } : { slug: param },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE BLOG BY ID
export async function PUT(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { param } = await context.params;
    const id = parseInt(param, 10);

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

    const blog = await Blog.findByPk(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Save image if uploaded
    const image_url = await saveUploadedFile(image, 'blogs');
    if (image_url !== null && blog.image_url) {
      await deleteUploadedFile(blog.image_url);
    }

    await blog.update({
      title,
      slug,
      description: description !== null ? description : blog.description,
      content: content !== null ? content : blog.content,
      category: category !== null ? category : blog.category,
      meta_title: meta_title !== null ? meta_title : blog.meta_title,
      meta_description: meta_description !== null ? meta_description : blog.meta_description,
      image_url: image_url !== null ? image_url : blog.image_url,
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blog post', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE BLOG BY ID
export async function DELETE(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { param } = await context.params;
    const id = parseInt(param, 10);

    const blog = await Blog.findByPk(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    if (blog.image_url) {
      await deleteUploadedFile(blog.image_url);
    }

    await blog.destroy();

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, message: 'Delete failed', error: error.message },
      { status: 500 }
    );
  }
}
