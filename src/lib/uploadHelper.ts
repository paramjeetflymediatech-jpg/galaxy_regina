import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Saves a File object from a FormData request to the public/uploads directory.
 * @param file The File object to save
 * @param folder Subfolder under public directory (defaults to 'uploads')
 * @returns The unique filename of the saved file, or null if no file was uploaded
 */
export async function saveUploadedFile(
  file: any,
  folder: string = 'uploads'
): Promise<string | null> {
  // Check if a valid file was provided
  if (!file || typeof file !== 'object' || !file.name || !file.arrayBuffer) {
    return null;
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define storage path in Next.js public directory
    const uploadDir = path.join(process.cwd(), 'public', folder);

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename with original extension
    const originalExt = path.extname(file.name);
    const sanitizedBase = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${Date.now()}-${sanitizedBase}${originalExt}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to filesystem
    await writeFile(filePath, buffer);
    return filename;
  } catch (error) {
    console.error('❌ Error saving uploaded file:', error);
    return null;
  }
}
