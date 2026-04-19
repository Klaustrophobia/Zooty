import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

const DAYS  = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
const DATES = [7, 8, 9, 10, 11, 12, 13];
const TODAY = 10;

type Appointment = {
  id: string;
  time: string;
  end: string;
  pet: string;
  owner: string;
  service: string;
  breed: string;
  status: string;
  arrived: boolean;
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: '1', time: '09:00', end: '09:45', pet: 'Max',   owner: 'Carlos G.', service: 'Baño & Corte',    breed: 'Golden Retriever', status: 'confirmada', arrived: false },
  { id: '2', time: '10:30', end: '11:15', pet: 'Luna',  owner: 'Ana P.',    service: 'Vacunación',       breed: 'Siamés',           status: 'confirmada', arrived: false },
  { id: '3', time: '11:45', end: '12:30', pet: 'Rocky', owner: 'Luis M.',   service: 'Consulta General', breed: 'Maltés',           status: 'pendiente',  arrived: false },
  { id: '4', time: '13:00', end: '13:30', pet: 'Toby',  owner: 'Marta R.',  service: 'Desparasitación',  breed: 'Beagle',           status: 'confirmada', arrived: false },
  { id: '5', time: '15:00', end: '16:00', pet: 'Mia',   owner: 'Pedro S.',  service: 'Peluquería',       breed: 'Poodle',           status: 'confirmada', arrived: false },
];

function InitialsAvatar({ name, size = 44, bg = Colors.primaryLight, color = Colors.primary }: { name: string; size?: number; bg?: string; color?: string }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.26, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Text style={{ fontSize: size * 0.34, fontWeight: '700', color }}>{initials}</Text>
    </View>
  );
}

function InfoModal({ appt, onClose }: { appt: Appointment; onClose: () => void }) {
  const isPending   = appt.status === 'pendiente';
  const accentColor = isPending ? '#F59E0B' : Colors.primary;
  const accentBg    = isPending ? '#FFF8E1' : Colors.primaryLight;

  return (
    <Modal animationType="fade" transparent visible onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />

          <View style={modalStyles.heroRow}>
            <InitialsAvatar name={appt.pet} size={wp(64)} bg={`${accentColor}18`} color={accentColor} />
            <View style={modalStyles.heroText}>
              <Text style={modalStyles.heroPet}>{appt.pet}</Text>
              <Text style={modalStyles.heroBreed}>{appt.breed}</Text>
              <View style={[modalStyles.statusTag, { backgroundColor: accentBg }]}>
                <View style={[modalStyles.statusDot, { backgroundColor: accentColor }]} />
                <Text style={[modalStyles.statusLabel, { color: accentColor }]}>
                  {isPending ? 'Pendiente' : 'Confirmada'}
                </Text>
              </View>
            </View>
          </View>

          <View style={modalStyles.divider} />

          <View style={modalStyles.section}>
            <Text style={modalStyles.sectionTitle}>Servicio</Text>
            <View style={modalStyles.row}>
              <Ionicons name="cut-outline" size={wp(16)} color={Colors.textMedium} />
              <Text style={modalStyles.rowText}>{appt.service}</Text>
            </View>
          </View>

          <View style={modalStyles.section}>
            <Text style={modalStyles.sectionTitle}>Horario</Text>
            <View style={modalStyles.row}>
              <Ionicons name="time-outline" size={wp(16)} color={Colors.textMedium} />
              <Text style={modalStyles.rowText}>{appt.time} – {appt.end}</Text>
            </View>
          </View>

          <View style={modalStyles.section}>
            <Text style={modalStyles.sectionTitle}>Dueño</Text>
            <View style={modalStyles.row}>
              <Ionicons name="person-outline" size={wp(16)} color={Colors.textMedium} />
              <Text style={modalStyles.rowText}>{appt.owner}</Text>
            </View>
          </View>

          <View style={modalStyles.section}>
            <Text style={modalStyles.sectionTitle}>Estado de llegada</Text>
            <View style={modalStyles.row}>
              <Ionicons
                name={appt.arrived ? 'checkmark-circle' : 'ellipse-outline'}
                size={wp(16)}
                color={appt.arrived ? '#22C55E' : Colors.textMedium}
              />
              <Text style={[modalStyles.rowText, { color: appt.arrived ? '#22C55E' : Colors.textMedium }]}>
                {appt.arrived ? 'Paciente ha llegado' : 'Aún no ha llegado'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
            <Text style={modalStyles.closeBtnText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function CalendarioScreen() {
  const [selectedDay, setSelectedDay]     = useState(3);
  const [appointments, setAppointments]   = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedAppt, setSelectedAppt]   = useState<Appointment | null>(null);

  const toggleArrival = (id: string) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, arrived: !a.arrived } : a)
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Calendario</Text>
          <Text style={styles.pageSubtitle}>Octubre 2024</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{appointments.length} citas hoy</Text>
        </View>
      </View>

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
          {appointments.length} CITAS  ·  {DAYS[selectedDay].toUpperCase()} {DATES[selectedDay]} OCT
        </Text>

        {appointments.map((appt) => {
          const isPending   = appt.status === 'pendiente';
          const stripeColor = isPending ? '#F59E0B' : Colors.primary;

          return (
            <View key={appt.id} style={styles.apptRow}>
              <View style={styles.timeCol}>
                <Text style={styles.timeText}>{appt.time}</Text>
                <View style={[styles.timeLine, { backgroundColor: stripeColor }]} />
              </View>

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

                    <TouchableOpacity
                      style={[styles.llegadaBtn, appt.arrived && styles.llegadaBtnActive]}
                      onPress={() => toggleArrival(appt.id)}
                      activeOpacity={0.75}
                    >
                      <Ionicons
                        name={appt.arrived ? 'checkmark-circle' : 'checkmark'}
                        size={wp(11)}
                        color={appt.arrived ? Colors.primary : Colors.white}
                      />
                      <Text style={[styles.llegadaBtnText, appt.arrived && styles.llegadaBtnTextActive]}>
                        {appt.arrived ? 'LLEGÓ' : 'LLEGADA'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.infoBtn}
                      onPress={() => setSelectedAppt(appt)}
                      activeOpacity={0.75}
                    >
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

      {selectedAppt && (
        <InfoModal
          appt={appointments.find(a => a.id === selectedAppt.id) ?? selectedAppt}
          onClose={() => setSelectedAppt(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  pageTitle:       { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark, letterSpacing: -0.5 },
  pageSubtitle:    { fontSize: FontSize.sm, color: Colors.textMedium, marginTop: hp(2) },
  headerBadge:     { backgroundColor: Colors.primaryLight, borderRadius: Radius.full, paddingHorizontal: wp(12), paddingVertical: hp(6), marginTop: hp(6) },
  headerBadgeText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },

  weekStrip: {
    flexDirection: 'row', marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 2,
  },
  dayCell:          { flex: 1, alignItems: 'center', paddingVertical: Spacing.xs, borderRadius: Radius.md },
  dayCellActive:    { backgroundColor: Colors.primaryLight },
  dayName:          { fontSize: wp(10), color: Colors.textLight, fontWeight: '500', marginBottom: hp(4) },
  dayNameActive:    { color: Colors.primary, fontWeight: '700' },
  dateBubble:       { width: wp(28), height: wp(28), borderRadius: wp(14), alignItems: 'center', justifyContent: 'center' },
  dateBubbleActive: { backgroundColor: Colors.primary },
  dateBubbleToday:  { borderWidth: 1.5, borderColor: Colors.primary },
  dateNum:          { fontSize: FontSize.sm, color: Colors.textDark, fontWeight: '500' },
  dateNumActive:    { color: Colors.white, fontWeight: '800' },
  dateNumToday:     { color: Colors.primary, fontWeight: '700' },

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
  apptStripe:  { width: wp(4) },
  apptBody:    { flex: 1, padding: Spacing.sm },
  apptTop:     { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  apptText:    { flex: 1 },
  apptNameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) },
  apptPetName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark },
  apptRange:   { fontSize: wp(10), color: Colors.textMedium },
  apptService: { fontSize: FontSize.xs, color: Colors.textMedium, marginBottom: hp(2) },
  apptMeta:    { fontSize: wp(10), color: Colors.textLight },
  apptActions: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },

  statusTag:  { flexDirection: 'row', alignItems: 'center', gap: wp(4), borderRadius: Radius.full, paddingHorizontal: wp(8), paddingVertical: hp(4) },
  statusDot:  { width: wp(6), height: wp(6), borderRadius: wp(3) },
  statusText: { fontSize: wp(9), fontWeight: '700' },

  llegadaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: wp(4),
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingHorizontal: wp(10), paddingVertical: hp(5),
  },
  llegadaBtnActive: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  llegadaBtnText:       { fontSize: wp(9), fontWeight: '800', color: Colors.white, letterSpacing: 0.4 },
  llegadaBtnTextActive: { color: Colors.primary },

  infoBtn:     { flexDirection: 'row', alignItems: 'center', gap: wp(4), backgroundColor: '#F0F4F6', borderRadius: Radius.full, paddingHorizontal: wp(10), paddingVertical: hp(5) },
  infoBtnText: { fontSize: wp(9), fontWeight: '700', color: Colors.textMedium, letterSpacing: 0.4 },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: hp(36),
    paddingTop: Spacing.sm,
  },
  handle: {
    width: wp(40), height: hp(4), borderRadius: hp(2),
    backgroundColor: Colors.borderLight, alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  heroRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, marginBottom: Spacing.lg,
  },
  heroText:    { flex: 1 },
  heroPet:     { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textDark, marginBottom: hp(2) },
  heroBreed:   { fontSize: FontSize.sm, color: Colors.textMedium, marginBottom: Spacing.sm },
  statusTag:   { flexDirection: 'row', alignItems: 'center', gap: wp(6), borderRadius: Radius.full, paddingHorizontal: wp(10), paddingVertical: hp(4), alignSelf: 'flex-start' },
  statusDot:   { width: wp(7), height: wp(7), borderRadius: wp(4) },
  statusLabel: { fontSize: FontSize.xs, fontWeight: '700' },
  divider:     { height: 1, backgroundColor: Colors.borderLight, marginBottom: Spacing.lg },
  section:     { marginBottom: Spacing.lg },
  sectionTitle:{ fontSize: wp(10), fontWeight: '700', color: Colors.textLight, letterSpacing: 0.8, marginBottom: hp(6) },
  row:         { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rowText:     { fontSize: FontSize.md, color: Colors.textDark, fontWeight: '500' },
  closeBtn: {
    height: hp(50), backgroundColor: Colors.primary,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  closeBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '700' },
});