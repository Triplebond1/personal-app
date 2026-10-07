
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
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const STORAGE_KEY = "auth_user";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Persist the authenticated user to local storage and state.

  const persistUser = (user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setUser(user);
  };

  //Clear the authenticated user from local storage and state.

  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEY);

    setUser(null);
    setAccessToken(null);
  };

  // Restore the authenticated user from local storage and refresh the session.

  useEffect(() => {
    const restoreSession = async () => {
      try {
  // Retrieve the user from local storage.
  //  when a user refreshes the page, 
  // we want to restore their session if possible.

        const storedUser = localStorage.getItem(STORAGE_KEY);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // ask the backend whether the refresh-token session is still valid.
        //the browser automatically sends the HttpOnly refresh-token cookie with this request.

        const response = await refreshSession();

        const refreshedUser = response.data.user;
        const newAccessToken = response.data.user.access_token;

        persistUser(refreshedUser);
        setAccessToken(newAccessToken);
      } catch {

        //the backend rejected the refresh token.
        //The session has therefore expired or become invalid.

        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  /////////////////////////////
  // LOGIN
  /////////////////////////////

  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    const response = await loginRequest(email, password);

    const loggedInUser = response.data.user;
    const newAccessToken = response.data.user.access_token;

    persistUser(loggedInUser);
    setAccessToken(newAccessToken);
  };

  /////////////////////////////
  // LOGOUT
  /////////////////////////////

  const logout = async (): Promise<void> => {
    try {
      await logoutRequest();
    } finally {
      clearAuth();
    }
  };

  /////////////////////////////
  // REGISTER
  /////////////////////////////

  const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<void> => {
    const response = await registerRequest(
      firstname,
      lastname,
      email,
      password
    );

    const registeredUser = response.data.user;
    const newAccessToken = response.data.user.access_token;

    persistUser(registeredUser);
    setAccessToken(newAccessToken);
  };

  const isAuthenticated =
    !!user && !!accessToken;

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

