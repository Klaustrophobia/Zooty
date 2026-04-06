import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
import { Service, WeekSchedule } from '@/types';
import StepBar from '@/components/StepBar';
import PrimaryButton from '@/components/PrimaryButton';

const DURATION_OPTIONS = ['30 min', '1 hora', '1.5 horas', '2 horas', '3 horas'];

const DAYS = [
  { key: 'L', label: 'Lunes' },
  { key: 'M', label: 'Martes' },
  { key: 'X', label: 'Miércoles' },
  { key: 'J', label: 'Jueves' },
  { key: 'V', label: 'Viernes' },
  { key: 'S', label: 'Sábado' },
  { key: 'D', label: 'Domingo' },
];

const INITIAL_SCHEDULE: WeekSchedule = {
  L: { enabled: true,  from: '09:00', to: '18:00' },
  M: { enabled: false, from: '09:00', to: '18:00' },
  X: { enabled: false, from: '09:00', to: '18:00' },
  J: { enabled: false, from: '09:00', to: '18:00' },
  V: { enabled: true,  from: '09:00', to: '16:00' },
  S: { enabled: false, from: '09:00', to: '14:00' },
  D: { enabled: false, from: '10:00', to: '14:00' },
};

function DurationPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <TouchableOpacity
        style={styles.durationSelector}
        onPress={() => setOpen((v) => !v)} activeOpacity={0.8}
      >
        <Text style={styles.durationValue}>{value}</Text>
        <Text style={styles.chevron}>⌄</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.durationDropdown}>
          {DURATION_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt} style={styles.durationOption}
              onPress={() => { onChange(opt); setOpen(false); }}
            >
              <Text style={[styles.durationOptionText, value === opt && styles.durationSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ProfessionalServicesScreen() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: '', duration: '1 hora', price: '' },
  ]);
  const [schedule, setSchedule] = useState<WeekSchedule>(INITIAL_SCHEDULE);

  const addService = () =>
    setServices((prev) => [...prev, { id: Date.now(), name: '', duration: '1 hora', price: '' }]);

  const updateService = <K extends keyof Service>(id: number, field: K, value: Service[K]) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const removeService = (id: number) =>
    setServices((prev) => prev.filter((s) => s.id !== id));

  const toggleDay = (key: string) =>
    setSchedule((prev) => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));

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
          <StepBar total={3} current={3} />
        </View>

        <Text style={styles.stepLabel}>PASO 3 DE 3</Text>
        <Text style={styles.title}>Configura tus{'\n'}servicios</Text>
        <Text style={styles.subtitle}>
          Define los servicios que ofreces a las mascotas y tus horarios de disponibilidad.
        </Text>

        {/* Servicios */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🐾</Text>
          <Text style={styles.sectionTitle}>Servicios</Text>
        </View>

        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            {services.length > 1 && (
              <TouchableOpacity style={styles.removeBadge} onPress={() => removeService(service.id)}>
                <Text style={styles.removeBadgeText}>✕</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.smallLabel}>NOMBRE DEL SERVICIO</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="Ej: Peluquería Canina Completa"
                placeholderTextColor={Colors.placeholder}
                value={service.name}
                onChangeText={(v) => updateService(service.id, 'name', v)}
              />
            </View>
            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <Text style={styles.smallLabel}>DURACIÓN</Text>
                <DurationPicker
                  value={service.duration}
                  onChange={(v) => updateService(service.id, 'duration', v)}
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.smallLabel}>PRECIO</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currency}>$</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00" placeholderTextColor={Colors.placeholder}
                    value={service.price}
                    onChangeText={(v) => updateService(service.id, 'price', v)}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addServiceBtn} onPress={addService} activeOpacity={0.7}>
          <Text style={styles.addServiceText}>⊕ Añadir otro servicio</Text>
        </TouchableOpacity>

        {/* Horarios */}
        <View style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>
          <Text style={styles.sectionIcon}>🕐</Text>
          <Text style={styles.sectionTitle}>Horarios de atención</Text>
        </View>

        {DAYS.map(({ key, label }) => {
          const day = schedule[key];
          return (
            <View key={key} style={styles.scheduleRow}>
              <View style={[styles.dayBadge, day.enabled && styles.dayBadgeOn]}>
                <Text style={[styles.dayKey, day.enabled && styles.dayKeyOn]}>{key}</Text>
              </View>
              <View style={styles.dayInfo}>
                <Text style={styles.dayLabel}>{label}</Text>
                {day.enabled && <Text style={styles.dayHours}>{day.from}    {day.to}</Text>}
              </View>
              <Switch
                value={day.enabled} onValueChange={() => toggleDay(key)}
                trackColor={{ false: Colors.stepPending, true: Colors.primary }}
                thumbColor={Colors.white} ios_backgroundColor={Colors.stepPending}
              />
            </View>
          );
        })}

        <Text style={styles.scheduleNote}>
          PUEDES EDITAR HORARIOS ESPECÍFICOS POR DÍA MÁS TARDE
        </Text>

        <PrimaryButton label="Finalizar registro →" onPress={() => router.push('/')} />
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
  title:    { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark, lineHeight: hp(36), marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMedium, lineHeight: hp(21), marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  sectionIcon:   { fontSize: wp(18) },
  sectionTitle:  { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark },
  serviceCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    padding: Spacing.md, marginBottom: Spacing.md, position: 'relative',
  },
  removeBadge: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    width: wp(24), height: wp(24), borderRadius: wp(12),
    backgroundColor: '#FFE5E5',
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  removeBadgeText: { color: Colors.error, fontSize: wp(12), fontWeight: '700' },
  smallLabel: {
    fontSize: FontSize.xs, fontWeight: '700', color: Colors.textLight,
    letterSpacing: 0.8, marginBottom: hp(6),
  },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md, height: hp(46), marginBottom: Spacing.sm,
  },
  currency:   { color: Colors.textMedium, fontSize: FontSize.md, marginRight: wp(4) },
  input:      { flex: 1, fontSize: FontSize.md, color: Colors.textDark },
  rowFields:  { flexDirection: 'row', gap: Spacing.sm },
  halfField:  { flex: 1 },
  durationSelector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md, height: hp(46),
  },
  durationValue:   { fontSize: FontSize.sm, color: Colors.textDark },
  chevron:         { color: Colors.primary, fontSize: wp(18) },
  durationDropdown: {
    position: 'absolute', top: hp(48), left: 0, right: 0, zIndex: 999,
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    shadowColor: '#000', shadowOpacity: 0.08,
    shadowRadius: wp(8), shadowOffset: { width: 0, height: hp(2) }, elevation: 10,
  },
  durationOption: {
    paddingVertical: hp(10), paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#F0F7F6',
  },
  durationOptionText: { fontSize: FontSize.sm, color: Colors.textDark },
  durationSelected:   { color: Colors.primary, fontWeight: '700' },
  addServiceBtn: {
    alignItems: 'center', paddingVertical: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.tagBorder,
    borderStyle: 'dashed', borderRadius: Radius.lg, marginBottom: Spacing.md,
  },
  addServiceText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },
  scheduleRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: hp(10),
    borderBottomWidth: 1, borderBottomColor: '#F0F7F6', gap: Spacing.md,
  },
  dayBadge: {
    width: wp(32), height: wp(32), borderRadius: wp(8),
    backgroundColor: '#F0F7F6', alignItems: 'center', justifyContent: 'center',
  },
  dayBadgeOn: { backgroundColor: Colors.primaryLight },
  dayKey:     { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textLight },
  dayKeyOn:   { color: Colors.primary },
  dayInfo:    { flex: 1 },
  dayLabel:   { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textDark },
  dayHours:   { fontSize: FontSize.xs, color: Colors.textMedium, marginTop: hp(2) },
  scheduleNote: {
    fontSize: FontSize.xs, color: Colors.textLight, textAlign: 'center',
    letterSpacing: 0.5, marginTop: Spacing.md, marginBottom: Spacing.xl,
  },
});