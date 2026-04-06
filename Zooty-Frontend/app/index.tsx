import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
import LogoPlaceholder from '@/components/LogoPlaceholder';
import PrimaryButton from '@/components/PrimaryButton';

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
      <TouchableOpacity style={styles.skipBtn} onPress={() => router.push('/role-selection')}>
        <Text style={styles.skipText}>Saltar</Text>
      </TouchableOpacity>

      {/* Círculo decorativo */}
      <View style={styles.bgCircle} />

      {/* Logo */}
      <View style={styles.logoWrapper}>
        {/* 👇 REEMPLAZA POR: <ZootyLogo width={wp(120)} height={wp(120)} /> */}
        <LogoPlaceholder size="lg" />
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
        <PrimaryButton label="Continuar" onPress={() => router.push('/role-selection')} />
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
    fontSize: FontSize.md,
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
    marginTop: '18%',
    zIndex: 1,
  },
  copy: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
  },
  headline: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: hp(34),
    marginBottom: Spacing.md,
  },
  subheadline: {
    fontSize: FontSize.sm,
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