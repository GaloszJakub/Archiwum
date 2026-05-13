import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const A = {
  border: 'rgba(255,248,230,0.12)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  amber: '#d4a056',
  red: '#ef4444',
  bg: '#0a0a0c',
};

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
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{ background: A.bg }}
    >
      {/* Subtle Neon Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw',
          height: '60vw',
          maxWidth: '800px',
          maxHeight: '800px',
          background: `radial-gradient(circle, ${A.amber}15 0%, transparent 60%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div 
        className="w-full max-w-sm flex flex-col items-center gap-10 sm:gap-12 relative z-10 p-8 sm:p-12" 
        style={{ border: `1px solid ${A.border}`, background: A.bg }}
      >
        <div className="text-center">
          <h1 
            className="text-4xl sm:text-5xl mb-3 sm:mb-4"
            style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400, color: A.text, lineHeight: 1 }}
          >
            Archiwum
          </h1>
          <p 
            className="text-[10px] sm:text-[11px]"
            style={{ fontFamily: '"JetBrains Mono", monospace', color: A.text2, textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            Twój osobisty katalog
          </p>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          aria-label="Zaloguj się przez Google"
          className="w-full flex items-center justify-center gap-3 sm:gap-4 transition-all hover:bg-white/5 active:scale-[0.98] py-3 sm:py-4 px-4 sm:px-6"
          style={{
            border: `1px solid ${A.border}`,
            background: isLoading ? 'rgba(255,255,255,0.02)' : 'transparent',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" className="sm:w-[18px] sm:h-[18px]" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
          <span 
            className="text-[10px] sm:text-xs"
            style={{ fontFamily: '"JetBrains Mono", monospace', color: A.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            {isLoading ? 'AUTORYZACJA...' : 'ZALOGUJ PRZEZ GOOGLE'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Login;
