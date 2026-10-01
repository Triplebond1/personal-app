"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  refreshSession,
  User,
} from "../../service/auth";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (firstname: string, lastname: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await refreshSession();

        setUser(response.user);
        setAccessToken(response.user.access_token);
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    const response = await loginRequest(email, password);

    setUser(response.user);
    setAccessToken(response.user.access_token);
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<void> => {
    
      const response = await registerRequest(firstname, lastname, email, password);
  
    setUser(response.user);
    setAccessToken(response.user.access_token);

  };

  const isAuthenticated = !!user && !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
