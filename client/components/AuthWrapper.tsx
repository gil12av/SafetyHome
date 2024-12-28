import React, { useContext, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (authContext?.isAuthenticated === false) {
      router.replace('/UserForm');
    }
  }, [authContext?.isAuthenticated, router]);
  
  return <>{children}</>;
};

export default AuthWrapper;
