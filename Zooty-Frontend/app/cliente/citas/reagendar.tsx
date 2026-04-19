import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, TextInput,
  Alert, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '@/components/PrimaryButton';

// Datos mock para fechas
const generateDates = () => {
  const dates = [];
  const today = new Date();
  const days = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      id: i,
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      fullDate: date,
    });
  }
  return dates;
};

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00',
];

export default function ReagendarCitaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Datos de la cita original
  const appointmentId = params.id as string;
  const professionalName = params.pro as string || 'Clinivet Dr. García';
  const serviceName = params.service as string || 'Consulta Veterinaria';
  const petName = params.pet as string || 'Max';
  const originalDate = params.originalDate as string || '6 Oct';
  const originalTime = params.originalTime as string || '12:00 PM';
  const originalPrice = params.price as string || '47.50';
  
  const [selectedDate, setSelectedDate] = useState<number | null>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dates = generateDates();
  
  // Razones predefinidas para reagendar
  const REASONS = [
    'Conflicto de horario',
    'Emergencia personal',
    'La mascota no está disponible',
    'Prefiero otro horario',
    'Otro motivo',
  ];

  const handleReagendar = async () => {
    if (!selectedDate && selectedDate !== 0) {
      Alert.alert('Error', 'Selecciona una nueva fecha para tu cita');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Error', 'Selecciona un nuevo horario disponible');
      return;
    }
    
    setLoading(true);
    
    // Simular proceso de reagendamiento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    
    // Obtener la nueva fecha formateada
    const newDate = dates[selectedDate];
    const formattedNewDate = `${newDate.date} ${newDate.month}`;
    
    // Crear objeto con la cita actualizada
    const updatedAppointment = {
      id: appointmentId,
      pro: professionalName,
      service: serviceName,
      pet: petName,
      date: formattedNewDate,
      time: selectedTime,
      status: 'confirmada',
      price: parseFloat(originalPrice),
    };
    
    // Navegar de vuelta a citas con los datos actualizados
    router.replace({
      pathname: '/cliente/(tabs)/citas',
      params: {
        updatedAppointment: JSON.stringify(updatedAppointment),
        showSuccessMessage: 'true',
        successType: 'reschedule',
      }
    });
  };

  const getProfessionalIcon = (name: string) => {
    if (name.includes('Veterinario') || name.includes('Dr.')) return 'medical-bag';
    if (name.includes('Paseos')) return 'walk';
    if (name.includes('Spa') || name.includes('Peluquería')) return 'scissors';
    if (name.includes('Guardería')) return 'home';
    return 'paw';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView 
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={wp(22)} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reagendar cita</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Información de la cita original */}
        <View style={styles.originalCard}>
          <Text style={styles.originalLabel}>Cita original</Text>
          
          <View style={styles.proSection}>
            <View style={styles.proAvatar}>
              <MaterialCommunityIcons 
                name={getProfessionalIcon(professionalName)} 
                size={wp(24)} 
                color={Colors.primary} 
              />
            </View>
            <View style={styles.proInfo}>
              <Text style={styles.proName}>{professionalName}</Text>
              <Text style={styles.proService}>{serviceName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.originalDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={wp(16)} color={Colors.textMedium} />
              <Text style={styles.detailText}>{originalDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={wp(16)} color={Colors.textMedium} />
              <Text style={styles.detailText}>{originalTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="paw" size={wp(16)} color={Colors.textMedium} />
              <Text style={styles.detailText}>{petName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={wp(16)} color={Colors.textMedium} />
              <Text style={styles.detailText}>${originalPrice}</Text>
            </View>
          </View>

          <View style={styles.warningBox}>
            <Ionicons name="information-circle-outline" size={wp(18)} color="#F59E0B" />
            <Text style={styles.warningText}>
              Al reagendar, se mantendrá el mismo precio y profesional.
            </Text>
          </View>
        </View>

        {/* Selección de nueva fecha */}
        <Text style={styles.sectionTitle}>Selecciona una nueva fecha</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.datesRow}
        >
          {dates.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.dateCard,
                selectedDate === index && styles.dateCardSelected
              ]}
              onPress={() => setSelectedDate(index)}
            >
              <Text style={[
                styles.dateDay,
                selectedDate === index && styles.dateTextSelected
              ]}>{item.day}</Text>
              <Text style={[
                styles.dateNumber,
                selectedDate === index && styles.dateTextSelected
              ]}>{item.date}</Text>
              <Text style={[
                styles.dateMonth,
                selectedDate === index && styles.dateTextSelected
              ]}>{item.month}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selección de nueva hora */}
        <View style={styles.timeSectionHeader}>
          <Text style={styles.sectionTitle}>Nuevo horario</Text>
          <View style={styles.timeLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>Mañana</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F4845F' }]} />
              <Text style={styles.legendText}>Tarde</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((time) => {
            const hour = parseInt(time.split(':')[0]);
            const isMorning = hour < 12;
            
            return (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Ionicons 
                  name="time-outline" 
                  size={wp(16)} 
                  color={selectedTime === time ? Colors.white : (isMorning ? Colors.primary : '#F4845F')} 
                />
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.timeTextSelected
                ]}>{time}</Text>
                <Text style={[
                  styles.timePeriod,
                  selectedTime === time && styles.timeTextSelected
                ]}>
                  {isMorning ? 'AM' : 'PM'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Motivo del reagendamiento */}
        <Text style={styles.sectionTitle}>Motivo del cambio</Text>
        <View style={styles.reasonsContainer}>
          {REASONS.map((reasonOption) => (
            <TouchableOpacity
              key={reasonOption}
              style={[
                styles.reasonChip,
                reason === reasonOption && styles.reasonChipSelected
              ]}
              onPress={() => setReason(reasonOption)}
            >
              <Text style={[
                styles.reasonChipText,
                reason === reasonOption && styles.reasonChipTextSelected
              ]}>{reasonOption}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notas adicionales */}
        {reason === 'Otro motivo' && (
          <>
            <Text style={styles.sectionTitle}>Especifica el motivo</Text>
            <View style={styles.notesContainer}>
              <TextInput
                style={styles.notesInput}
                placeholder="Explica brevemente el motivo..."
                placeholderTextColor={Colors.placeholder}
                value={additionalNotes}
                onChangeText={setAdditionalNotes}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>
          </>
        )}

        {/* Resumen del cambio */}
        {selectedDate !== null && selectedTime && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen del cambio</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fecha original</Text>
              <Text style={styles.summaryOldValue}>{originalDate} • {originalTime}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Nueva fecha</Text>
              <Text style={styles.summaryNewValue}>
                {dates[selectedDate].date} {dates[selectedDate].month} • {selectedTime}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Precio</Text>
              <Text style={styles.summaryPrice}>${originalPrice}</Text>
            </View>
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>

      {/* Botón confirmar */}
      <View style={styles.bottomBar}>
        <PrimaryButton 
          label={loading ? "Procesando..." : "Confirmar reagendamiento"} 
          onPress={handleReagendar}
          disabled={loading}
        />
        <TouchableOpacity 
          style={styles.cancelLink}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelLinkText}>Cancelar y volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: hp(20) },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 0 : Spacing.md,
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textDark,
  },
  placeholder: { width: wp(40) },
  
  originalCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  originalLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  proSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  proAvatar: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(14),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proInfo: { flex: 1 },
  proName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: hp(2),
  },
  proService: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  originalDetails: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: FontSize.sm,
    color: Colors.textDark,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  warningText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: '#92400E',
  },
  
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  
  datesRow: {
    marginBottom: Spacing.sm,
  },
  dateCard: {
    width: wp(70),
    paddingVertical: hp(12),
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginRight: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  dateCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateDay: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textLight,
    marginBottom: hp(4),
  },
  dateNumber: {
    fontSize: wp(22),
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: hp(2),
  },
  dateMonth: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  dateTextSelected: {
    color: Colors.white,
  },
  
  timeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  timeLegend: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
  legendDot: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
  },
  legendText: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(10),
  },
  timeSlot: {
    width: wp(100),
    paddingVertical: hp(14),
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeText: {
    fontSize: wp(16),
    color: Colors.textDark,
    fontWeight: '600',
    marginTop: hp(4),
  },
  timePeriod: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: hp(2),
  },
  timeTextSelected: {
    color: Colors.white,
  },
  
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  reasonChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: hp(10),
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  reasonChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  reasonChipText: {
    fontSize: FontSize.sm,
    color: Colors.textDark,
  },
  reasonChipTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  
  notesContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
  },
  notesInput: {
    fontSize: FontSize.sm,
    color: Colors.textDark,
    minHeight: hp(50),
    padding: 0,
  },
  
  summaryCard: {
    backgroundColor: '#F0FAF8',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  summaryTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(8),
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
  },
  summaryOldValue: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    textDecorationLine: 'line-through',
  },
  summaryNewValue: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.primary,
  },
  summaryPrice: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
  },
  
  spacer: { height: hp(20) },
  
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? hp(30) : Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  cancelLinkText: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    fontWeight: '500',
  },
});