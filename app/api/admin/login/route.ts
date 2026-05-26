import { NextResponse } from 'next/server';
import { Admin } from '@/src/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const storedPassword = admin.password;

    // Password verification logic (preserving backward compatibility for plaintext passwords)
    const verifyPassword = async () => {
      if (
        storedPassword.startsWith('$2a$') ||
        storedPassword.startsWith('$2b$') ||
        storedPassword.startsWith('$2y$')
      ) {
        return bcrypt.compare(password, storedPassword);
      }
      return storedPassword === password;
    };

    const isMatch = await verifyPassword();

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Prepare safe admin info without password
    const safeAdmin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: safeAdmin,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: error.message },
      { status: 500 }
    );
  }
}
