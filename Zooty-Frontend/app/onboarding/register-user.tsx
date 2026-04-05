import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
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
    name: '', email: '', password: '', confirmPassword: '', acceptTerms: false,
  });

  const set = <K extends keyof FormState>(key: K) => (value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <LogoPlaceholder size="sm" />
          <StepBar total={3} current={1} />
        </View>

        <Text style={styles.stepLabel}>PASO 1 DE 3</Text>
        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>Información Personal</Text>

        <InputField label="Nombre completo"     placeholder="Ej. Juan Pérez"  value={form.name}            onChangeText={set('name')} />
        <InputField label="Correo electrónico"  placeholder="tu@correo.com"   value={form.email}           onChangeText={set('email')} keyboardType="email-address" />
        <InputField label="Contraseña"          placeholder="••••••••"         value={form.password}        onChangeText={set('password')} secureTextEntry />
        <InputField label="Confirmar contraseña" placeholder="••••••••"        value={form.confirmPassword} onChangeText={set('confirmPassword')} secureTextEntry />

        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => set('acceptTerms')(!form.acceptTerms)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, form.acceptTerms && styles.checkboxChecked]}>
            {form.acceptTerms && <Ionicons name="checkmark" size={wp(12)} color={Colors.white} />}
          </View>
          <Text style={styles.termsText}>
            Acepto los <Text style={styles.termsLink}>términos y condiciones</Text> de uso de Zooty.
          </Text>
        </TouchableOpacity>

        <PrimaryButton label="Siguiente" onPress={() => router.push('/onboarding/complete-profile')} />

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={wp(24)} color={Colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.white },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
    gap: Spacing.md,
  },
  stepLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textLight,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  title:    { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMedium, marginBottom: Spacing.lg },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  checkbox: {
    width: wp(20), height: wp(20),
    borderRadius: wp(4),
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    alignItems: 'center', justifyContent: 'center',
    marginTop: hp(1),
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  termsText:       { flex: 1, fontSize: FontSize.sm, color: Colors.textMedium, lineHeight: hp(20) },
  termsLink:       { color: Colors.primary, fontWeight: '600' },
  backBtn: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xl,
    width: wp(40), height: wp(40),
    borderRadius: wp(20),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
});