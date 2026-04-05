import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardTypeOptions,
} from 'react-native';
import { Colors, Radius, Spacing, FontSize } from '../constants/theme';
import { hp, wp } from '../constants/Responsive';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  prefixIcon?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  prefixIcon,
  multiline = false,
  numberOfLines,
}: InputFieldProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.container, multiline && styles.containerMultiline]}>
        
        {prefixIcon ? <Text style={styles.prefixIcon}>{prefixIcon}</Text> : null}

        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPass}
          keyboardType={keyboardType}
          autoCapitalize="none"
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPass((v) => !v)}
            style={styles.eyeBtn}
          >
            <Text style={styles.toggleText}>
              {showPass ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },

  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: hp(6),
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    paddingHorizontal: Spacing.md,
    height: hp(50),
    gap: Spacing.sm,
  },

  containerMultiline: {
    height: hp(90),
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
  },

  prefixIcon: {
    fontSize: wp(16),
  },

  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textDark,
  },

  inputMultiline: {
    height: hp(70),
  },

  eyeBtn: {
    padding: wp(4),
  },

  toggleText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
});