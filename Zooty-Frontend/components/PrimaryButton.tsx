import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, FontSize } from '../constants/theme';
import { hp } from '../constants/Responsive';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function PrimaryButton({ label, onPress, style, disabled }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.buttonDisabled]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: hp(54),
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.32,
    shadowRadius: hp(10),
    shadowOffset: { width: 0, height: hp(4) },
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: Colors.stepPending || '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
});