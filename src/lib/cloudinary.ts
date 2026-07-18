import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using the URL format
if (process.env.CLOUDINARY_URL) {
  try {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
      secure: true,
    });
    console.log('Cloudinary configured successfully via CLOUDINARY_URL');
  } catch (error) {
    console.error('Failed to configure Cloudinary via CLOUDINARY_URL:', error);
    // Fallback to manual parsing
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    const match = cloudinaryUrl.match(/cloudinary:\/\/(.+):(.+)@(.+)/);
    
    if (match) {
      const [, apiKey, apiSecret, cloudName] = match;
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      console.log('Cloudinary configured via manual parsing');
    }
  }
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('Cloudinary configured via individual env vars');
}

export async function uploadImage(file: File, folder: string = "ai-shop/products") {
  console.log('Uploading single file:', file.name, 'to folder:', folder);
  console.log('File size:', file.size, 'bytes');
  console.log('File type:', file.type);
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  const dataUrl = `data:${file.type};base64,${base64}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      dataUrl,
      {
        resource_type: "auto",
        folder: folder,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          reject(error);
        } else {
          console.log('Cloudinary upload success:', result?.public_id);
          console.log('Upload result:', JSON.stringify(result, null, 2));
          resolve(result);
        }
      }
    );
  });
}

export async function uploadMultipleImages(files: File[], folder: string = "ai-shop/products") {
  console.log('Uploading multiple files:', files.length, 'to folder:', folder);
  
  try {
    const uploadPromises = files.map((file, index) => 
      uploadImage(file, folder).catch(error => {
        console.error(`Failed to upload file ${index + 1}:`, file.name, error);
        throw error;
      })
    );
    
    const results = await Promise.all(uploadPromises);
    console.log('All uploads completed successfully:', results.length);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export async function deleteMultipleImages(publicIds: string[]) {
  const deletePromises = publicIds.map(id => deleteImage(id));
  return Promise.all(deletePromises);
}

export function getImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  } = {}
) {
  const {
    width = 800,
    height = 800,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options;

  return cloudinary.url(publicId, {
    transformation: [
      { quality, fetch_format: format },
      { width, height, crop },
    ],
  });
}

export function getOptimizedImageUrl(publicId: string, size: "thumbnail" | "medium" | "large" = "medium") {
  const sizes = {
    thumbnail: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
  };

  return getImageUrl(publicId, sizes[size]);
}

export function getResponsiveImageUrl(publicId: string) {
  return {
    thumbnail: getOptimizedImageUrl(publicId, "thumbnail"),
    medium: getOptimizedImageUrl(publicId, "medium"),
    large: getOptimizedImageUrl(publicId, "large"),
  };
}
