

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  refreshSession,
  type User,
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

  ////////////////////////////////////////////////////////
  //save the user profile for convenient UI restorate
  //the accessToken is deliberatly not saved locally 
  ///////////////////////////////////////////////////////

  const persistUser = useCallback((authenticatedUser: User) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(authenticatedUser)
    );

    setUser(authenticatedUser);
  }, []);


  ///////////////////////////////////////////////////
  //Update the access token in react state only
  //////////////////////////////////////////////////

  const persistAccessToken = useCallback((token: string) => {
    setAccessToken(token);
  }, []);


  //////////////////////////////////////////////
  //Clear the current authentication state
  //////////////////////////////////////////////

  const clearAuth = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);

    setUser(null);
    setAccessToken(null);
  }, []);

  ////////////////////////////////////////////////////////////////////////
  //restore the session when the application starts
  //the backend must validate the refresh-token session
  ///////////////////////////////////////////////////////////////////////


  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        console.log("Restoring session...");

        // Load the cached profile for UI convenience.
        const storedUser = localStorage.getItem(STORAGE_KEY);

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as User;

            if (!cancelled) {
              setUser(parsedUser);
            }
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        console.log("Attempting to refresh session...", storedUser);

        /////////////////////////////////////////////////////////////
        // The browser sends the refresh-token cookie when eligible.
        /////////////////////////////////////////////////////////////

        const response = await refreshSession();

        if (cancelled) {
          return;
        }

        const refreshedUser = response.data.user;
        const newAccessToken = response.data.accessToken;

        if (!refreshedUser || !newAccessToken) {
          throw new Error(
            "Refresh response is missing the user or access token."
          );
        }

        persistUser(refreshedUser);
        persistAccessToken(newAccessToken);

        console.log("Session restored successfully.");
      } catch (error) {
        console.error("Failed to restore session:", error);

        if (!cancelled) {
          clearAuth();
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [clearAuth, persistUser, persistAccessToken]);


  ////////////////////
  //LOGIN
  ///////////////////

  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    const response = await loginRequest(email, password);

    const loggedInUser = response.data.user;
    const newAccessToken = response.data.accessToken;

    if (!loggedInUser || !newAccessToken) {
      throw new Error(
        "Login response is missing the user or access token."
      );
    }

    persistUser(loggedInUser);
    persistAccessToken(newAccessToken);
  };

  //////////////////////
  //LOGOUT
  /////////////////////

  const logout = async (): Promise<void> => {
    try {
      await logoutRequest();
    } finally {
      clearAuth();
    }
  };

  ////////////////////////
  //REGISTER
  ///////////////////////

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
    const newAccessToken = response.data.accessToken;

    if (!registeredUser || !newAccessToken) {
      throw new Error(
        "Registration response is missing the user or access token."
      );
    }

    persistUser(registeredUser);
    persistAccessToken(newAccessToken);
  };


  //////////////////////////////////////////////////////
  //The user must have both a profile and access token
  /////////////////////////////////////////////////////

  const isAuthenticated = Boolean(user && accessToken);

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

////////////////////////////////////////////////////////////////////
//Acess authentication state from any component inside AythProvider
///////////////////////////////////////////////////////////////////

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
