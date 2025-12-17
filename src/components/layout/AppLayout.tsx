import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { FriendsSidebar } from '../FriendsSidebar';
import { useSmoothScroll } from '@/lib/smoothScroll';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  useSmoothScroll();
  const [friendsSidebarOpen, setFriendsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleOpenFriendsSidebar = () => {
      setFriendsSidebarOpen(true);
    };

    window.addEventListener('openFriendsSidebar', handleOpenFriendsSidebar);
    return () => {
      window.removeEventListener('openFriendsSidebar', handleOpenFriendsSidebar);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 lg:ml-64 p-4 pb-24 pt-8 lg:p-8 w-full overflow-x-hidden">
        {children}
      </main>

      <FriendsSidebar
        isOpen={friendsSidebarOpen}
        onClose={() => setFriendsSidebarOpen(false)}
      />
    </div>
  );
};
