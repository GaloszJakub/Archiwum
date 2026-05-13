import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Crown, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-4xl lg:text-5xl font-bold">Ustawienia</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-1 bg-background-secondary">
          <TabsTrigger value="account">Konto</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6 mt-6">
          <div className="bg-background-secondary rounded-lg p-6 border border-border space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Informacje o koncie</h3>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isAdmin
                  ? 'bg-primary/20 text-primary'
                  : 'bg-background text-foreground-secondary'
                  }`}>
                  {isAdmin ? (
                    <>
                      <Crown className="w-4 h-4" />
                      Administrator
                    </>
                  ) : (
                    <>
                      <UserIcon className="w-4 h-4" />
                      Użytkownik
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    className="mt-1.5 bg-background"
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="name">Imię i nazwisko</Label>
                  <Input
                    id="name"
                    type="text"
                    value={user?.displayName || ''}
                    className="mt-1.5 bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline">Anuluj</Button>
              <Button className="bg-primary hover:bg-primary-hover">Zapisz</Button>
            </div>
          </div>

          <div className="bg-background-secondary rounded-lg p-6 border border-border">
            <h3 className="text-lg font-bold mb-4">Sesja</h3>
            <p className="text-foreground-secondary mb-4">
              Wyloguj się ze swojego konta
            </p>
            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj się
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
