import React, { createContext, useState, useContext, ReactNode } from 'react';

// מבנה המידע עבור AuthContext
interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

// יצירת הקשר (Context)
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// ספק ההקשר (Provider)
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // התחברות ושמירת נתוני משתמש
  const login = (userData: any) => {
    if (!userData || !userData._id) {
      console.error("❌ User ID not found. Aborting login.");
      return;
    }
    setUser(userData);
    setIsAuthenticated(true);
    console.log("✅ User authenticated:", userData);
  };

  // התנתקות
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    console.log("🚪 User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// פונקציה לשימוש מהיר ב-AuthContext
export const useAuth = () => useContext(AuthContext);
