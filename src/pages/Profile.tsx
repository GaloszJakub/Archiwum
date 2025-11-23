import { SplitText } from '@/components/SplitText';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Crown, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

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
      <SplitText 
        text={t('profile.settings')}
        className="text-4xl lg:text-5xl font-bold"
      />

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-1 bg-background-secondary">
          <TabsTrigger value="account">{t('profile.account')}</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6 mt-6">
          <div className="bg-background-secondary rounded-lg p-6 border border-border space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{t('profile.accountInfo')}</h3>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isAdmin 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-background text-foreground-secondary'
                }`}>
                  {isAdmin ? (
                    <>
                      <Crown className="w-4 h-4" />
                      {t('profile.administrator')}
                    </>
                  ) : (
                    <>
                      <UserIcon className="w-4 h-4" />
                      {t('profile.user')}
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">{t('profile.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    className="mt-1.5 bg-background"
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="name">{t('profile.name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={user?.displayName || ''}
                    className="mt-1.5 bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-bold mb-4">{t('profile.preferences')}</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">{t('profile.language')}</Label>
                  <select 
                    id="language"
                    value={i18n.language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="w-full mt-1.5 bg-background border-border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="pl">Polski</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline">{t('profile.cancel')}</Button>
              <Button className="bg-primary hover:bg-primary-hover">{t('profile.save')}</Button>
            </div>
          </div>

          <div className="bg-background-secondary rounded-lg p-6 border border-border">
            <h3 className="text-lg font-bold mb-4">{t('profile.session')}</h3>
            <p className="text-foreground-secondary mb-4">
              {t('profile.sessionDescription')}
            </p>
            <Button 
              onClick={handleSignOut}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('auth.signOut')}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
