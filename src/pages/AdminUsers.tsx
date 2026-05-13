import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

const A = {
  bg: '#0a0a0c',
  border: 'rgba(255,248,230,0.12)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  amber: '#d4a056',
};

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
        <div style={{ fontFamily: '"JetBrains Mono", monospace', color: A.amber, fontSize: 12, letterSpacing: '0.1em' }} className="animate-pulse">
          ŁADOWANIE BAZY DANYCH...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 px-4 sm:px-14 pt-16 max-w-6xl mx-auto"
      style={{ fontFamily: '"Inter Tight", "Inter", -apple-system, sans-serif' }}
    >
      <div style={{ marginBottom: 56 }}>
        <h1 
          style={{ 
            fontSize: 34, 
            fontWeight: 400, 
            color: A.text, 
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.1
          }}
        >
          Zarządzanie Użytkownikami
        </h1>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.amber, marginTop: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Panel Administratora
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${A.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${A.border}` }}>
                <th style={{ padding: '24px 0', fontWeight: 500, fontSize: 12, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Użytkownik</th>
                <th style={{ padding: '24px 0', fontWeight: 500, fontSize: 12, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Adres Email</th>
                <th style={{ padding: '24px 0', fontWeight: 500, fontSize: 12, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Poziom Dostępu</th>
                <th style={{ padding: '24px 0', fontWeight: 500, fontSize: 12, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Utworzono</th>
                <th style={{ padding: '24px 0', fontWeight: 500, fontSize: 12, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ostatnie logowanie</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} style={{ borderBottom: `1px solid ${A.border}`, transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '20px 0' }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: A.text, letterSpacing: '-0.01em' }}>
                      {user.displayName || 'Brak nazwy'}
                    </div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: A.text2, marginTop: 4 }}>
                      ID: {user.uid.slice(0, 8)}...
                    </div>
                  </td>
                  <td style={{ padding: '20px 0', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '20px 0' }}>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.uid, value as UserRole)}
                    >
                      <SelectTrigger 
                        className="w-32 focus:ring-0 focus:ring-offset-0"
                        style={{ 
                          borderRadius: 0, 
                          border: `1px solid ${A.border}`, 
                          background: 'transparent',
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: 11,
                          textTransform: 'uppercase',
                          color: user.role === 'admin' ? A.amber : A.text,
                          height: 36
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent style={{ borderRadius: 0, border: `1px solid ${A.border}`, background: '#0a0a0c' }}>
                        <SelectItem value="user" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, textTransform: 'uppercase', borderRadius: 0 }}>
                          User
                        </SelectItem>
                        <SelectItem value="admin" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, textTransform: 'uppercase', borderRadius: 0, color: A.amber }}>
                          Admin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td style={{ padding: '20px 0', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2 }}>
                    {user.createdAt.toLocaleDateString('pl-PL')}
                  </td>
                  <td style={{ padding: '20px 0', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2 }}>
                    {user.lastLogin.toLocaleDateString('pl-PL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 56, borderTop: `1px solid ${A.border}`, paddingTop: 32 }}>
        <div style={{ fontSize: 12, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 500 }}>
          Informacje systemowe
        </div>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2, lineHeight: 1.8 }}>
          <div><span style={{ color: A.text }}>[USER]</span> - Ograniczony dostęp (katalog, kolekcje)</div>
          <div><span style={{ color: A.amber }}>[ADMIN]</span> - Pełne uprawnienia operacyjne</div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminUsers;
