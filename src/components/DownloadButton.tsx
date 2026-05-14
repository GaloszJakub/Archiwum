import { useState } from 'react';
import { Download, Check, Loader2, AlertCircle } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { extractVoeDirectUrl, downloadFile, DownloadProgress } from '@/services/downloadService';

const A = {
  amber: '#d4a056',
  text: '#f3efe6',
  surface: '#14141a',
  border: 'rgba(255,248,230,0.10)',
  muted: '#847d6f',
};

interface DownloadButtonProps {
  url: string;
  title: string;
  episode?: string;
}

type DownloadState = 'idle' | 'extracting' | 'downloading' | 'done' | 'error';

export const DownloadButton = ({ url, title, episode }: DownloadButtonProps) => {
  const [state, setState] = useState<DownloadState>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const isVoe = url.includes('voe.sx') || url.includes('voe.cx') || url.includes('voesx');

  if (!isVoe) return null; // Only show for VoeSX links

  const handleDownload = async () => {
    if (state === 'downloading' || state === 'extracting') return;

    setState('extracting');
    setError('');

    try {
      console.log('Download started for URL:', url);
      // 1. Extract direct URL
      const directUrl = await extractVoeDirectUrl(url);
      console.log('Direct URL extracted:', directUrl);

      if (!Capacitor.isNativePlatform()) {
        // Web: just open the URL
        window.open(directUrl, '_blank');
        setState('done');
        return;
      }

      // 2. Download file
      setState('downloading');
      console.log('Starting file download...');
      const filename = `${title}${episode ? `_${episode}` : ''}.mp4`.replace(/[^a-zA-Z0-9._-]/g, '_');

      await downloadFile(directUrl, filename, (p: DownloadProgress) => {
        setProgress(p.percent);
      });

      setState('done');
    } catch (err: any) {
      console.error('Download error:', err);
      setError(err.message || 'Błąd pobierania');
      setState('error');
    }
  };

  const getLabel = () => {
    switch (state) {
      case 'extracting': return 'Wyciągam link...';
      case 'downloading': return `${progress}%`;
      case 'done': return 'Pobrano';
      case 'error': return 'Błąd';
      default: return 'Pobierz';
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'extracting':
      case 'downloading':
        return <Loader2 size={14} className="animate-spin" />;
      case 'done':
        return <Check size={14} />;
      case 'error':
        return <AlertCircle size={14} />;
      default:
        return <Download size={14} />;
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={state === 'extracting' || state === 'downloading'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 32,
          padding: '0 12px',
          borderRadius: 6,
          background: state === 'done' ? A.amber : A.surface,
          color: state === 'done' ? '#0a0a0c' : state === 'error' ? '#ff6b6b' : A.text,
          border: `1px solid ${state === 'error' ? '#ff6b6b' : A.border}`,
          fontSize: 12,
          fontWeight: 500,
          fontFamily: '"Inter Tight", sans-serif',
          cursor: state === 'extracting' || state === 'downloading' ? 'wait' : 'pointer',
          opacity: state === 'extracting' || state === 'downloading' ? 0.7 : 1,
        }}
      >
        {getIcon()}
        {getLabel()}
      </button>
      {state === 'error' && error && (
        <div style={{ fontSize: 10, color: '#ff6b6b', marginTop: 4 }}>{error}</div>
      )}
    </div>
  );
};
