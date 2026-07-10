// src/components/OfflineBanner/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useConnectivity } from '@/contexts/ConnectivityContext';
import { colors, borderRadius } from '@/theme';

export function OfflineBanner() {
  const { isOnline, toggleOnline } = useConnectivity();

  return (
    <TouchableOpacity
      onPress={toggleOnline}
      style={[styles.container, isOnline ? styles.online : styles.offline]}
      activeOpacity={0.7}
    >
      <Feather
        name={isOnline ? 'wifi' : 'wifi-off'}
        size={20}
        color={isOnline ? colors.success : colors.warning}
      />
    </TouchableOpacity>
  );
}

export function OfflineIndicator() {
  const { isOnline } = useConnectivity();

  return (
    <View style={styles.indicator}>
      <Text style={styles.indicatorText}>
        Modo {isOnline ? 'online' : 'offline'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: borderRadius['2xl'],
  },
  online: {
    backgroundColor: colors.successLight,
  },
  offline: {
    backgroundColor: colors.warningLight,
  },
  indicator: {
    paddingVertical: 2,
  },
  indicatorText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: colors.mutedForeground,
  },
});
