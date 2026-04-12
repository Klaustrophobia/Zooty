import Logo from '@/components/Logo';
import PrimaryButton from '@/components/PrimaryButton';
import { hp, wp, SCREEN_HEIGHT } from '@/constants/Responsive';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function OnboardingDots({ total = 3, active = 0 }: { total?: number; active?: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i === active ? styles.dotActive : styles.dotInactive]} />
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Saltar */}
      <TouchableOpacity style={styles.skipBtn} onPress={() => router.push('/(auth)/role-selection')}>
        <Text style={styles.skipText}>Saltar</Text>
      </TouchableOpacity>

      {/* Círculo decorativo */}
      <View style={styles.bgCircle} />

      {/* Logo - Tamaño responsive que no afecta otros elementos */}
      <View style={styles.logoWrapper}>
        <Logo size="xxxl" />
      </View>

      {/* Copy */}
      <View style={styles.copy}>
        <Text style={styles.headline}>
          Conectamos a dueños de{'\n'}mascotas con los mejores{'\n'}profesionales
        </Text>
        <Text style={styles.subheadline}>
          Veterinarios, peluqueros y cuidadores a{'\n'}un solo toque de distancia.
        </Text>
      </View>

      {/* Dots */}
      <OnboardingDots total={3} active={0} />

      {/* CTA */}
      <View style={styles.ctaWrapper}>
        <PrimaryButton label="Continuar" onPress={() => router.push('/(auth)/role-selection')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  skipBtn: {
    alignSelf: 'flex-end',
    marginTop: Spacing.md,
    marginRight: Spacing.lg,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  skipText: {
    color: Colors.primary,
    fontSize: FontSize.md, // Mantener tamaño original del tema
    fontWeight: '500',
  },
  bgCircle: {
    position: 'absolute',
    top: hp(-60),
    width: '110%',
    aspectRatio: 1,
    borderRadius: 9999,
    backgroundColor: '#D6F0EC',
    opacity: 0.45,
    zIndex: 0,
  },
  logoWrapper: {
    marginTop: SCREEN_HEIGHT * 0.06, // 6% de la altura - ajustable sin afectar otros elementos
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl, // Restaurado al valor original
  },
  headline: {
    fontSize: FontSize.xxl, // Mantener tamaño original del tema
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: hp(34),
    marginBottom: Spacing.md,
  },
  subheadline: {
    fontSize: FontSize.sm, // Mantener tamaño original del tema
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: hp(22),
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: wp(6),
  },
  dot: {
    height: hp(8),
    borderRadius: hp(4),
  },
  dotActive: {
    width: wp(24),
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: wp(8),
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    opacity: 0.5,
  },
  ctaWrapper: {
    width: '88%',
    marginBottom: Spacing.xl,
  },
});