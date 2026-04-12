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

export default function CompleteProfileScreen() {
  const router = useRouter();
  const [phone, setPhone]     = useState('');
  const [address, setAddress] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={wp(24)} color={Colors.primary} />
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
            <Ionicons name="person" size={wp(40)} color={Colors.primary} style={{ opacity: 0.5 }} />
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={wp(14)} color={Colors.white} />
            </View>
          </View>
        </View>

        <InputField
          label="Teléfono de contacto"
          placeholder="+34 000 000 000"
          value={phone} 
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <View>
          <InputField
            label="Ubicación principal"
            placeholder="Introduce tu dirección o ciudad"
            value={address} 
            onChangeText={setAddress}
          />
          <TouchableOpacity style={styles.locationLink}>
            <Ionicons name="location" size={wp(10)} color={Colors.primary} />
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
            <Ionicons name="location" size={wp(28)} color={Colors.primary} />
          </View>
        </View>

        <Text style={styles.disclaimer}>
          Al continuar, aceptas que Zooty acceda a tu ubicación para mostrarte profesionales cercanos.
        </Text>

        <PrimaryButton label="Siguiente" onPress={() => router.push('/onboarding/register-pet')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.white },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  topRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: Spacing.lg, marginBottom: Spacing.xs, gap: Spacing.md,
  },
  backBtn: {
    width: wp(36), height: wp(36), borderRadius: wp(18),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  stepLabel: {
    fontSize: FontSize.xs, fontWeight: '600', color: Colors.textLight,
    textAlign: 'center', letterSpacing: 1, marginBottom: Spacing.md,
  },
  title:    { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textDark, textAlign: 'center', marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMedium, textAlign: 'center', lineHeight: hp(20), marginBottom: Spacing.xl },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatarCircle: {
    width: wp(90), height: wp(90), borderRadius: wp(45),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  cameraBtn: {
    position: 'absolute', bottom: hp(2), right: wp(2),
    width: wp(28), height: wp(28), borderRadius: wp(14),
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  locationLink: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: -Spacing.sm, marginBottom: Spacing.md, gap: wp(6),
  },
  locationText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
  mapContainer: {
    width: '100%',
    height: hp(180),
    borderRadius: Radius.lg,
    backgroundColor: Colors.mapBg || '#F0F8F6',
    overflow: 'hidden',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  mapGrid: { flex: 1, padding: wp(4), gap: hp(2) },
  mapRow:  { flex: 1, flexDirection: 'row', gap: wp(2) },
  mapCell: {
    flex: 1, borderRadius: wp(2),
    backgroundColor: 'rgba(61,191,173,0.08)',
    borderWidth: 0.5, borderColor: 'rgba(61,191,173,0.15)',
  },
  mapPinWrapper: {
    position: 'absolute', top: '50%', left: '50%',
    transform: [{ translateX: -wp(14) }, { translateY: -hp(14) }],
  },
  disclaimer: {
    fontSize: FontSize.xs, color: Colors.textLight,
    textAlign: 'center', lineHeight: hp(16),
    marginBottom: Spacing.xl, paddingHorizontal: Spacing.md,
  },
});