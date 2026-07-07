/**
 * Cloudinary Upload Utility
 * 
 * Setup:
 * 1. Create a free Cloudinary account at https://cloudinary.com
 * 2. Go to Settings → Upload → Upload Presets
 * 3. Create an "unsigned" upload preset (e.g., "yuz_portfolio")
 * 4. Set your cloud name and upload preset in Admin → Settings
 * 
 * Free tier: 25 GB storage, 25 GB bandwidth/month
 */

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1';

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

const CONFIG_KEYS = {
  cloudName: 'yuz_cloudinary_cloud',
  uploadPreset: 'yuz_cloudinary_preset',
};

export function getCloudinaryConfig(): CloudinaryConfig {
  return {
    cloudName: localStorage.getItem(CONFIG_KEYS.cloudName) || '',
    uploadPreset: localStorage.getItem(CONFIG_KEYS.uploadPreset) || '',
  };
}

export function setCloudinaryConfig(config: CloudinaryConfig) {
  localStorage.setItem(CONFIG_KEYS.cloudName, config.cloudName);
  localStorage.setItem(CONFIG_KEYS.uploadPreset, config.uploadPreset);
}

export function isCloudinaryConfigured(): boolean {
  const config = getCloudinaryConfig();
  return !!(config.cloudName && config.uploadPreset);
}

export interface UploadResult {
  url: string;           // Original upload URL
  thumbnailUrl: string;  // Auto-generated thumbnail URL
  duration: number;      // Duration in seconds (for videos)
  format: string;
  resourceType: 'image' | 'video';
}

export async function uploadToCloudinary(
  file: File,
  options?: {
    onProgress?: (percent: number) => void;
    resourceType?: 'auto' | 'image' | 'video';
  }
): Promise<UploadResult> {
  const config = getCloudinaryConfig();

  if (!config.cloudName || !config.uploadPreset) {
    throw new Error('Cloudinary not configured. Go to Admin → Settings to set up your cloud name and upload preset.');
  }

  const resourceType = options?.resourceType || 'auto';

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    formData.append('folder', 'yuz-portfolio');

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && options?.onProgress) {
        options.onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        
        const publicId = response.public_id;
        const format = response.format;
        const resourceTypeResult = response.resource_type;
        const duration = response.duration || 0;

        // Build thumbnail URL
        let thumbnailUrl = response.secure_url;
        if (resourceTypeResult === 'video') {
          // Cloudinary auto-generates thumbnails for videos
          thumbnailUrl = `https://res.cloudinary.com/${config.cloudName}/video/upload/so_0,w_800,h_450,c_fill/${publicId}.${format === 'mp4' ? 'jpg' : format}`;
        } else {
          // For images, create a smaller version
          thumbnailUrl = `https://res.cloudinary.com/${config.cloudName}/image/upload/w_800,h_450,c_fill/${publicId}.${format}`;
        }

        resolve({
          url: response.secure_url,
          thumbnailUrl,
          duration,
          format: response.format,
          resourceType: resourceTypeResult,
        });
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

    xhr.open('POST', `${CLOUDINARY_UPLOAD_URL}/${config.cloudName}/${resourceType}/upload`);
    xhr.send(formData);
  });
}

/**
 * Upload a thumbnail image for a project
 */
export async function uploadThumbnail(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const result = await uploadToCloudinary(file, {
    onProgress,
    resourceType: 'image',
  });
  return result.thumbnailUrl;
}

/**
 * Format seconds to mm:ss or h:mm:ss
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Extract thumbnail from a video file using canvas
 */
export function extractVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadeddata = () => {
      // Seek to 1 second or 25% of duration
      video.currentTime = Math.min(1, video.duration * 0.25);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(url);
      resolve(thumbnailDataUrl);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load video for thumbnail extraction'));
    };
  });
}

/**
 * Get video duration from a file
 */
export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load video metadata'));
    };
  });
}
