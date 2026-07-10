import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, shadows } from '@/theme';
import { LucideIcon } from 'lucide-react-native';

interface StatProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone: 'primary' | 'warning' | 'success';
}

export function Stat({ icon: Icon, label, value, tone }: StatProps) {
  const getColors = () => {
    switch (tone) {
      case 'primary':
        return { bg: colors.primarySoft, text: colors.primary };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warning };
      case 'success':
        return { bg: colors.successLight, text: colors.success };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.container, shadows.card]}>
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <Icon color={text} size={20} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: 12,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.foreground,
  },
  label: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.mutedForeground,
    fontWeight: '600',
    marginTop: 2,
  },
});
