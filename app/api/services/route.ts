import { NextResponse } from 'next/server';
import { Service } from '@/src/lib/models';

export async function GET() {
  try {
    const services = await Service.findAll({
      where: { is_active: true },
      order: [['id', 'ASC']]
    });
    
    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ error: 'Failed to load services data' }, { status: 500 });
  }
}
