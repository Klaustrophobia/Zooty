import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
import StepBar from '@/components/StepBar';
import PrimaryButton from '@/components/PrimaryButton';

const ALL_SPECIALTIES = [
  'Veterinaria', 'Adiestramiento', 'Peluquería Canina',
  'Paseador', 'Guardería', 'Fisioterapia', 'Nutrición',
];

function Tag({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.tag, selected ? styles.tagOn : styles.tagOff]}
      onPress={onPress} activeOpacity={0.8}
    >
      <Text style={[styles.tagText, selected ? styles.tagTextOn : styles.tagTextOff]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function ProfessionalSpecialtyScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(['Veterinaria', 'Adiestramiento']);
  const [docs, setDocs]         = useState<string[]>(['titulo_veterinario_2023.pdf']);

  const toggle = (s: string) =>
    setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const removeDoc    = (name: string) => setDocs((prev) => prev.filter((d) => d !== name));
  const simulateUpload = () => setDocs((prev) => [...prev, `documento_${Date.now()}.pdf`]);

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
          <StepBar total={3} current={2} />
        </View>

        <Text style={styles.stepLabel}>PASO 2 DE 3</Text>
        <Text style={styles.title}>Tu Especialidad</Text>
        <Text style={styles.subtitle}>
          Selecciona las áreas en las que eres experto para que los dueños de mascotas te encuentren.
        </Text>

        <View style={styles.tagsContainer}>
          {ALL_SPECIALTIES.map((s) => (
            <Tag key={s} label={s} selected={selected.includes(s)} onPress={() => toggle(s)} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Documentación (licencias, certificados)</Text>

        <TouchableOpacity style={styles.uploadArea} onPress={simulateUpload} activeOpacity={0.8}>
          <View style={styles.uploadIconCircle}>
            <Ionicons name="cloud-upload-outline" size={wp(24)} color={Colors.primary} />
          </View>
          <Text style={styles.uploadLabel}>Cargar documentos</Text>
          <Text style={styles.uploadSub}>Formatos aceptados: JPG, PNG o PDF (Max 5MB)</Text>
        </TouchableOpacity>

        {docs.map((doc) => (
          <View key={doc} style={styles.docRow}>
            <Ionicons name="document-text-outline" size={wp(18)} color={Colors.primary} />
            <Text style={styles.docName} numberOfLines={1}>{doc}</Text>
            <TouchableOpacity onPress={() => removeDoc(doc)}>
              <Text style={styles.docRemove}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.verificationBox}>
          <Ionicons name="checkmark-circle" size={wp(20)} color={Colors.primary} style={{ marginTop: hp(2) }} />
          <View style={styles.verificationText}>
            <Text style={styles.verificationTitle}>Proceso de Verificación</Text>
            <Text style={styles.verificationBody}>
              Nuestro equipo revisará tu documentación en un plazo de{' '}
              <Text style={styles.verificationHighlight}>24 a 48 horas</Text>{' '}
              para activar tu perfil profesional.
            </Text>
          </View>
        </View>

        <PrimaryButton label="Siguiente" onPress={() => router.push('/profesional/registro/services')} />
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
    textAlign: 'center', letterSpacing: 1, marginBottom: Spacing.md,
  },
  title:    { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMedium, lineHeight: hp(21), marginBottom: Spacing.lg },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  tag: { paddingVertical: hp(8), paddingHorizontal: wp(16), borderRadius: Radius.full, borderWidth: 1.5 },
  tagOn:       { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tagOff:      { backgroundColor: Colors.white, borderColor: Colors.tagBorder },
  tagText:     { fontSize: FontSize.sm, fontWeight: '600' },
  tagTextOn:   { color: Colors.white },
  tagTextOff:  { color: Colors.textMedium },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, marginBottom: Spacing.md },
  uploadArea: {
    width: '100%', borderWidth: 2, borderColor: Colors.tagBorder,
    borderStyle: 'dashed', borderRadius: Radius.lg,
    alignItems: 'center', paddingVertical: Spacing.xl,
    marginBottom: Spacing.md, backgroundColor: '#F8FFFE',
  },
  uploadIconCircle: {
    width: wp(52), height: wp(52), borderRadius: wp(26),
    backgroundColor: '#FFE5D8',
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  uploadLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textDark, marginBottom: hp(4) },
  uploadSub:   { fontSize: FontSize.xs, color: Colors.textLight },
  docRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primaryLight, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: hp(10),
    marginBottom: Spacing.sm, gap: Spacing.sm,
  },
  docName:   { flex: 1, fontSize: FontSize.sm, color: Colors.textDark, fontWeight: '500' },
  docRemove: { color: Colors.textLight, fontSize: wp(16), fontWeight: '600' },
  verificationBox: {
    flexDirection: 'row',
    backgroundColor: Colors.verificationBg,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.verificationBorder,
    padding: Spacing.md, marginTop: Spacing.md, marginBottom: Spacing.xl,
    gap: Spacing.sm, alignItems: 'flex-start',
  },
  verificationText:      { flex: 1 },
  verificationTitle:     { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark, marginBottom: hp(4) },
  verificationBody:      { fontSize: FontSize.sm, color: Colors.textMedium, lineHeight: hp(19) },
  verificationHighlight: { fontWeight: '700', color: Colors.primary },
});