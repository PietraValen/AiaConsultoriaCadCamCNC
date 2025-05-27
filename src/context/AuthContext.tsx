
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'cliente' | 'vendedor' | 'admin' | 'master' | null;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userRole: UserRole;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const storedUserType = localStorage.getItem('user_type');
          if (storedUserType === 'cliente' || storedUserType === 'vendedor' || storedUserType === 'admin' || storedUserType === 'master') {
            setUserRole(storedUserType);
          } else {
            try {
              const { data, error } = await supabase
                .from('users')
                .select('user_type')
                .eq('id', currentSession.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching user role:', error);
                setUserRole('cliente');
              } else {
                setUserRole((data?.user_type as UserRole) || 'cliente');
              }
            } catch (error) {
              console.error('Exception fetching user role:', error);
              setUserRole('cliente');
            }
          }
        } else {
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );

    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        const storedUserType = localStorage.getItem('user_type');
        if (storedUserType === 'cliente' || storedUserType === 'vendedor' || storedUserType === 'admin' || storedUserType === 'master') {
          setUserRole(storedUserType);
        }
      } else if (initialSession?.user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('user_type')
            .eq('id', initialSession.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user role:', error);
            setUserRole('cliente');
          } else {
            setUserRole((data?.user_type as UserRole) || 'cliente');
          }
        } catch (error) {
          console.error('Exception fetching user role:', error);
          setUserRole('cliente');
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_type');
    await supabase.auth.signOut();
    setUserRole(null);
  };

  const value = {
    user,
    session,
    isLoading,
    userRole,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
