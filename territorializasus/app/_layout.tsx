import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConnectivityProvider } from '@/contexts/ConnectivityContext';
import { database } from '@/database';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  // Pre-load the DB on startup
  useEffect(() => {
    // A simple query just to warm up the connection
    database.get('users').query().fetchCount().catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <ConnectivityProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(painel)" />
          <Stack.Screen name="rua/[streetId]" />
          <Stack.Screen name="domicilio/novo" />
          <Stack.Screen name="estabelecimento/novo" />
          <Stack.Screen name="ponto-de-risco/novo" />
        </Stack>
      </ConnectivityProvider>
    </AuthProvider>
  );
}
