// src/components/Input/index.tsx
import React from 'react';
import { View, TextInput, Text, StyleSheet, type TextInputProps, type ViewStyle } from 'react-native';
import { colors, borderRadius } from '@/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...rest
}: InputProps) {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          placeholderTextColor={colors.mutedForeground}
          style={[
            styles.input,
            !!leftIcon && { paddingLeft: 44 },
            !!rightIcon && { paddingRight: 44 },
            style,
          ]}
          {...rest}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: colors.mutedForeground,
    marginBottom: 6,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 56,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius['2xl'],
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.foreground,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.destructive,
    borderRadius: borderRadius['2xl'],
  },
  iconLeft: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  iconRight: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  error: {
    fontSize: 12,
    color: colors.destructive,
    marginTop: 4,
  },
});
