"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated =
      localStorage.getItem("dashboard_authenticated") === "true";

    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  function login() {
    localStorage.setItem("dashboard_authenticated", "true");
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("dashboard_authenticated");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
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