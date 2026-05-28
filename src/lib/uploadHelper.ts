import { supabase } from './supabase';

/**
 * Saves a File object from a FormData request to the Supabase Storage bucket.
 * @param file The File object to save
 * @param bucket Name of the Supabase storage bucket (defaults to 'uploads')
 * @returns The public URL of the saved file, or null if no file was uploaded
 */
export async function saveUploadedFile(
  file: any,
  bucket: string = 'uploads'
): Promise<string | null> {
  // Check if a valid file was provided
  if (!file || typeof file !== 'object' || !file.name || !file.arrayBuffer) {
    return null;
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename with original extension
    const dotIndex = file.name.lastIndexOf('.');
    const originalExt = dotIndex !== -1 ? file.name.substring(dotIndex) : '';
    const baseName = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
    const sanitizedBase = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${Date.now()}-${sanitizedBase}${originalExt}`;

    // Upload to Supabase Storage Bucket
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('❌ Supabase Upload Error:', error);
      return null;
    }

    // Get the public URL of the uploaded image
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return urlData.publicUrl;
  } catch (error) {
    console.error('❌ Error saving uploaded file to Supabase Storage:', error);
    return null;
  }
}

/**
 * Deletes a file from Supabase Storage bucket based on its public URL or path.
 * @param fileUrlOrPath The public URL or path of the file to delete
 * @param bucket Name of the Supabase storage bucket (defaults to 'uploads')
 * @returns boolean indicating success of the operation
 */
export async function deleteUploadedFile(
  fileUrlOrPath: string | null | undefined,
  bucket: string = 'uploads'
): Promise<boolean> {
  if (!fileUrlOrPath) return false;

  try {
    let filename = fileUrlOrPath;

    // Check if it's a full URL
    if (fileUrlOrPath.startsWith('http://') || fileUrlOrPath.startsWith('https://')) {
      const prefix = `/storage/v1/object/public/${bucket}/`;
      const index = fileUrlOrPath.indexOf(prefix);
      if (index !== -1) {
        filename = fileUrlOrPath.substring(index + prefix.length);
      } else {
        // Fallback: try to extract filename after the last slash if it doesn't match the bucket structure
        const parts = fileUrlOrPath.split('/');
        filename = parts[parts.length - 1];
      }
    } else {
      // If it's a local filename (legacy) rather than a full URL, we don't delete from Supabase.
      console.log(`ℹ️ Skipping delete for local legacy file path: ${fileUrlOrPath}`);
      return false;
    }

    console.log(`🗑️ Deleting file from Supabase Storage: bucket=${bucket}, path=${filename}`);
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filename]);

    if (error) {
      console.error(`❌ Supabase Delete Error for ${filename}:`, error);
      return false;
    }

    console.log(`✅ Successfully deleted ${filename} from Supabase Storage bucket ${bucket}`);
    return true;
  } catch (error) {
    console.error('❌ Error deleting uploaded file from Supabase Storage:', error);
    return false;
  }
}

