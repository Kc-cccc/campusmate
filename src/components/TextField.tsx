import React from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { useApp } from '../context/AppContext';
import { AppText } from './AppText';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function TextField({ label, error, style, ...props }: TextFieldProps) {
  const { theme } = useApp();
  return (
    <View style={styles.wrapper}>
      <AppText variant="label" style={{ marginBottom: 8 }}>{label}</AppText>
      <TextInput
        {...props}
        placeholderTextColor={theme.textMuted}
        style={[
          styles.input,
          theme.typography.body,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.danger : theme.border,
            color: theme.text
          },
          style
        ]}
      />
      {error ? <AppText variant="caption" style={{ color: theme.danger, marginTop: 6 }}>{error}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12
  }
});
