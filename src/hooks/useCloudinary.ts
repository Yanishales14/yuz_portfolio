/**
 * Cloudinary Upload Utility
 * 
 * Setup:
 * 1. Create a free Cloudinary account at https://cloudinary.com
 * 2. Go to Settings → Upload → Upload Presets
 * 3. Create an "unsigned" upload preset (e.g., "yuz_portfolio")
 * 4. Set your cloud name and upload preset below (or use env vars)
 * 
 * The portfolio owner configures these in the Admin → Settings panel.
 */

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1';

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export function getCloudinaryConfig(): CloudinaryConfig {
  return {
    cloudName: localStorage.getItem('yuz_cloudinary_cloud') || '',
    uploadPreset: localStorage.getItem('yuz_cloudinary_preset') || '',
  };
}

export function setCloudinaryConfig(config: CloudinaryConfig) {
  localStorage.setItem('yuz_cloudinary_cloud', config.cloudName);
  localStorage.setItem('yuz_cloudinary_preset', config.uploadPreset);
}

export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const config = getCloudinaryConfig();

  if (!config.cloudName || !config.uploadPreset) {
    throw new Error('Cloudinary not configured. Go to Admin → Settings to set up your cloud name and upload preset.');
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    // Folder to organize uploads
    formData.append('folder', 'yuz-portfolio');

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error?.message || 'Upload failed'));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

    xhr.open('POST', `${CLOUDINARY_UPLOAD_URL}/${config.cloudName}/auto/upload`);
    xhr.send(formData);
  });
}

export function isCloudinaryConfigured(): boolean {
  const config = getCloudinaryConfig();
  return !!(config.cloudName && config.uploadPreset);
}
