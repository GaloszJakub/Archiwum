import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Film, Tv, FolderHeart, User, Shield, LogOut, Menu, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin, signOut } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.dashboard') },
    { path: '/movies', icon: Film, label: t('nav.movies') },
    { path: '/series', icon: Tv, label: t('nav.series') },
    { path: '/collections', icon: FolderHeart, label: t('nav.collections') },
    { path: '/profile', icon: User, label: t('nav.profile') },
  ];

  const adminNavItems = [
    { path: '/admin/users', icon: Shield, label: t('nav.admin'), adminOnly: true },
  ];

  const allNavItems = isAdmin ? [...navItems, ...adminNavItems] : navItems;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Hamburger Button - Hidden when menu is open */}
      {!mobileMenuOpen && (
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-lg bg-background-secondary border border-border flex items-center justify-center hover:bg-secondary transition-colors shadow-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-background-secondary border-r border-border transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:w-64",
          mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo with Close Button */}
          <div className="flex items-center justify-between h-16 px-4 lg:px-6 border-b border-border">
            <Link to="/" className="flex items-center gap-3" onClick={handleNavClick}>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Film className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Archiwum</span>
            </Link>
            
            {/* Close button - visible only on mobile when menu is open */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-foreground-secondary" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-8 overflow-y-auto">
            <ul className="space-y-2 px-4">
              {allNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <li key={item.path}>
                    <MagneticLink
                      to={item.path}
                      isActive={isActive}
                      isHovered={hoveredItem === item.path}
                      onHoverStart={() => setHoveredItem(item.path)}
                      onHoverEnd={() => setHoveredItem(null)}
                      onClick={handleNavClick}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </MagneticLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Friends Button */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => {
                const event = new CustomEvent('openFriendsSidebar');
                window.dispatchEvent(event);
              }}
              className="w-full justify-start gap-3 text-foreground-secondary hover:text-primary hover:bg-secondary/50"
            >
              <Users className="w-5 h-5 shrink-0" />
              <span>Znajomi</span>
            </Button>
          </div>

          {/* Logout Button */}
          <div className="px-4 pb-4">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start gap-3 text-foreground-secondary hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Wyloguj</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

interface MagneticLinkProps {
  to: string;
  isActive: boolean;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
  children: React.ReactNode;
}

const MagneticLink = ({ to, isActive, isHovered, onHoverStart, onHoverEnd, onClick, children }: MagneticLinkProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    setPosition({
      x: distanceX * 0.3,
      y: distanceY * 0.3,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    onHoverEnd();
  };

  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={onHoverStart}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 touch-manipulation",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-foreground-secondary hover:bg-secondary hover:text-foreground"
      )}
    >
      <motion.div
        className="flex items-center gap-3 w-full"
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
      >
        {children}
      </motion.div>
    </Link>
  );
};
