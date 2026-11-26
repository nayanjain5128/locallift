import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DB_UPDATED_EVENT,
  authenticateDemoGoogle,
  authenticateDemoPhone,
  authenticateWithEmail,
  clearSession,
  getAuthenticatedUser,
  getSession,
  loadDatabase,
  registerClientAccount,
  resetDemoDatabase,
} from '../services/storageService';
import type { AuthSession, DatabaseState, User } from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface AppContextValue {
  db: DatabaseState;
  currentUser: User | null;
  session: AuthSession | null;
  toasts: ToastMessage[];
  showToast: (
    title: string,
    type?: ToastMessage['type'],
    description?: string
  ) => void;
  dismissToast: (id: string) => void;
  refreshData: () => void;
  loginWithEmail: (
    email: string,
    password: string
  ) => { user?: User; error?: string };
  loginWithDemoGoogle: () => User;
  loginWithDemoPhone: (phone: string) => { user: User; isNewClient: boolean };
  signupClient: (payload: {
    name: string;
    email: string;
    password: string;
    businessName: string;
    businessCategory?: string;
    phone?: string;
    location?: string;
  }) => { user?: User; error?: string };
  logout: () => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [db, setDb] = useState<DatabaseState>(() => loadDatabase());
  const [session, setSessionState] = useState<AuthSession | null>(() =>
    getSession()
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getAuthenticatedUser()
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshData = useCallback(() => {
    setDb(loadDatabase());
    setSessionState(getSession());
    setCurrentUser(getAuthenticatedUser());
  }, []);

  useEffect(() => {
    const handleDbUpdate = () => refreshData();
    const handleStorage = () => refreshData();

    window.addEventListener(DB_UPDATED_EVENT, handleDbUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(DB_UPDATED_EVENT, handleDbUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshData]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      title: string,
      type: ToastMessage['type'] = 'success',
      description?: string
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, type, description }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const loginWithEmail = useCallback(
    (email: string, password: string) => {
      const res = authenticateWithEmail(email, password);
      refreshData();
      return res;
    },
    [refreshData]
  );

  const loginWithDemoGoogle = useCallback(() => {
    const user = authenticateDemoGoogle();
    refreshData();
    return user;
  }, [refreshData]);

  const loginWithDemoPhone = useCallback(
    (phone: string) => {
      const res = authenticateDemoPhone(phone);
      refreshData();
      return res;
    },
    [refreshData]
  );

  const signupClient = useCallback(
    (payload: {
      name: string;
      email: string;
      password: string;
      businessName: string;
      businessCategory?: string;
      phone?: string;
      location?: string;
    }) => {
      const res = registerClientAccount(payload);
      refreshData();
      return res;
    },
    [refreshData]
  );

  const logout = useCallback(() => {
    clearSession();
    refreshData();
    showToast('Signed out', 'info', 'You have been securely logged out.');
  }, [refreshData, showToast]);

  const resetDemo = useCallback(() => {
    resetDemoDatabase();
    refreshData();
    showToast(
      'Demo data restored',
      'success',
      'All sample clients, enquiries, and projects were reset to initial state.'
    );
  }, [refreshData, showToast]);

  const value = useMemo<AppContextValue>(
    () => ({
      db,
      currentUser,
      session,
      toasts,
      showToast,
      dismissToast,
      refreshData,
      loginWithEmail,
      loginWithDemoGoogle,
      loginWithDemoPhone,
      signupClient,
      logout,
      resetDemo,
    }),
    [
      db,
      currentUser,
      session,
      toasts,
      showToast,
      dismissToast,
      refreshData,
      loginWithEmail,
      loginWithDemoGoogle,
      loginWithDemoPhone,
      signupClient,
      logout,
      resetDemo,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
