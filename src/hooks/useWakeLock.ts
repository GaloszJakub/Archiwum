import { useEffect, useRef, useCallback } from 'react';

export const useWakeLock = (enabled: boolean) => {
    const wakeLock = useRef<WakeLockSentinel | null>(null);

    const requestWakeLock = useCallback(async () => {
        if (!('wakeLock' in navigator)) return;

        try {
            wakeLock.current = await navigator.wakeLock.request('screen');

            wakeLock.current.addEventListener('release', () => {
                wakeLock.current = null;
            });
        } catch (err) {
            console.error('WakeLock error:', err);
        }
    }, []);

    const releaseWakeLock = useCallback(async () => {
        if (wakeLock.current) {
            await wakeLock.current.release();
            wakeLock.current = null;
        }
    }, []);

    useEffect(() => {
        if (enabled) {
            requestWakeLock();
        } else {
            releaseWakeLock();
        }

        return () => {
            releaseWakeLock();
        };
    }, [enabled, requestWakeLock, releaseWakeLock]);

    // Handle visibility change (re-request if tab becomes visible again)
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (enabled && document.visibilityState === 'visible' && !wakeLock.current) {
                await requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [enabled, requestWakeLock]);
};
