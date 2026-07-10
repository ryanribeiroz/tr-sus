// src/components/Select/index.tsx
import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, borderRadius } from '@/theme';

interface SelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  containerStyle?: ViewStyle;
}

// Using simple native picker approach compatible with Expo
export function Select({ label, value, onValueChange, options, containerStyle }: SelectProps) {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.wrapper}>
        <Text style={styles.selectedText} onPress={() => {
          // Cycle through options on press (simple approach)
          const currentIndex = options.indexOf(value);
          const nextIndex = (currentIndex + 1) % options.length;
          onValueChange(options[nextIndex]);
        }}>
          {value || 'Selecione...'}
        </Text>
      </View>
    </View>
  );
}

// Simpler select using TouchableOpacity for each option
export function SimpleSelect({ label, value, onValueChange, options, containerStyle }: SelectProps) {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.optionsWrapper}>
        {options.map((opt) => (
          <Text
            key={opt}
            onPress={() => onValueChange(opt)}
            style={[
              styles.option,
              value === opt && styles.optionActive,
            ]}
          >
            {opt}
          </Text>
        ))}
      </View>
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
  wrapper: {
    height: 48,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  selectedText: {
    fontSize: 14,
    color: colors.foreground,
  },
  optionsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.xl,
    fontSize: 13,
    fontWeight: '600',
    color: colors.mutedForeground,
    overflow: 'hidden',
  },
  optionActive: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },
});
