// src/components/SyncStatus/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, borderRadius } from '@/theme';
import type { SyncStatus as SyncStatusType } from '@/types';

interface SyncStatusPillProps {
  status: SyncStatusType | string;
}

const STATUS_CONFIG: Record<string, {
  label: string;
  bg: string;
  color: string;
  icon: keyof typeof Feather.glyphMap;
}> = {
  draft: { label: 'Rascunho', bg: colors.secondary, color: colors.mutedForeground, icon: 'edit-2' },
  pending: { label: 'Pendente', bg: colors.warningLight, color: colors.warning, icon: 'clock' },
  syncing: { label: 'Enviando', bg: colors.primaryLight, color: colors.primary, icon: 'upload-cloud' },
  synced: { label: 'Enviado', bg: colors.successLight, color: colors.success, icon: 'check-circle' },
  error: { label: 'Falha', bg: colors.destructiveLight, color: colors.destructive, icon: 'x-circle' },
  conflict: { label: 'Conflito', bg: colors.warningLight, color: colors.warning, icon: 'alert-triangle' },
};

export function SyncStatusPill({ status }: SyncStatusPillProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <View style={[styles.pill, { backgroundColor: config.bg }]}>
      <Feather name={config.icon} size={12} color={config.color} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
