import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// מבנה המידע עבור AuthContext
interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (userData: any, token: string) => void;
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

  // טוען משתמש מהזיכרון בעת טעינת האפליקציה
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        console.log("🔑 Raw user from AsyncStorage:", storedUser);
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ Parsed user from AsyncStorage:", parsedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          console.log("❌ No user found in AsyncStorage");
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
      }
    };
  
    loadUser();
  }, []);
  
  // התחברות ושמירת נתוני משתמש
  const login = async (userData: any, token: string) => {    
    if (!userData || !userData._id || !token) {
      console.error("❌ User data incomplete. Aborting login.", userData);
      return;
    }
  
    // שילוב הטוקן עם המשתמש
    const userWithToken = { ...userData, token };
    console.log("🗂️ Saving user with token to AsyncStorage:", userWithToken);
  
    setUser(userWithToken);
    setIsAuthenticated(true);
  
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userWithToken));  // שמירת המשתמש והטוקן
      console.log("✅ User + Token saved to AsyncStorage:", userWithToken);
    } catch (error) {
      console.error("❌ Failed to save user to storage:", error);
    }
  };
  

  // התנתקות
  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error("Failed to remove user from storage:", error);
    }
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
