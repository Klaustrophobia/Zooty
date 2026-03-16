import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import StepBar from '@/components/StepBar';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';
import LogoPlaceholder from '@/components/LogoPlaceholder';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export default function RegisterUserScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const set =
    <K extends keyof FormState>(key: K) =>
    (value: FormState[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header: logo + barra de pasos */}
        <View style={styles.topRow}>
          {/* 👇 REEMPLAZA POR: <ZootyLogo width={40} height={40} /> */}
          <LogoPlaceholder size="sm" />
          <StepBar total={3} current={1} />
        </View>

        <Text style={styles.stepLabel}>PASO 1 DE 3</Text>
        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>Información Personal</Text>

        {/* Campos */}
        <InputField
          label="Nombre completo"
          placeholder="Ej. Juan Pérez"
          value={form.name}
          onChangeText={set('name')}
        />
        <InputField
          label="Correo electrónico"
          placeholder="tu@correo.com"
          value={form.email}
          onChangeText={set('email')}
          keyboardType="email-address"
        />
        <InputField
          label="Contraseña"
          placeholder="••••••••"
          value={form.password}
          onChangeText={set('password')}
          secureTextEntry
        />
        <InputField
          label="Confirmar contraseña"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChangeText={set('confirmPassword')}
          secureTextEntry
        />

        {/* Términos y condiciones */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => set('acceptTerms')(!form.acceptTerms)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, form.acceptTerms && styles.checkboxChecked]}>
            {form.acceptTerms && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={styles.termsText}>
            Acepto los{' '}
            <Text style={styles.termsLink}>términos y condiciones</Text>
            {' '}de uso de Zooty.
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          label="Siguiente"
          onPress={() => router.push('/onboarding/complete-profile')}
        />

        {/* Botón atrás */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
    gap: Spacing.md,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textLight,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMedium,
    marginBottom: Spacing.lg,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkMark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textMedium,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
});
