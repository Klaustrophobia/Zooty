/**
 * app/pro-tabs/perfil.tsx
 * Perfil del profesional. Sin emojis ni dependencias externas.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

type MenuItem = { icon: string; label: string };

const SECTIONS: { title: string; items: MenuItem[] }[] = [
  {
    title: 'NEGOCIO',
    items: [
      { icon: 'business',       label: 'Información del negocio' },
      { icon: 'calendar-clock', label: 'Horarios de atención' },
      { icon: 'star',           label: 'Mis reseñas' },
    ],
  },
  {
    title: 'PAGOS',
    items: [
      { icon: 'credit-card', label: 'Cuenta de retiro' },
      { icon: 'trending-up', label: 'Historial de pagos' },
    ],
  },
  {
    title: 'PREFERENCIAS',
    items: [
      { icon: 'notifications',      label: 'Notificaciones' },
      { icon: 'shield-checkmark',   label: 'Privacidad y seguridad' },
      { icon: 'settings',           label: 'Configuración general' },
    ],
  },
];

function getIcon(iconName: string, size: number, color: string) {
  switch (iconName) {
    case 'business':
      return <MaterialCommunityIcons name="storefront" size={size} color={color} />;
    case 'calendar-clock':
      return <MaterialCommunityIcons name="calendar-clock" size={size} color={color} />;
    case 'star':
      return <Ionicons name="star" size={size} color={color} />;
    case 'credit-card':
      return <Ionicons name="card" size={size} color={color} />;
    case 'trending-up':
      return <Ionicons name="trending-up" size={size} color={color} />;
    case 'notifications':
      return <Ionicons name="notifications" size={size} color={color} />;
    case 'shield-checkmark':
      return <Ionicons name="shield-checkmark" size={size} color={color} />;
    case 'settings':
      return <Ionicons name="settings" size={size} color={color} />;
    default:
      return <Ionicons name="help" size={size} color={color} />;
  }
}

export default function ProPerfilScreen() {
  const router    = useRouter();
  const [available, setAvailable] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Perfil</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={wp(16)} color={Colors.primary} />
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Card de perfil */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>AV</Text>
            </View>
            <View style={[styles.statusRing, { borderColor: available ? '#34D399' : Colors.textLight }]} />
          </View>

          <View style={styles.profileMeta}>
            <Text style={styles.proName}>Dr. Alejandro V.</Text>
            <Text style={styles.proSpecialty}>Veterinario  ·  Clínica VetPro</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={wp(13)} color="#F4A536" />
              <Text style={styles.ratingVal}>4.9</Text>
              <Text style={styles.ratingCount}>(127 reseñas)</Text>
            </View>
          </View>
        </View>

        {/* Toggle disponibilidad */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleLeft}>
            <View style={[styles.availDot, { backgroundColor: available ? '#34D399' : Colors.borderLight }]} />
            <View>
              <Text style={styles.toggleLabel}>
                {available ? 'Disponible' : 'No disponible'}
              </Text>
              <Text style={styles.toggleSub}>
                {available ? 'Recibiendo nuevas citas' : 'No recibirás nuevas citas'}
              </Text>
            </View>
          </View>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{ false: Colors.stepPending, true: Colors.primary }}
            thumbColor={Colors.white}
            ios_backgroundColor={Colors.stepPending}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total citas', value: '248' },
            { label: 'Este mes',    value: '32' },
            { label: 'Calificación',value: '4.9' },
          ].map(({ label, value }) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statVal}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Menú */}
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuItem, idx < section.items.length - 1 && styles.menuItemBorder]}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIconBg}>
                      {getIcon(item.icon, wp(17), Colors.primary)}
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(15)} color={Colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace('/login' as any)}
        >
          <Ionicons name="log-out-outline" size={wp(18)} color={Colors.error} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Zooty Pro  ·  v1.0.0</Text>
        <View style={{ height: hp(32) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  pageTitle: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark, letterSpacing: -0.5 },
  editBtn:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.sm, paddingVertical: hp(4) },
  editText:  { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md, gap: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: wp(12),
    shadowOffset: { width: 0, height: hp(3) }, elevation: 3,
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: wp(72), height: wp(72), borderRadius: wp(36),
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: { color: Colors.white, fontSize: wp(26), fontWeight: '800', letterSpacing: 1 },
  statusRing: {
    position: 'absolute', inset: -wp(3),
    width: wp(78), height: wp(78), borderRadius: wp(39),
    borderWidth: 2.5,
  },
  profileMeta: { flex: 1 },
  proName:      { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textDark, marginBottom: hp(3) },
  proSpecialty: { fontSize: FontSize.xs, color: Colors.textMedium, marginBottom: hp(6) },
  ratingRow:    { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
  ratingVal:    { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark },
  ratingCount:  { fontSize: FontSize.xs, color: Colors.textLight },

  toggleCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: wp(6), shadowOffset: { width: 0, height: hp(2) }, elevation: 1,
  },
  toggleLeft:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  availDot:    { width: wp(12), height: wp(12), borderRadius: wp(6) },
  toggleLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark },
  toggleSub:   { fontSize: FontSize.xs, color: Colors.textMedium, marginTop: hp(2) },

  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.03,
    shadowRadius: wp(4), shadowOffset: { width: 0, height: hp(1) }, elevation: 1,
  },
  statVal:   { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, marginBottom: hp(3) },
  statLabel: { fontSize: wp(10), color: Colors.textMedium, textAlign: 'center' },

  menuSection:      { marginBottom: Spacing.md },
  menuSectionTitle: { fontSize: wp(10), fontWeight: '700', color: Colors.textLight, letterSpacing: 0.8, marginBottom: Spacing.sm, marginLeft: Spacing.xs },
  menuCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: wp(6), shadowOffset: { width: 0, height: hp(2) }, elevation: 1,
  },
  menuItem:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F4F6' },
  menuItemLeft:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  menuIconBg:     { width: wp(36), height: wp(36), borderRadius: wp(10), backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  menuLabel:      { fontSize: FontSize.md, color: Colors.textDark, fontWeight: '500' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FEE2E2', borderRadius: Radius.lg,
    paddingVertical: Spacing.md, gap: Spacing.sm, marginBottom: Spacing.sm,
  },
  logoutText: { fontSize: FontSize.md, color: Colors.error, fontWeight: '700' },
  version:    { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textLight },
});