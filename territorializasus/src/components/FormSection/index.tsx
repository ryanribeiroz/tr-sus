// src/components/FormSection/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '@/theme';

interface FormSectionProps {
  step: string | number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormSection({ step, title, hint, children }: FormSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{step}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {hint && <Text style={styles.hint}>{hint}</Text>}
        </View>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  hint: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  content: {
    gap: 12,
  },
});
