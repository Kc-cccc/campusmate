import React from 'react';
import { Pressable } from 'react-native';
import { useApp } from '../context/AppContext';
import { AppText } from './AppText';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const { theme } = useApp();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: selected ? theme.primary : theme.border,
        backgroundColor: selected ? theme.primarySoft : theme.surface,
        opacity: pressed ? 0.8 : 1
      })}
    >
      <AppText variant="caption" style={{ color: selected ? theme.primaryDark : theme.text }}>{label}</AppText>
    </Pressable>
  );
}
