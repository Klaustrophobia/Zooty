import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

type TabType = 'proximas' | 'pasadas' | 'canceladas';

const APPOINTMENTS = {
  proximas: [
    { id: '1', pro: 'Dra. Ana Martínez',  service: 'Peluquería Canina Premium', pet: 'Max', date: '6 Oct', time: '12:00 PM', status: 'confirmada', price: 47.50 },
    { id: '2', pro: 'Dr. Carlos Ruiz',    service: 'Consulta General',           pet: 'Luna', date: '10 Oct', time: '09:00 AM', status: 'pendiente',  price: 30.00 },
  ],
  pasadas: [
    { id: '3', pro: 'Carlos Paseos',      service: 'Paseo Grupal 1h',           pet: 'Rocky', date: '1 Oct', time: '07:00 AM', status: 'completada', price: 15.00 },
    { id: '4', pro: 'Spa Canino Burbujas',service: 'Baño y secado',             pet: 'Max',   date: '28 Sep', time: '03:00 PM', status: 'completada', price: 25.00 },
  ],
  canceladas: [
    { id: '5', pro: 'Guardería PetHome',  service: 'Guardería fin de semana',   pet: 'Luna', date: '20 Sep', time: '08:00 AM', status: 'cancelada',  price: 60.00 },
  ],
};

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  confirmada: { bg: '#E8F7F5', text: Colors.primary,   label: 'Confirmada' },
  pendiente:  { bg: '#FFF8E1', text: '#F59E0B',         label: 'Pendiente'  },
  completada: { bg: '#F0F0F0', text: Colors.textMedium, label: 'Completada' },
  cancelada:  { bg: '#FFE5E5', text: Colors.error,      label: 'Cancelada'  },
};

const getProfessionalIcon = (proName: string) => {
  if (proName.includes('Veterinario') || proName.includes('Dr.')) return 'medical-bag';
  if (proName.includes('Paseos')) return 'walk';
  if (proName.includes('Spa') || proName.includes('Peluquería')) return 'scissors';
  if (proName.includes('Guardería')) return 'home';
  return 'paw';
};

export default function CitasScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>('proximas');
  const appointments = APPOINTMENTS[tab];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Mis Citas</Text>
        <TouchableOpacity
          style={styles.newCitaBtn}
          onPress={() => router.push('/citas/agendar' as any)}
        >
          <Ionicons name="add" size={wp(24)} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {(['proximas', 'pasadas', 'canceladas'] as TabType[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabBtnText, tab === t && styles.tabBtnTextActive]}>
              {t === 'proximas' ? 'Próximas' : t === 'pasadas' ? 'Pasadas' : 'Canceladas'}
            </Text>
            {tab === t && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {appointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={wp(56)} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Sin citas</Text>
            <Text style={styles.emptySubtitle}>No tienes citas en esta sección</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/citas/agendar' as any)}
            >
              <Text style={styles.emptyBtnText}>Agendar una cita</Text>
            </TouchableOpacity>
          </View>
        ) : (
          appointments.map((apt) => {
            const statusStyle = STATUS_COLORS[apt.status];
            return (
              <TouchableOpacity key={apt.id} style={styles.citaCard} activeOpacity={0.8}>
                {/* Franja de color lateral */}
                <View style={[styles.citaStripe, { backgroundColor: statusStyle.text }]} />

                <View style={styles.citaContent}>
                  {/* Header de la cita */}
                  <View style={styles.citaTop}>
                    <View style={styles.proAvatar}>
                      <MaterialCommunityIcons 
                        name={getProfessionalIcon(apt.pro)} 
                        size={wp(22)} 
                        color={Colors.primary} 
                      />
                    </View>
                    <View style={styles.citaInfo}>
                      <Text style={styles.citaProName}>{apt.pro}</Text>
                      <Text style={styles.citaService}>{apt.service}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {statusStyle.label}
                      </Text>
                    </View>
                  </View>

                  {/* Detalles */}
                  <View style={styles.citaDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar-outline" size={wp(12)} color={Colors.textMedium} />
                      <Text style={styles.detailText}>{apt.date}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={wp(12)} color={Colors.textMedium} />
                      <Text style={styles.detailText}>{apt.time}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons name="paw" size={wp(12)} color={Colors.textMedium} />
                      <Text style={styles.detailText}>{apt.pet}</Text>
                    </View>
                    <Text style={styles.citaPrice}>${apt.price.toFixed(2)}</Text>
                  </View>

                  {/* Acciones */}
                  {tab === 'proximas' && (
                    <View style={styles.citaActions}>
                      <TouchableOpacity style={styles.cancelBtn}>
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rescheduleBtn}>
                        <Text style={styles.rescheduleBtnText}>Reagendar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {tab === 'pasadas' && (
                    <View style={styles.citaActions}>
                      <TouchableOpacity style={styles.rescheduleBtn}>
                        <Text style={styles.rescheduleBtnText}>Reservar de nuevo</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: hp(16) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  pageTitle:   { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark },
  newCitaBtn: {
    width: wp(40), height: wp(40), borderRadius: wp(20),
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(3) }, elevation: 4,
  },
  tabsRow: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    marginHorizontal: Spacing.lg,
  },
  tabBtn: {
    flex: 1, paddingVertical: hp(12), alignItems: 'center', position: 'relative',
  },
  tabBtnActive: {},
  tabBtnText: { fontSize: FontSize.sm, color: Colors.textLight, fontWeight: '500' },
  tabBtnTextActive: { color: Colors.primary, fontWeight: '700' },
  tabIndicator: {
    position: 'absolute', bottom: 0, left: '10%', right: '10%',
    height: hp(3), backgroundColor: Colors.primary, borderRadius: hp(2),
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  citaCard: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: Radius.lg, marginBottom: Spacing.md, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 2,
  },
  citaStripe:  { width: wp(4) },
  citaContent: { flex: 1, padding: Spacing.md },
  citaTop: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: Spacing.sm, marginBottom: Spacing.md,
  },
  proAvatar: {
    width: wp(44), height: wp(44), borderRadius: wp(12),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  citaInfo:    { flex: 1 },
  citaProName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark, marginBottom: hp(2) },
  citaService: { fontSize: FontSize.xs, color: Colors.textMedium },
  statusBadge: { paddingHorizontal: wp(8), paddingVertical: hp(4), borderRadius: Radius.full },
  statusText:  { fontSize: wp(10), fontWeight: '700' },
  citaDetails: {
    flexDirection: 'row', alignItems: 'center',
    flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm,
  },
  detailItem:  { flexDirection: 'row', alignItems: 'center', gap: wp(3) },
  detailText:  { fontSize: FontSize.xs, color: Colors.textMedium },
  citaPrice:   { marginLeft: 'auto', fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  citaActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  cancelBtn: {
    flex: 1, height: hp(36), borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  cancelBtnText:    { fontSize: FontSize.xs, color: Colors.textMedium, fontWeight: '600' },
  rescheduleBtn: {
    flex: 1, height: hp(36), borderRadius: Radius.full,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  rescheduleBtnText: { fontSize: FontSize.xs, color: Colors.white, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: hp(64) },
  emptyTitle:    { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textDark, marginBottom: Spacing.sm },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textMedium, marginBottom: Spacing.xl },
  emptyBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl, paddingVertical: hp(14),
  },
  emptyBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '600' },
});