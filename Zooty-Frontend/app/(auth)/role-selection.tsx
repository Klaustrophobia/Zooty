import Logo from '@/components/Logo';
import PrimaryButton from '@/components/PrimaryButton';
import { hp, wp, SCREEN_HEIGHT } from '@/constants/Responsive';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { UserRole } from '@/types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RoleCardProps {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

function RoleCard({ icon, title, description, selected, onPress }: RoleCardProps) {
  const getIcon = () => {
    if (icon === 'paw') {
      return <MaterialCommunityIcons name="paw" size={wp(24)} color={selected ? Colors.white : Colors.primary} />;
    }
    return <Ionicons name="briefcase-outline" size={wp(24)} color={selected ? Colors.white : Colors.primary} />;
  };

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, selected && styles.iconCircleSelected]}>
        {getIcon()}
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
    router.push(role === 'owner' ? '/onboarding/register-user' : '/profesional/registro/register');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Logo */}
      <View style={styles.header}>
        <Logo size="lg" />
      </View>

      <Text style={styles.title}>¿Cómo quieres usar{'\n'}Zooty?</Text>

      {/* Tarjetas */}
      <View style={styles.cards}>
        <RoleCard
          icon="paw"
          title="Dueño de Mascota"
          description="Busca servicios para el cuidado de tu mascota"
          selected={role === 'owner'} 
          onPress={() => setRole('owner')}
        />
        <RoleCard
          icon="briefcase"
          title="Profesional"
          description="Ofrece tus servicios a dueños de mascotas"
          selected={role === 'professional'} 
          onPress={() => setRole('professional')}
        />
      </View>

      {/* Imagen decorativa */}
      <View style={styles.dogWrapper}>
        <View style={styles.dogPlaceholder}>
          <MaterialCommunityIcons name="dog" size={wp(44)} color={Colors.textLight} />
          <Text style={styles.dogNote}>Imagen decorativa</Text>
        </View>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 1 ? styles.dotActive : styles.dotInactive]} />
        ))}
      </View>

      <View style={styles.ctaWrapper}>
        <PrimaryButton label="Continuar" onPress={handleContinue} />
      </View>

      <TouchableOpacity style={styles.loginRow} onPress={() => router.push('./login')}>
        <Text style={styles.loginText}>
          ¿Ya tienes cuenta? <Text style={styles.loginLink}>Inicia sesión</Text>
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
    marginTop: SCREEN_HEIGHT * 0.05, // 5% de la altura - ajustable
    marginBottom: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.xxxl, // Mantener tamaño original del tema
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    lineHeight: hp(36),
  },
  cards: { 
    width: '100%', 
    gap: Spacing.md 
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
    shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 2,
    gap: Spacing.md,
  },
  cardSelected: { 
    borderColor: Colors.primary, 
    backgroundColor: '#F0FAF8' 
  },
  iconCircle: {
    width: wp(48), 
    height: wp(48), 
    borderRadius: wp(24),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  iconCircleSelected: { 
    backgroundColor: Colors.primary 
  },
  cardText: { 
    flex: 1 
  },
  cardTitle: {
    fontSize: FontSize.md, // Mantener tamaño original del tema
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: hp(2),
  },
  cardTitleSelected: { 
    color: Colors.primary 
  },
  cardDesc: {
    fontSize: FontSize.xs, // Mantener tamaño original del tema
    color: Colors.textMedium,
    lineHeight: hp(18),
  },
  dogWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dogPlaceholder: {
    width: '100%',
    height: hp(130),
    borderRadius: Radius.lg,
    backgroundColor: '#E8F0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  dogNote: { 
    color: Colors.textLight, 
    fontSize: FontSize.xs, // Mantener tamaño original del tema
    marginTop: hp(4) 
  },
  dots: { 
    flexDirection: 'row', 
    gap: wp(6), 
    marginBottom: Spacing.md 
  },
  dot: { 
    height: hp(8), 
    borderRadius: hp(4) 
  },
  dotActive: { 
    width: wp(24), 
    backgroundColor: Colors.primary 
  },
  dotInactive: { 
    width: wp(8), 
    backgroundColor: Colors.stepPending 
  },
  ctaWrapper: { 
    width: '100%', 
    marginBottom: Spacing.md 
  },
  loginRow: { 
    marginBottom: Spacing.xl 
  },
  loginText: { 
    fontSize: FontSize.sm, // Mantener tamaño original del tema
    color: Colors.textMedium 
  },
  loginLink: { 
    color: Colors.primary, 
    fontWeight: '600' 
  },
});