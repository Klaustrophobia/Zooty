/**
 * app/pro-tabs/calendario.tsx
 * Calendario del profesional. Sin emojis ni dependencias externas.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

const DAYS   = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
const DATES  = [7, 8, 9, 10, 11, 12, 13];
const TODAY  = 10;

const APPOINTMENTS = [
  { id: '1', time: '09:00', end: '09:45', pet: 'Max',    owner: 'Carlos G.', service: 'Baño & Corte',     breed: 'Golden Retriever', status: 'confirmada' },
  { id: '2', time: '10:30', end: '11:15', pet: 'Luna',   owner: 'Ana P.',    service: 'Vacunación',        breed: 'Siamés',           status: 'confirmada' },
  { id: '3', time: '11:45', end: '12:30', pet: 'Rocky',  owner: 'Luis M.',   service: 'Consulta General',  breed: 'Maltés',           status: 'pendiente' },
  { id: '4', time: '13:00', end: '13:30', pet: 'Toby',   owner: 'Marta R.',  service: 'Desparasitación',   breed: 'Beagle',           status: 'confirmada' },
  { id: '5', time: '15:00', end: '16:00', pet: 'Mia',    owner: 'Pedro S.',  service: 'Peluquería',        breed: 'Poodle',           status: 'confirmada' },
];

function InitialsAvatar({ name, size = 44, bg = Colors.primaryLight, color = Colors.primary }: { name: string; size?: number; bg?: string; color?: string }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.26, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Text style={{ fontSize: size * 0.34, fontWeight: '700', color }}>{initials}</Text>
    </View>
  );
}

export default function CalendarioScreen() {
  const [selectedDay, setSelectedDay] = useState(3);

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Calendario</Text>
          <Text style={styles.pageSubtitle}>Octubre 2024</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{APPOINTMENTS.length} citas hoy</Text>
        </View>
      </View>

      {/* Selector de semana */}
      <View style={styles.weekStrip}>
        {DAYS.map((day, idx) => {
          const date       = DATES[idx];
          const isSelected = idx === selectedDay;
          const isToday    = date === TODAY;
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayCell, isSelected && styles.dayCellActive]}
              onPress={() => setSelectedDay(idx)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>{day}</Text>
              <View style={[styles.dateBubble, isSelected && styles.dateBubbleActive, isToday && !isSelected && styles.dateBubbleToday]}>
                <Text style={[styles.dateNum, isSelected && styles.dateNumActive, isToday && !isSelected && styles.dateNumToday]}>
                  {date}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={styles.listLabel}>
          {APPOINTMENTS.length} CITAS  ·  {DAYS[selectedDay].toUpperCase()} {DATES[selectedDay]} OCT
        </Text>

        {APPOINTMENTS.map((appt) => {
          const isPending   = appt.status === 'pendiente';
          const stripeColor = isPending ? '#F59E0B' : Colors.primary;

          return (
            <View key={appt.id} style={styles.apptRow}>
              {/* Columna de hora */}
              <View style={styles.timeCol}>
                <Text style={styles.timeText}>{appt.time}</Text>
                <View style={[styles.timeLine, { backgroundColor: stripeColor }]} />
              </View>

              {/* Card */}
              <View style={styles.apptCard}>
                <View style={[styles.apptStripe, { backgroundColor: stripeColor }]} />
                <View style={styles.apptBody}>
                  <View style={styles.apptTop}>
                    <InitialsAvatar name={appt.pet} size={wp(44)} bg={`${stripeColor}18`} color={stripeColor} />
                    <View style={styles.apptText}>
                      <View style={styles.apptNameRow}>
                        <Text style={styles.apptPetName}>{appt.pet}</Text>
                        <Text style={styles.apptRange}>{appt.time} – {appt.end}</Text>
                      </View>
                      <Text style={styles.apptService}>{appt.service}</Text>
                      <Text style={styles.apptMeta}>{appt.breed}  ·  {appt.owner}</Text>
                    </View>
                  </View>

                  <View style={styles.apptActions}>
                    <View style={[styles.statusTag, { backgroundColor: `${stripeColor}14` }]}>
                      <View style={[styles.statusDot, { backgroundColor: stripeColor }]} />
                      <Text style={[styles.statusText, { color: stripeColor }]}>
                        {isPending ? 'Pendiente' : 'Confirmada'}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.llegadaBtn}>
                      <Ionicons name="checkmark" size={wp(11)} color={Colors.white} />
                      <Text style={styles.llegadaBtnText}>LLEGADA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.infoBtn}>
                      <Ionicons name="information-circle" size={wp(11)} color={Colors.textMedium} />
                      <Text style={styles.infoBtnText}>INFO</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ height: hp(24) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  pageTitle:    { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: FontSize.sm, color: Colors.textMedium, marginTop: hp(2) },
  headerBadge:  { backgroundColor: Colors.primaryLight, borderRadius: Radius.full, paddingHorizontal: wp(12), paddingVertical: hp(6), marginTop: hp(6) },
  headerBadgeText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },

  weekStrip: {
    flexDirection: 'row', marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 2,
  },
  dayCell:         { flex: 1, alignItems: 'center', paddingVertical: Spacing.xs, borderRadius: Radius.md },
  dayCellActive:   { backgroundColor: Colors.primaryLight },
  dayName:         { fontSize: wp(10), color: Colors.textLight, fontWeight: '500', marginBottom: hp(4) },
  dayNameActive:   { color: Colors.primary, fontWeight: '700' },
  dateBubble:      { width: wp(28), height: wp(28), borderRadius: wp(14), alignItems: 'center', justifyContent: 'center' },
  dateBubbleActive:{ backgroundColor: Colors.primary },
  dateBubbleToday: { borderWidth: 1.5, borderColor: Colors.primary },
  dateNum:         { fontSize: FontSize.sm, color: Colors.textDark, fontWeight: '500' },
  dateNumActive:   { color: Colors.white, fontWeight: '800' },
  dateNumToday:    { color: Colors.primary, fontWeight: '700' },

  scroll:    { paddingHorizontal: Spacing.lg },
  listLabel: { fontSize: wp(10), fontWeight: '700', color: Colors.textLight, letterSpacing: 0.8, marginBottom: Spacing.md },

  apptRow:  { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  timeCol:  { width: wp(44), alignItems: 'center', paddingTop: hp(4) },
  timeText: { fontSize: wp(10), fontWeight: '600', color: Colors.textMedium, marginBottom: hp(6) },
  timeLine: { flex: 1, width: 2, borderRadius: 1, opacity: 0.25 },

  apptCard: {
    flex: 1, flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: Radius.lg, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(6),
    shadowOffset: { width: 0, height: hp(1) }, elevation: 1,
  },
  apptStripe: { width: wp(4) },
  apptBody:   { flex: 1, padding: Spacing.sm },
  apptTop:    { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  apptText:   { flex: 1 },
  apptNameRow:{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) },
  apptPetName:{ fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark },
  apptRange:  { fontSize: wp(10), color: Colors.textMedium },
  apptService:{ fontSize: FontSize.xs, color: Colors.textMedium, marginBottom: hp(2) },
  apptMeta:   { fontSize: wp(10), color: Colors.textLight },
  apptActions:{ flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },

  statusTag:  { flexDirection: 'row', alignItems: 'center', gap: wp(4), borderRadius: Radius.full, paddingHorizontal: wp(8), paddingVertical: hp(4) },
  statusDot:  { width: wp(6), height: wp(6), borderRadius: wp(3) },
  statusText: { fontSize: wp(9), fontWeight: '700' },

  llegadaBtn: { flexDirection: 'row', alignItems: 'center', gap: wp(4), backgroundColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: wp(10), paddingVertical: hp(5) },
  llegadaBtnText: { fontSize: wp(9), fontWeight: '800', color: Colors.white, letterSpacing: 0.4 },
  infoBtn:    { flexDirection: 'row', alignItems: 'center', gap: wp(4), backgroundColor: '#F0F4F6', borderRadius: Radius.full, paddingHorizontal: wp(10), paddingVertical: hp(5) },
  infoBtnText:{ fontSize: wp(9), fontWeight: '700', color: Colors.textMedium, letterSpacing: 0.4 },
});