import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
import StepBar from '@/components/StepBar';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';

const PET_TYPES = [
  { id: 'dog', label: 'Perro', icon: 'dog' },
  { id: 'cat', label: 'Gato', icon: 'cat' },
  { id: 'bird', label: 'Ave', icon: 'bird' },
  { id: 'other', label: 'Otro', icon: 'paw' },
];

export default function RegisterPetScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [petType, setPetType] = useState('dog');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');

  const handleFinish = async () => {
    setLoading(true);
    // Simular guardado
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);

    router.replace({
      pathname: '/login',
      params: {
        registrationSuccess: 'true',
        message: '¡Registro exitoso! Te hemos enviado un correo para activar tu cuenta. Por favor verifica tu bandeja de entrada.'
      }
    });
  };

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
          <StepBar total={3} current={3} />
        </View>

        <Text style={styles.stepLabel}>PASO 3 DE 3</Text>
        <Text style={styles.title}>Cuéntanos sobre{'\n'}tu mascota</Text>
        <Text style={styles.subtitle}>
          Queremos conocer a tu mejor amigo para ofrecerle el mejor cuidado posible.
        </Text>

        <Text style={styles.sectionLabel}>TIPO DE MASCOTA</Text>
        <View style={styles.typeRow}>
          {PET_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.typeCard, petType === type.id && styles.typeCardActive]}
              onPress={() => setPetType(type.id)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name={type.icon as any} 
                size={wp(32)} 
                color={petType === type.id ? Colors.white : Colors.primary} 
              />
              <Text style={[styles.typeLabel, petType === type.id && styles.typeLabelActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <InputField
          label="Nombre de tu mascota"
          placeholder="Ej: Max, Luna..."
          value={name}
          onChangeText={setName}
        />

        <InputField
          label="Raza (Opcional)"
          placeholder="Ej: Golden Retriever, Siamés..."
          value={breed}
          onChangeText={setBreed}
        />

        <InputField
          label="Edad aproximada"
          placeholder="Ej: 2 años, 6 meses..."
          value={age}
          onChangeText={setAge}
        />

        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoCircle}>
            <Ionicons name="camera" size={wp(30)} color={Colors.primary} />
            <Text style={styles.photoText}>Añadir foto</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton 
          label={loading ? "Guardando..." : "Finalizar registro"} 
          onPress={handleFinish}
          disabled={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
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
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark, lineHeight: hp(36), marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMedium, lineHeight: hp(21), marginBottom: Spacing.lg },
  sectionLabel: {
    fontSize: FontSize.xs, fontWeight: '700', color: Colors.textDark,
    letterSpacing: 1, marginBottom: Spacing.md,
  },
  typeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  typeCard: {
    width: wp(74), height: wp(86), borderRadius: Radius.md,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center', gap: hp(6),
  },
  typeCardActive: {
    backgroundColor: Colors.primary, borderColor: Colors.primary,
    shadowColor: Colors.primary, shadowOpacity: 0.2, shadowRadius: 8,
    elevation: 4,
  },
  typeLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textMedium },
  typeLabelActive: { color: Colors.white },
  photoSection: {
    alignItems: 'center', marginVertical: Spacing.lg,
  },
  photoCircle: {
    width: wp(100), height: wp(100), borderRadius: wp(50),
    backgroundColor: Colors.primaryLight, borderStyle: 'dashed',
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  photoText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600', marginTop: hp(4) },
});
