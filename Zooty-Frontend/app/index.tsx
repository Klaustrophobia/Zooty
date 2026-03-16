import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import LogoPlaceholder from '@/components/LogoPlaceholder';
import PrimaryButton from '@/components/PrimaryButton';

const { width } = Dimensions.get('window');

function OnboardingDots({ total = 3, active = 0 }: { total?: number; active?: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i === active ? styles.dotActive : styles.dotInactive]}
        />
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Saltar */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => router.push('/role-selection')}
      >
        <Text style={styles.skipText}>Saltar</Text>
      </TouchableOpacity>

      {/* Círculo decorativo de fondo */}
      <View style={styles.bgCircle} />

      {/* Logo */}
      <View style={styles.logoWrapper}>
        {/* 👇 REEMPLAZA POR: <ZootyLogo width={120} height={120} /> */}
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
      <PrimaryButton
        label="Continuar"
        onPress={() => router.push('/role-selection')}
        style={styles.cta}
      />
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
    fontSize: 15,
    fontWeight: '500',
  },
  bgCircle: {
    position: 'absolute',
    top: -60,
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: width * 0.55,
    backgroundColor: '#D6F0EC',
    opacity: 0.45,
    zIndex: 0,
  },
  logoWrapper: {
    marginTop: Spacing.xl * 1.8,
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
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: Spacing.md,
  },
  subheadline: {
    fontSize: 14,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    opacity: 0.5,
  },
  cta: {
    width: width - Spacing.lg * 2,
    marginBottom: Spacing.xl,
  },
});
