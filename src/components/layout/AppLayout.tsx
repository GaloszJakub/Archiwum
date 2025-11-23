import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { FriendsSidebar } from '../FriendsSidebar';
import { useSmoothScroll } from '@/lib/smoothScroll';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePendingRequests } from '@/hooks/useFriends';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  useSmoothScroll();
  const [friendsSidebarOpen, setFriendsSidebarOpen] = useState(false);
  const { data: pendingRequests } = usePendingRequests();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-16 lg:ml-64 p-6 lg:p-8">
        {children}
      </main>
      
      {/* Friends Tab Button */}
      <button
        onClick={() => setFriendsSidebarOpen(true)}
        className="fixed right-0 top-24 z-30 bg-background-secondary border border-r-0 border-border rounded-l-lg px-3 py-4 shadow-lg hover:bg-background transition-colors group"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Users className="w-5 h-5 text-foreground-secondary group-hover:text-primary transition-colors" />
            {pendingRequests && pendingRequests.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {pendingRequests.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-foreground-secondary group-hover:text-primary transition-colors">
              ◀
            </span>
          </div>
        </div>
      </button>

      <FriendsSidebar 
        isOpen={friendsSidebarOpen} 
        onClose={() => setFriendsSidebarOpen(false)} 
      />
    </div>
  );
};
