import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      let msg = 'Nie udało się zalogować. Spróbuj ponownie.';
      if (error.code === 'auth/popup-closed-by-user') msg = 'Logowanie anulowane.';
      if (error.code === 'auth/popup-blocked') msg = 'Popup zablokowany przez przeglądarkę.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--paper)' }}
    >
      <div className="w-full max-w-xs flex flex-col items-center gap-5">
        {/* Logo */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 72,
            height: 72,
            border: '2px solid var(--ink)',
            borderRadius: 4,
            background: 'color-mix(in oklch, var(--red) 14%, var(--paper))',
          }}
        >
          <span style={{ fontFamily: 'Inter, -apple-system, sans-serif', fontSize: 44, fontWeight: 700, lineHeight: 1, color: 'var(--ink)' }}>A</span>
        </div>

        <div className="text-center">
          <h1 style={{ fontFamily: 'Inter, -apple-system, sans-serif', fontSize: 44, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
            Archiwum
          </h1>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>
            Twój osobisty katalog filmów i seriali
          </p>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          aria-label="Zaloguj się przez Google"
          className="w-full flex items-center justify-center gap-3 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95"
          style={{
            padding: '14px 16px',
            minHeight: 52,
            border: '2px solid var(--ink)',
            borderRadius: 4,
            background: isLoading ? 'color-mix(in srgb, var(--ink) 4%, var(--paper))' : 'var(--paper)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            touchAction: 'manipulation',
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              border: '1.5px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: 'var(--ink)',
            }}
          >
            G
          </div>
          <span style={{ fontFamily: 'Inter, -apple-system, sans-serif', fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>
            {isLoading ? 'Logowanie…' : 'Zaloguj się przez Google'}
          </span>
        </button>

        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--ink-3)', textAlign: 'center' }}>
          Logując się, akceptujesz warunki użytkowania
        </p>
      </div>
    </div>
  );
};

export default Login;
