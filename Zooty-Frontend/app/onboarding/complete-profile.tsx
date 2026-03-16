import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import StepBar from '@/components/StepBar';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';

const { width } = Dimensions.get('window');

export default function CompleteProfileScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <StepBar total={3} current={2} />
        </View>

        <Text style={styles.stepLabel}>PASO 2 DE 3</Text>
        <Text style={styles.title}>Completa tu perfil</Text>
        <Text style={styles.subtitle}>
          Cuéntanos un poco más sobre ti para ofrecerte la mejor experiencia.
        </Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>👤</Text>
            <View style={styles.cameraBtn}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </View>
        </View>

        {/* Teléfono */}
        <InputField
          label="Teléfono de contacto"
          placeholder="+34 000 000 000"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          prefixIcon="📞"
        />

        {/* Ubicación */}
        <View style={styles.locationSection}>
          <InputField
            label="Ubicación principal"
            placeholder="Introduce tu dirección o ciudad"
            value={address}
            onChangeText={setAddress}
            prefixIcon="📍"
          />
          <TouchableOpacity style={styles.locationLink}>
            <Text style={styles.locationDot}>●</Text>
            <Text style={styles.locationText}>Usar ubicación actual</Text>
          </TouchableOpacity>
        </View>

        {/* Mapa simulado */}
        <View style={styles.mapContainer}>
          <View style={styles.mapGrid}>
            {Array.from({ length: 5 }).map((_, row) => (
              <View key={row} style={styles.mapRow}>
                {Array.from({ length: 8 }).map((_, col) => (
                  <View key={col} style={styles.mapCell} />
                ))}
              </View>
            ))}
          </View>
          <View style={styles.mapPinWrapper}>
            <Text style={styles.mapPin}>📍</Text>
          </View>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Al continuar, aceptas que Zooty acceda a tu ubicación para mostrarte profesionales cercanos.
        </Text>

        <PrimaryButton
          label="Siguiente →"
          onPress={() => router.push('/')} // ← aquí irá el paso 3 del dueño cuando lo tengas
        />
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: Colors.primary,
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 30,
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
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 36,
    opacity: 0.5,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  cameraIcon: { fontSize: 14 },
  locationSection: {
    marginBottom: Spacing.xs,
  },
  locationLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -Spacing.sm,
    marginBottom: Spacing.md,
    gap: 6,
  },
  locationDot: {
    color: Colors.primary,
    fontSize: 10,
  },
  locationText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  mapContainer: {
    width: '100%',
    height: 180,
    borderRadius: Radius.lg,
    backgroundColor: Colors.mapBg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  mapGrid: {
    flex: 1,
    padding: 4,
    gap: 2,
  },
  mapRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
  },
  mapCell: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: 'rgba(61,191,173,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(61,191,173,0.15)',
  },
  mapPinWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -24 }],
  },
  mapPin: { fontSize: 28 },
  disclaimer: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
});
