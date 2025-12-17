import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Film, Tv, FolderHeart, User, Shield, LogOut, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
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
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 z-40 h-screen w-64 bg-background-secondary border-r border-border">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Film className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Archiwum</span>
        </Link>
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
                  onClick={() => { }}
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
    </aside>
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
