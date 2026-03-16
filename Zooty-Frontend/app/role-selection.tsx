import React, { useState } from 'react';
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
import { UserRole } from '@/types';
import LogoPlaceholder from '@/components/LogoPlaceholder';
import PrimaryButton from '@/components/PrimaryButton';

const { width } = Dimensions.get('window');

interface RoleCardProps {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

function RoleCard({ icon, title, description, selected, onPress }: RoleCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, selected && styles.iconCircleSelected]}>
        <Text style={styles.iconEmoji}>{icon}</Text>
      </View>
      <View style={styles.cardText}>
        <Text style={[styles.cardTitle, selected && styles.cardTitleSelected]}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('owner');

  const handleContinue = () => {
    if (role === 'owner') {
      router.push('/onboarding/register-user');
    } else {
      router.push('/professional/register');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Logo */}
      <View style={styles.header}>
        {/* 👇 REEMPLAZA POR: <ZootyLogo width={56} height={56} /> */}
        <LogoPlaceholder size="md" />
      </View>

      <Text style={styles.title}>¿Cómo quieres usar{'\n'}Zooty?</Text>

      {/* Tarjetas */}
      <View style={styles.cards}>
        <RoleCard
          icon="🐾"
          title="Dueño de Mascota"
          description="Busca servicios para el cuidado de tu mascota"
          selected={role === 'owner'}
          onPress={() => setRole('owner')}
        />
        <RoleCard
          icon="💼"
          title="Profesional"
          description="Ofrece tus servicios a dueños de mascotas"
          selected={role === 'professional'}
          onPress={() => setRole('professional')}
        />
      </View>

      {/* Imagen decorativa */}
      <View style={styles.dogWrapper}>
        <View style={styles.dogPlaceholder}>
          <Text style={styles.dogEmoji}>🐕</Text>
          <Text style={styles.dogNote}>Imagen decorativa</Text>
        </View>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 1 ? styles.dotActive : styles.dotInactive]} />
        ))}
      </View>

      {/* CTA */}
      <PrimaryButton
        label="Continuar →"
        onPress={handleContinue}
        style={styles.cta}
      />

      {/* Login link */}
      <TouchableOpacity style={styles.loginRow} onPress={() => router.push('/')}>
        <Text style={styles.loginText}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.loginLink}>Inicia sesión</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    lineHeight: 36,
  },
  cards: {
    width: '100%',
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: Spacing.md,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FAF8',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: {
    backgroundColor: Colors.primary,
  },
  iconEmoji: { fontSize: 22 },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 2,
  },
  cardTitleSelected: { color: Colors.primary },
  cardDesc: {
    fontSize: 13,
    color: Colors.textMedium,
    lineHeight: 18,
  },
  dogWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dogPlaceholder: {
    width: '100%',
    height: 130,
    borderRadius: Radius.lg,
    backgroundColor: '#E8F0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  dogEmoji: { fontSize: 44 },
  dogNote: { color: Colors.textLight, fontSize: 11, marginTop: 4 },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
  },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  dotInactive: { width: 8, backgroundColor: Colors.stepPending },
  cta: { marginBottom: Spacing.md },
  loginRow: { marginBottom: Spacing.xl },
  loginText: { fontSize: 13, color: Colors.textMedium },
  loginLink: { color: Colors.primary, fontWeight: '600' },
});
