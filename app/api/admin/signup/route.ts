import { NextResponse } from 'next/server';
import { Admin } from '@/src/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Name, email, password and confirm password are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ where: { email } });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create the admin record
    await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { success: true, message: 'Admin account created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register admin', error: error.message },
      { status: 500 }
    );
  }
}
