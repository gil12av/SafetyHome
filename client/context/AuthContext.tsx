import { API_URL } from "@/services/api";
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface UserType {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// מבנה המידע עבור AuthContext
interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// יצירת הקשר (Context) עם ערך ברירת מחדל
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// ספק ההקשר (Provider)
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log(`🔍 Checking session at: ${API_URL}/users/me`);
        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });

        console.log("📥 Session Response Headers:", response.headers);

        if (!response.ok) {
          console.warn("🚫 User not authenticated.");
          setIsAuthenticated(false);
          return;
        }

        const userData = await response.json();
        console.log("✅ User Data from Session:", userData);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("❌ Error checking user session:", error);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("📤 Sending login request...");
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error("Login failed.");
      }
  
      const data = await response.json(); // 🆕
      const userData: UserType = data.user; // 🆕
      console.log("✅ Login successful:", userData);
  
      setUser(userData);
      setIsAuthenticated(true);
  
      console.log("📌 Updated AuthContext User:", userData);
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("📤 Sending logout request...");
      await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      console.log("🚪 Logout successful.");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// פונקציה לשימוש מהיר ב-AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
