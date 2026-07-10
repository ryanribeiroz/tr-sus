// src/contexts/ConnectivityContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as Network from 'expo-network';

interface ConnectivityContextType {
  isOnline: boolean;
  toggleOnline: () => void; // For dev/demo purposes
}

const ConnectivityContext = createContext<ConnectivityContextType | null>(null);

export function ConnectivityProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        setIsOnline(state.isConnected ?? false);
      } catch {
        // Default to true if can't check
        setIsOnline(true);
      }
    };

    checkNetwork();
    // Note: expo-network doesn't have a listener API in all versions
    // For Fase 1, we use manual toggle + periodic check
    const interval = setInterval(checkNetwork, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ConnectivityContext.Provider value={{ isOnline, toggleOnline: () => setIsOnline((v) => !v) }}>
      {children}
    </ConnectivityContext.Provider>
  );
}

export function useConnectivity() {
  const ctx = useContext(ConnectivityContext);
  if (!ctx) throw new Error('useConnectivity must be used inside ConnectivityProvider');
  return ctx;
}
