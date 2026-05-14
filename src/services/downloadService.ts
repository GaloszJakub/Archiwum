import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

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
  let html: string;

  if (Capacitor.isNativePlatform()) {
    // Native: use CapacitorHttp (no CORS)
    const response = await CapacitorHttp.get({
      url: embedUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://voe.sx/',
      },
    });
    html = response.data;
  } else {
    // Web: regular fetch (will fail due to CORS)
    const response = await fetch(embedUrl);
    html = await response.text();
  }

  if (!html || html.length < 100) {
    throw new Error('Empty response from VoeSX');
  }

  console.log('VoeSX HTML length:', html.length);
  console.log('VoeSX first 1000:', html.substring(0, 1000));

  // VoeSX patterns to find video URL:
  
  // Pattern: 'mp4': 'URL' or "mp4": "URL"
  let match = html.match(/['"]mp4['"]\s*:\s*['"]([^'"]+)['"]/);
  if (match) return match[1];

  // Pattern: source src="URL" type="video/mp4"
  match = html.match(/source\s+src=['"]([^'"]+)['"]\s+type=['"]video\/mp4['"]/);
  if (match) return match[1];

  // Pattern: var sources = {..., "file":"URL"}
  match = html.match(/['"]file['"]\s*:\s*['"]([^'"]+\.mp4[^'"]*)['"]/);
  if (match) return match[1];

  // Pattern: any https mp4 URL in script
  match = html.match(/(https?:\/\/[^\s'"]+\.mp4[^\s'"]*)/);
  if (match) return match[1];

  // Pattern: 'hls': 'URL'
  match = html.match(/['"]hls['"]\s*:\s*['"]([^'"]+)['"]/);
  if (match) return match[1];

  // Pattern: any m3u8 URL
  match = html.match(/(https?:\/\/[^\s'"]+\.m3u8[^\s'"]*)/);
  if (match) return match[1];

  console.log('VoeSX HTML length:', html.length, 'First 500 chars:', html.substring(0, 500));
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
    window.open(url, '_blank');
    throw new Error('Download only available on native platform');
  }

  // Use Capacitor Filesystem download
  const result = await Filesystem.downloadFile({
    url: url,
    path: `Archiwum/${filename}`,
    directory: Directory.Documents,
    recursive: true,
  });

  return result.path || `Archiwum/${filename}`;
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
