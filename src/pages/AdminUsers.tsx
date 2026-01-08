import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { rolesService, UserRole, UserProfile } from '@/lib/roles';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminUsers = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    loadUsers();
  }, [isAdmin, navigate]);

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const usersList: UserProfile[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          role: data.role || 'user',
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate() || new Date(),
        };
      });

      setUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    try {
      await rolesService.updateUserRole(uid, newRole);
      setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Błąd podczas zmiany roli');
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-4xl font-bold">Zarządzanie użytkownikami</h1>
          <p className="text-foreground-secondary">Panel Administratora</p>
        </div>
      </div>

      <div className="bg-background-secondary rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold">Użytkownik</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Rola</th>
                <th className="text-left p-4 font-semibold">Utworzono</th>
                <th className="text-left p-4 font-semibold">Ostatnie logowanie</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} className="border-b border-border hover:bg-background/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        {user.role === 'admin' ? (
                          <Crown className="w-5 h-5 text-primary" />
                        ) : (
                          <User className="w-5 h-5 text-foreground-secondary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.displayName || 'Brak nazwy'}</p>
                        <p className="text-xs text-foreground-secondary">{user.uid.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-foreground-secondary">{user.email}</td>
                  <td className="p-4">
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.uid, value as UserRole)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            User
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4" />
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4 text-foreground-secondary text-sm">
                    {user.createdAt.toLocaleDateString('pl-PL')}
                  </td>
                  <td className="p-4 text-foreground-secondary text-sm">
                    {user.lastLogin.toLocaleDateString('pl-PL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Informacje o rolach
        </h3>
        <ul className="space-y-2 text-sm text-foreground-secondary">
          <li>• <strong>User</strong> - Standardowy użytkownik z dostępem do filmów, seriali i kolekcji</li>
          <li>• <strong>Admin</strong> - Pełny dostęp + zarządzanie użytkownikami</li>
        </ul>
      </div>
    </motion.div >
  );
};

export default AdminUsers;
