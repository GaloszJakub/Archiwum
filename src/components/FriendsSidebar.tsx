import { useState } from 'react';
import { Users, Search, UserPlus, X, Check, Trash2, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  useFriends,
  usePendingRequests,
  useSentRequests,
  useSearchUsers,
  useSendFriendRequest,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useRemoveFriend,
  useCancelFriendRequest,
} from '@/hooks/useFriends';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface FriendsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FriendsSidebar = ({ isOpen, onClose }: FriendsSidebarProps) => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: friends } = useFriends();
  const { data: pendingRequests } = usePendingRequests();
  const { data: sentRequests, isLoading: sentRequestsLoading } = useSentRequests();
  const { data: searchResults } = useSearchUsers(searchTerm);
  const sendRequest = useSendFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const rejectRequest = useRejectFriendRequest();
  const removeFriend = useRemoveFriend();
  const cancelRequest = useCancelFriendRequest();

  const handleSendRequest = async (userId: string, userName: string) => {
    try {
      await sendRequest.mutateAsync({ toUserId: userId, toUserName: userName });
      toast.success('Zaproszenie wysłane!', {
        description: `Wysłano zaproszenie do ${userName}. Oczekuje na odpowiedź.`,
        duration: 4000,
      });
      setSearchOpen(false);
      setSearchTerm('');
    } catch (error: any) {
      toast.error('Błąd', {
        description: error.message || 'Nie udało się wysłać zaproszenia',
      });
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest.mutateAsync(requestId);
      toast.success('Zaproszenie zaakceptowane!', {
        description: 'Dodano nowego znajomego',
      });
    } catch (error) {
      toast.error('Błąd', {
        description: 'Nie udało się zaakceptować zaproszenia',
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest.mutateAsync(requestId);
      toast.success('Zaproszenie odrzucone');
    } catch (error) {
      toast.error('Błąd', {
        description: 'Nie udało się odrzucić zaproszenia',
      });
    }
  };

  const handleCancel = async (requestId: string) => {
    try {
      await cancelRequest.mutateAsync(requestId);
      toast.success('Zaproszenie anulowane');
    } catch (error) {
      toast.error('Błąd', {
        description: 'Nie udało się anulować zaproszenia',
      });
    }
  };

  const handleRemove = async (friendId: string) => {
    try {
      await removeFriend.mutateAsync(friendId);
      toast.success('Znajomy usunięty', {
        description: 'Usunięto ze znajomych',
      });
    } catch (error) {
      toast.error('Błąd', {
        description: 'Nie udało się usunąć znajomego',
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-screen w-80 bg-background-secondary border-l border-border shadow-2xl"
          >
            <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Znajomi</h2>
            {pendingRequests && pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingRequests.length}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <UserPlus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Znajdź znajomych</DialogTitle>
                <DialogDescription>
                  Wyszukaj użytkowników po imieniu lub emailu
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Szukaj..."
                    className="pl-10"
                  />
                </div>

                <ScrollArea className="h-[300px]">
                  {searchResults && searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((user) => (
                        <div
                          key={user.uid}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-background-secondary transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 ${user.photoURL ? 'hidden' : ''}`}>
                              <UserIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{user.displayName}</p>
                              <p className="text-xs text-foreground-secondary truncate">{user.email}</p>
                            </div>
                          </div>
                          {user.isFriend ? (
                            <Badge variant="secondary" className="shrink-0">
                              Znajomy
                            </Badge>
                          ) : user.hasPendingRequest ? (
                            <Badge variant="outline" className="shrink-0">
                              Oczekuje
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendRequest(user.uid, user.displayName)}
                              disabled={sendRequest.isPending}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Dodaj
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : searchTerm.length >= 2 ? (
                    <p className="text-center text-foreground-secondary py-8">
                      Nie znaleziono użytkowników
                    </p>
                  ) : (
                    <p className="text-center text-foreground-secondary py-8">
                      Wpisz co najmniej 2 znaki
                    </p>
                  )}
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          </div>
        </div>

        {/* Pending Requests (Received) */}
        {pendingRequests && pendingRequests.length > 0 && (
          <div className="border-b border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Badge variant="destructive" className="px-2">
                {pendingRequests.length}
              </Badge>
              Otrzymane zaproszenia
            </h3>
            <div className="space-y-2">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <UserIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{request.fromUserName}</p>
                      <p className="text-xs text-foreground-secondary">
                        {new Date(request.createdAt).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:bg-green-500/20"
                      onClick={() => handleAccept(request.id)}
                      disabled={acceptRequest.isPending}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:bg-destructive/20"
                      onClick={() => handleReject(request.id)}
                      disabled={rejectRequest.isPending}
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sent Requests (Waiting) */}
        {!sentRequestsLoading && sentRequests && sentRequests.length > 0 && (
          <div className="border-b border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Badge variant="secondary" className="px-2">
                {sentRequests.length}
              </Badge>
              Wysłane zaproszenia
            </h3>
            <div className="space-y-2">
              {sentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                      <UserIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{request.toUserName}</p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                        Wysłano zaproszenie
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-destructive/20"
                    onClick={() => handleCancel(request.id)}
                    disabled={cancelRequest.isPending}
                    title="Anuluj zaproszenie"
                  >
                    <X className="w-4 h-4 text-foreground-secondary" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <ScrollArea className="flex-1 p-4">
          {friends && friends.length > 0 ? (
            <div className="space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend.userId}
                  className="group flex items-center justify-between p-3 rounded-lg hover:bg-background transition-colors cursor-pointer"
                  onClick={() => navigate(`/profile/${friend.userId}`)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <UserIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{friend.userName}</p>
                      <p className="text-xs text-foreground-secondary truncate">
                        {friend.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(friend.userId);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-foreground-secondary mx-auto mb-4" />
              <p className="text-foreground-secondary mb-2">Brak znajomych</p>
              <p className="text-sm text-foreground-secondary">
                Kliknij <UserPlus className="w-4 h-4 inline" /> aby dodać
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
