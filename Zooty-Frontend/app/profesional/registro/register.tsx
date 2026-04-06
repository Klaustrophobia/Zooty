import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
import StepBar from '@/components/StepBar';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';

const SERVICE_OPTIONS = [
  'Veterinaria', 'Peluquería Canina', 'Adiestramiento',
  'Paseador', 'Guardería', 'Fisioterapia', 'Nutrición',
];

function SelectField({
  label, placeholder, value, onSelect,
}: { label: string; placeholder: string; value: string; onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.selectWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.8}
      >
        <Text style={value ? styles.selectValue : styles.selectPlaceholder}>
          {value || placeholder}
        </Text>
        <Text style={styles.chevron}>⌄</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          {SERVICE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt} style={styles.dropdownItem}
              onPress={() => { onSelect(opt); setOpen(false); }}
            >
              <Text style={[styles.dropdownText, value === opt && styles.dropdownSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function RegisterProfessionalScreen() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [serviceType, setServiceType]   = useState('');
  const [address, setAddress]           = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <StepBar total={3} current={1} />
        </View>

        <Text style={styles.stepLabel}>PASO 1 DE 3</Text>
        <Text style={styles.title}>Regístrate como{'\n'}Profesional</Text>
        <Text style={styles.subtitle}>
          Comencemos con lo básico sobre tu negocio. Esta información ayudará a los dueños de mascotas a encontrarte.
        </Text>

        <InputField
          label="Nombre del negocio"
          placeholder="Ej. Clínica Veterinaria San José"
          value={businessName} onChangeText={setBusinessName}
        />
        <SelectField
          label="Tipo de servicio" placeholder="Selecciona una opción"
          value={serviceType} onSelect={setServiceType}
        />
        <InputField
          label="Dirección"
          placeholder="Calle, número, departamento y ciudad"
          value={address} onChangeText={setAddress}
          multiline numberOfLines={3}
        />

        <PrimaryButton
          label="Siguiente →"
          onPress={() => router.push('/professional/specialty')}
          style={styles.cta}
        />
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
  backIcon:  { color: Colors.primary, fontSize: wp(26), fontWeight: '300', lineHeight: hp(30) },
  stepLabel: {
    fontSize: FontSize.xs, fontWeight: '600', color: Colors.textLight,
    textAlign: 'center', letterSpacing: 1, marginBottom: Spacing.lg,
  },
  title:    { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark, lineHeight: hp(36), marginBottom: Spacing.sm },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMedium, lineHeight: hp(21), marginBottom: Spacing.lg },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textDark, marginBottom: hp(6) },
  selectWrapper: { marginBottom: Spacing.md, zIndex: 10 },
  selectBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md, height: hp(50),
  },
  selectValue:       { fontSize: FontSize.md, color: Colors.textDark },
  selectPlaceholder: { fontSize: FontSize.md, color: Colors.primary },
  chevron:           { color: Colors.primary, fontSize: wp(20) },
  dropdown: {
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.borderLight, marginTop: hp(4),
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 8,
  },
  dropdownItem: {
    paddingVertical: hp(13), paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#F0F7F6',
  },
  dropdownText:     { fontSize: FontSize.md, color: Colors.textDark },
  dropdownSelected: { color: Colors.primary, fontWeight: '600' },
  cta:              { marginTop: Spacing.lg },
});