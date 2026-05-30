import { NextResponse } from 'next/server';
import { Seo } from '@/src/lib/models';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || '/';

    let seo = await Seo.findOne({
      where: { page_path: path },
      attributes: ['faqs']
    });

    // Fallback to home page if no FAQs found on the requested path
    if ((!seo || !seo.faqs || seo.faqs === '[]' || JSON.parse(seo.faqs).length === 0) && path !== '/') {
      seo = await Seo.findOne({
        where: { page_path: '/' },
        attributes: ['faqs']
      });
    }

    if (!seo || !seo.faqs) {
      return NextResponse.json({ success: true, faqs: [] });
    }

    let rawFaqs = [];
    try {
      rawFaqs = typeof seo.faqs === 'string' ? JSON.parse(seo.faqs) : seo.faqs;
    } catch (e) {
      rawFaqs = [];
    }

    const faqs = (Array.isArray(rawFaqs) ? rawFaqs : []).map((faq: any, index: number) => ({
      id: faq.id || index,
      question: faq.question || faq.q || '',
      answer: faq.answer || faq.a || '',
      q: faq.q || faq.question || '',
      a: faq.a || faq.answer || ''
    }));

    return NextResponse.json({ success: true, faqs });
  } catch (error: any) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
