import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, WriteFileResult } from '@capacitor/filesystem';

export interface DownloadProgress {
  percent: number;
  downloaded: number;
  total: number;
}

export interface DownloadedFile {
  id: string;
  title: string;
  episode?: string;
  path: string;
  size: number;
  downloadedAt: Date;
}

/**
 * Extract direct video URL from VoeSX embed page
 */
export async function extractVoeDirectUrl(embedUrl: string): Promise<string> {
  // Fetch the embed page HTML
  const response = await fetch(embedUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch VoeSX page: ${response.status}`);
  }

  const html = await response.text();

  // VoeSX stores the HLS/MP4 URL in various patterns:
  // Pattern 1: 'hls': 'https://...m3u8' or mp4
  // Pattern 2: sources: [{src: "https://..."}]
  // Pattern 3: var sources = {"mp4":"https://..."}
  // Pattern 4: window.location.href = 'https://...mp4'

  // Try pattern: 'mp4': 'URL' or "mp4": "URL"
  let match = html.match(/['"]mp4['"]\s*:\s*['"]([^'"]+)['"]/);
  if (match) return match[1];

  // Try pattern: source src="URL" type="video/mp4"
  match = html.match(/source\s+src=['"]([^'"]+)['"]\s+type=['"]video\/mp4['"]/);
  if (match) return match[1];

  // Try pattern: player.src("URL")
  match = html.match(/player\.src\(['"]([^'"]+)['"]\)/);
  if (match) return match[1];

  // Try pattern: var sources = {..., "file":"URL"}
  match = html.match(/['"]file['"]\s*:\s*['"]([^'"]+\.mp4[^'"]*)['"]/);
  if (match) return match[1];

  // Try pattern: https://.../*.mp4 in script
  match = html.match(/(https?:\/\/[^\s'"]+\.mp4[^\s'"]*)/);
  if (match) return match[1];

  // Try HLS pattern: 'hls': 'URL'
  match = html.match(/['"]hls['"]\s*:\s*['"]([^'"]+)['"]/);
  if (match) return match[1];

  // Try any m3u8 URL
  match = html.match(/(https?:\/\/[^\s'"]+\.m3u8[^\s'"]*)/);
  if (match) return match[1];

  throw new Error('Could not extract video URL from VoeSX page');
}

/**
 * Download a file to device storage (Capacitor native only)
 */
export async function downloadFile(
  url: string,
  filename: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<string> {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback: open in new tab
    window.open(url, '_blank');
    throw new Error('Download only available on native platform');
  }

  // Use XMLHttpRequest for progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          percent: Math.round((event.loaded / event.total) * 100),
          downloaded: event.loaded,
          total: event.total,
        });
      }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        try {
          const blob = xhr.response as Blob;
          // Convert blob to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64 = (reader.result as string).split(',')[1];
            
            // Save to filesystem
            const result = await Filesystem.writeFile({
              path: `Archiwum/${filename}`,
              data: base64,
              directory: Directory.Documents,
              recursive: true,
            });

            resolve(result.uri);
          };
          reader.onerror = () => reject(new Error('Failed to read blob'));
          reader.readAsDataURL(blob);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error(`Download failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during download'));
    xhr.send();
  });
}

/**
 * Get list of downloaded files
 */
export async function getDownloadedFiles(): Promise<DownloadedFile[]> {
  if (!Capacitor.isNativePlatform()) return [];

  try {
    const result = await Filesystem.readdir({
      path: 'Archiwum',
      directory: Directory.Documents,
    });

    return result.files
      .filter(f => f.name.endsWith('.mp4') || f.name.endsWith('.mkv'))
      .map(f => ({
        id: f.name,
        title: f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' '),
        path: `Archiwum/${f.name}`,
        size: f.size || 0,
        downloadedAt: new Date(f.mtime || 0),
      }));
  } catch {
    // Directory doesn't exist yet
    return [];
  }
}

/**
 * Delete a downloaded file
 */
export async function deleteDownloadedFile(filename: string): Promise<void> {
  await Filesystem.deleteFile({
    path: `Archiwum/${filename}`,
    directory: Directory.Documents,
  });
}

/**
 * Get file URI for playback
 */
export async function getFileUri(filename: string): Promise<string> {
  const result = await Filesystem.getUri({
    path: `Archiwum/${filename}`,
    directory: Directory.Documents,
  });
  return result.uri;
}
