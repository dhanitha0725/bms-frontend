import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { authService } from "../api/api";
import { decodeToken, isTokenExpired } from "../utils/token";

// Constants for claim URLs to avoid repetition
const CLAIM_NAME_ID =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const CLAIM_NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

// Define the User interface with only id and username
interface User {
  id: string;
  username: string;
}

// Define the AuthContextType interface
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>; 
  logout: () => void;
  checkAuth: () => void;
}

// Create the AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Custom hook to use auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component to manage authentication state
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Function to handle user login
  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        const response = await authService.login(username, password);

        if (response.token) {
          localStorage.setItem("authToken", response.token);

          const user = extractUserFromToken(response.token);
          if (!user) return false;

          setUser(user);
          setIsAuthenticated(true);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },
    []
  );

  // Function to handle user logout
  const logout = useCallback((): void => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  // Function to check authentication status
  const checkAuth = useCallback((): void => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      // Check if token is expired or invalid
      if (isTokenExpired(token)) {
        logout();
        return;
      }

      const user = extractUserFromToken(token);
      if (!user) {
        logout();
        return;
      }

      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Authentication check failed:", error);
      logout();
    }
  }, [logout]);

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkAuth]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function to extract user data from token
const extractUserFromToken = (token: string): User | null => {
  try {
    const decoded = decodeToken(token);
    return {
      id: decoded[CLAIM_NAME_ID],
      username: decoded[CLAIM_NAME],
    };
  } catch {
    return null;
  }
};

export default AuthContext;
