import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  isOnboarded: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  signup: (name: string, email: string, password: string, redirectTo?: string) => Promise<void>;
  socialAuth: (provider: 'google' | 'apple', redirectTo?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate authentication check
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user is stored in localStorage (mock authentication)
      const storedUser = localStorage.getItem('tenezis_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, redirectTo?: string) => {
    setLoading(true);
    
    try {
      // Simulate API login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        avatar: '',
        plan: 'pro',
        isOnboarded: true
      };
      
      setUser(mockUser);
      localStorage.setItem('tenezis_user', JSON.stringify(mockUser));
      
      // Redirect to intended destination or default to home
      navigate(redirectTo || '/');
    } catch (error) {
      throw new Error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, redirectTo?: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
        avatar: '',
        plan: 'free',
        isOnboarded: false
      };
      
      setUser(mockUser);
      localStorage.setItem('tenezis_user', JSON.stringify(mockUser));
      
      // Redirect to intended destination or default to home
      navigate(redirectTo || '/');
    } catch (error) {
      throw new Error('Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  const socialAuth = async (provider: 'google' | 'apple', redirectTo?: string) => {
    setLoading(true);
    
    try {
      // Simulate social auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: '1',
        name: provider === 'google' ? 'John Doe (Google)' : 'John Doe (Apple)',
        email: `john.doe@${provider}.com`,
        avatar: '',
        plan: 'free',
        isOnboarded: false
      };
      
      setUser(mockUser);
      localStorage.setItem('tenezis_user', JSON.stringify(mockUser));
      
      // Redirect to intended destination or default to home
      navigate(redirectTo || '/');
    } catch (error) {
      throw new Error(`Erreur de connexion ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tenezis_user');
    navigate('/');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    socialAuth,
    logout,
    loading,
    isLoading: loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};