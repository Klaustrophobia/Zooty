import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

const PETS = ['Max (Golden Retriever)', 'Luna (Labrador)', 'Rocky (Golden Retriever)'];

const CALENDAR_DAYS = [
  { day: 'LU', dates: [28, 4, 11, 18, 25] },
  { day: 'MA', dates: [29, 5, 12, 19, 26] },
  { day: 'MI', dates: [30, 6, 13, 20, 27] },
  { day: 'JU', dates: [31, 7, 14, 21, 28] },
  { day: 'VI', dates: [1,  8, 15, 22, 29] },
  { day: 'SA', dates: [2,  9, 16, 23, 30] },
  { day: 'DO', dates: [3, 10, 17, 24, 31] },
];

const TIME_SLOTS = ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];

const DISABLED_DATES = [28, 29, 30, 31]; // días del mes anterior (gris)

export default function AgendarCitaScreen() {
  const router = useRouter();
  const [selectedPet, setSelectedPet]   = useState(PETS[0]);
  const [showPetDrop, setShowPetDrop]   = useState(false);
  const [selectedDate, setSelectedDate] = useState(6);
  const [selectedTime, setSelectedTime] = useState('12:00 PM');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Agendar Cita</Text>
        <View style={{ width: wp(36) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* PASO 1: Mascota */}
        <View style={styles.stepSection}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>1</Text></View>
            <Text style={styles.stepLabel}>SELECCIONA TU MASCOTA</Text>
          </View>

          <TouchableOpacity
            style={styles.dropdownTrigger}
            onPress={() => setShowPetDrop((v) => !v)}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownValue}>{selectedPet}</Text>
            <Text style={styles.dropdownChevron}>⌄</Text>
          </TouchableOpacity>

          {showPetDrop && (
            <View style={styles.dropdown}>
              {PETS.map((pet) => (
                <TouchableOpacity
                  key={pet}
                  style={styles.dropdownItem}
                  onPress={() => { setSelectedPet(pet); setShowPetDrop(false); }}
                >
                  <Text style={[styles.dropdownItemText, selectedPet === pet && styles.dropdownItemActive]}>
                    {pet}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* PASO 2: Fecha */}
        <View style={styles.stepSection}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>2</Text></View>
            <Text style={styles.stepLabel}>SELECCIONA LA FECHA</Text>
          </View>

          {/* Calendario */}
          <View style={styles.calendar}>
            {/* Nav mes */}
            <View style={styles.calendarNav}>
              <Text style={styles.calendarMonth}>Octubre 2023</Text>
              <View style={styles.calendarNavBtns}>
                <TouchableOpacity style={styles.navBtn}><Text style={styles.navBtnText}>‹</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navBtn}><Text style={styles.navBtnText}>›</Text></TouchableOpacity>
              </View>
            </View>

            {/* Header días */}
            <View style={styles.calRow}>
              {CALENDAR_DAYS.map(({ day }) => (
                <Text key={day} style={styles.calDayHeader}>{day}</Text>
              ))}
            </View>

            {/* Filas de fechas */}
            {[0, 1, 2, 3, 4].map((week) => (
              <View key={week} style={styles.calRow}>
                {CALENDAR_DAYS.map(({ day, dates }) => {
                  const date = dates[week];
                  const isDisabled = DISABLED_DATES.includes(date) && week === 0;
                  const isSelected = date === selectedDate && !isDisabled;
                  return (
                    <TouchableOpacity
                      key={`${day}-${week}`}
                      style={[
                        styles.calCell,
                        isSelected && styles.calCellSelected,
                        isDisabled && styles.calCellDisabled,
                      ]}
                      onPress={() => !isDisabled && setSelectedDate(date)}
                      disabled={isDisabled}
                    >
                      <Text style={[
                        styles.calDate,
                        isSelected  && styles.calDateSelected,
                        isDisabled  && styles.calDateDisabled,
                      ]}>
                        {date}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* PASO 3: Horario */}
        <View style={styles.stepSection}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepNum}>3</Text></View>
            <Text style={styles.stepLabel}>HORARIOS DISPONIBLES</Text>
          </View>

          <View style={styles.timeSlotsGrid}>
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.timeSlot, selectedTime === slot && styles.timeSlotSelected]}
                onPress={() => setSelectedTime(slot)}
              >
                <Text style={[styles.timeSlotText, selectedTime === slot && styles.timeSlotTextSelected]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resumen del servicio */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen del servicio</Text>

          {[
            { label: 'Servicio',      value: 'Peluquería Canina Premium',    valueColor: Colors.textDark },
            { label: 'Profesional',   value: 'Dra. Ana Martínez',            valueColor: Colors.textDark, emoji: '👩‍⚕️' },
            { label: 'Fecha y Hora',  value: `${selectedDate} Oct, ${selectedTime}`, valueColor: Colors.primary },
          ].map(({ label, value, valueColor, emoji }) => (
            <View key={label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{label}</Text>
              <View style={styles.summaryValueRow}>
                {emoji && <Text style={styles.summaryEmoji}>{emoji}</Text>}
                <Text style={[styles.summaryValue, { color: valueColor }]}>{value}</Text>
              </View>
            </View>
          ))}

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Precio del servicio</Text>
            <Text style={styles.summaryValue}>$45.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Comisión de Zooty</Text>
            <Text style={styles.summaryValue}>$2.50</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Total a pagar</Text>
            <Text style={styles.summaryTotalValue}>$47.50</Text>
          </View>
        </View>

        <View style={{ height: hp(100) }} />
      </ScrollView>

      {/* CTA fijo */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Confirmar cita</Text>
        </TouchableOpacity>
        <Text style={styles.ctaSub}>PAGO SEGURO PROCESADO POR ZOOTY PAY</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: wp(36), height: wp(36), borderRadius: wp(18),
    backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
  },
  backIcon:  { color: Colors.primary, fontSize: wp(26), fontWeight: '300', lineHeight: hp(30) },
  pageTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textDark },
  scroll:    { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },

  /* Pasos */
  stepSection:  { marginBottom: Spacing.lg },
  stepHeader:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  stepBadge: {
    width: wp(24), height: wp(24), borderRadius: wp(12),
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  stepNum:   { color: Colors.white, fontSize: wp(12), fontWeight: '700' },
  stepLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textLight, letterSpacing: 0.5 },

  /* Dropdown mascota */
  dropdownTrigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md, height: hp(50),
  },
  dropdownValue:   { fontSize: FontSize.md, color: Colors.textDark, fontWeight: '500' },
  dropdownChevron: { color: Colors.primary, fontSize: wp(20) },
  dropdown: {
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.borderLight, marginTop: hp(4),
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 6,
  },
  dropdownItem: {
    paddingVertical: hp(13), paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  dropdownItemText:   { fontSize: FontSize.md, color: Colors.textDark },
  dropdownItemActive: { color: Colors.primary, fontWeight: '700' },

  /* Calendario */
  calendar: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 1,
  },
  calendarNav: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  calendarMonth:  { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark },
  calendarNavBtns:{ flexDirection: 'row', gap: Spacing.sm },
  navBtn: {
    width: wp(28), height: wp(28), borderRadius: wp(14),
    backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
  },
  navBtnText: { color: Colors.textMedium, fontSize: wp(16), lineHeight: hp(20) },
  calRow:         { flexDirection: 'row', marginBottom: hp(4) },
  calDayHeader: {
    flex: 1, textAlign: 'center',
    fontSize: FontSize.xs, fontWeight: '600', color: Colors.textLight,
    paddingBottom: hp(8),
  },
  calCell: {
    flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: wp(20), margin: hp(1),
  },
  calCellSelected: { backgroundColor: Colors.primary },
  calCellDisabled: { opacity: 0.3 },
  calDate:         { fontSize: FontSize.sm, color: Colors.textDark, fontWeight: '500' },
  calDateSelected: { color: Colors.white, fontWeight: '700' },
  calDateDisabled: { color: Colors.textLight },

  /* Horarios */
  timeSlotsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
  },
  timeSlot: {
    paddingVertical: hp(10), paddingHorizontal: wp(16),
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  timeSlotSelected:     { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeSlotText:         { fontSize: FontSize.sm, color: Colors.textDark, fontWeight: '500' },
  timeSlotTextSelected: { color: Colors.white, fontWeight: '700' },

  /* Resumen */
  summaryCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 2,
  },
  summaryTitle:    { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, marginBottom: Spacing.md },
  summaryRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  summaryLabel:    { fontSize: FontSize.sm, color: Colors.textMedium },
  summaryValueRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  summaryEmoji:    { fontSize: wp(14) },
  summaryValue:    { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textDark },
  summaryDivider:  { height: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.sm },
  summaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTotalLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark },
  summaryTotalValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },

  /* CTA */
  ctaContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md, paddingBottom: hp(32),
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: wp(12),
    shadowOffset: { width: 0, height: -hp(2) }, elevation: 10,
  },
  ctaBtn: {
    width: '100%', height: hp(54), backgroundColor: Colors.primary,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.32, shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(4) }, elevation: 5, marginBottom: hp(8),
  },
  ctaText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '600' },
  ctaSub:  { textAlign: 'center', fontSize: wp(9), color: Colors.textLight, letterSpacing: 0.5 },
});