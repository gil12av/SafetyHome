import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { Redirect } from 'expo-router';

export default function Index() {
  return (
    <AuthProvider>
      <Redirect href="/HomeScreen" />
    </AuthProvider>
  );
}
