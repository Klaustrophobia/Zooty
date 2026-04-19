import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Modal,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DATES = [19, 20, 21, 22, 23, 24, 25];

const CLIENTS = [
  { id: '1', name: 'Carlos García', pets: [{ id: 'p1', name: 'Max', breed: 'Golden Retriever' }] },
  { id: '2', name: 'Ana Pérez', pets: [{ id: 'p2', name: 'Luna', breed: 'Siamés' }] },
  { id: '3', name: 'Luis Martínez', pets: [{ id: 'p3', name: 'Rocky', breed: 'Maltés' }] },
  { id: '4', name: 'Marta Rodríguez', pets: [{ id: 'p4', name: 'Oliver', breed: 'Beagle' }] },
  { id: '5', name: 'Pedro Sánchez', pets: [{ id: 'p5', name: 'Mia', breed: 'Poodle' }] },
];

const SERVICES = [
  { id: '1', name: 'Consulta General', duration: '30 min', price: 30 },
  { id: '2', name: 'Vacunación', duration: '15 min', price: 25 },
  { id: '3', name: 'Baño & Corte', duration: '60 min', price: 45 },
  { id: '4', name: 'Peluquería', duration: '45 min', price: 35 },
  { id: '5', name: 'Revisión', duration: '20 min', price: 20 },
  { id: '6', name: 'Desparasitación', duration: '15 min', price: 15 },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
];

const APPOINTMENTS = [
  { id: '1', time: '09:00', petName: 'Max', ownerName: 'Carlos García', service: 'Baño & Corte', status: 'pending' },
  { id: '2', time: '10:30', petName: 'Luna', ownerName: 'Ana Pérez', service: 'Vacunación', status: 'confirmed' },
  { id: '3', time: '11:45', petName: 'Rocky', ownerName: 'Luis Martínez', service: 'Consulta', status: 'arrived' },
  { id: '4', time: '13:30', petName: 'Oliver', ownerName: 'Marta Rodríguez', service: 'Peluquería', status: 'pending' },
  { id: '5', time: '15:00', petName: 'Mia', ownerName: 'Pedro Sánchez', service: 'Revisión', status: 'confirmed' },
  { id: '6', time: '16:30', petName: 'Thor', ownerName: 'Julia Vargas', service: 'Vacunación', status: 'completed' },
  { id: '7', time: '18:00', petName: 'Coco', ownerName: 'Roberto Díaz', service: 'Consulta', status: 'pending' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: '#FFF8E1', text: '#F59E0B', label: 'Pendiente' },
  confirmed: { bg: '#E8F7F5', text: Colors.primary, label: 'Confirmada' },
  arrived: { bg: '#E3F2FD', text: '#1976D2', label: 'Llegó' },
  completed: { bg: '#E8F5E9', text: '#4CAF50', label: 'Completada' },
};

function CreateAppointmentModal({ visible, onClose, onSave }: { visible: boolean; onClose: () => void; onSave: (apt: any) => void }) {
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<typeof CLIENTS[0] | null>(null);
  const [selectedPet, setSelectedPet] = useState<typeof CLIENTS[0]['pets'][0] | null>(null);
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [searchClient, setSearchClient] = useState('');

  const filteredClients = CLIENTS.filter(c => 
    c.name.toLowerCase().includes(searchClient.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedClient || !selectedPet || !selectedService || !selectedTime) {
      Alert.alert('Error', 'Completa todos los campos requeridos');
      return;
    }

    onSave({
      client: selectedClient,
      pet: selectedPet,
      service: selectedService,
      time: selectedTime,
      notes,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStep(1);
    setSelectedClient(null);
    setSelectedPet(null);
    setSelectedService(null);
    setSelectedTime(null);
    setNotes('');
    setSearchClient('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <SafeAreaView style={modalStyles.container}>
        <View style={modalStyles.header}>
          <TouchableOpacity onPress={handleClose} style={modalStyles.backBtn}>
            <Ionicons name="close" size={wp(22)} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={modalStyles.headerTitle}>Nueva cita</Text>
          <View style={modalStyles.placeholder} />
        </View>

        <View style={modalStyles.stepIndicator}>
          {[1, 2, 3, 4].map((s) => (
            <View key={s} style={[modalStyles.stepDot, s <= step && modalStyles.stepDotActive]} />
          ))}
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={modalStyles.content}>
          {step === 1 && (
            <View style={modalStyles.stepContent}>
              <Text style={modalStyles.stepTitle}>Selecciona el cliente</Text>
              <View style={modalStyles.searchBox}>
                <Ionicons name="search" size={wp(18)} color={Colors.textLight} />
                <TextInput
                  style={modalStyles.searchInput}
                  placeholder="Buscar cliente..."
                  placeholderTextColor={Colors.placeholder}
                  value={searchClient}
                  onChangeText={setSearchClient}
                />
              </View>
              <ScrollView showsVerticalScrollIndicator={true}>
                {filteredClients.map((client) => (
                  <TouchableOpacity
                    key={client.id}
                    style={[modalStyles.clientCard, selectedClient?.id === client.id && modalStyles.clientCardSelected]}
                    onPress={() => {
                      setSelectedClient(client);
                      setSelectedPet(null);
                      setStep(2);
                    }}
                  >
                    <View style={modalStyles.clientAvatar}>
                      <Text style={modalStyles.clientAvatarText}>
                        {client.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={modalStyles.clientInfo}>
                      <Text style={modalStyles.clientName}>{client.name}</Text>
                      <Text style={modalStyles.clientPets}>{client.pets.length} mascota{client.pets.length !== 1 ? 's' : ''}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={wp(18)} color={Colors.textLight} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {step === 2 && selectedClient && (
            <View style={modalStyles.stepContent}>
              <Text style={modalStyles.stepTitle}>Selecciona la mascota</Text>
              <Text style={modalStyles.stepSubtitle}>Cliente: {selectedClient.name}</Text>
              {selectedClient.pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[modalStyles.petCard, selectedPet?.id === pet.id && modalStyles.petCardSelected]}
                  onPress={() => {
                    setSelectedPet(pet);
                    setStep(3);
                  }}
                >
                  <View style={modalStyles.petAvatar}>
                    <MaterialCommunityIcons name="paw" size={wp(22)} color={Colors.primary} />
                  </View>
                  <View style={modalStyles.petInfo}>
                    <Text style={modalStyles.petName}>{pet.name}</Text>
                    <Text style={modalStyles.petBreed}>{pet.breed}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(18)} color={Colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 3 && (
            <View style={modalStyles.stepContent}>
              <Text style={modalStyles.stepTitle}>Selecciona el servicio</Text>
              <ScrollView showsVerticalScrollIndicator={true}>
                {SERVICES.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={[modalStyles.serviceCard, selectedService?.id === service.id && modalStyles.serviceCardSelected]}
                    onPress={() => {
                      setSelectedService(service);
                      setStep(4);
                    }}
                  >
                    <View style={modalStyles.serviceIcon}>
                      <MaterialCommunityIcons name="scissors" size={wp(20)} color={Colors.primary} />
                    </View>
                    <View style={modalStyles.serviceInfo}>
                      <Text style={modalStyles.serviceName}>{service.name}</Text>
                      <Text style={modalStyles.serviceMeta}>{service.duration} · ${service.price}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={wp(18)} color={Colors.textLight} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {step === 4 && (
            <View style={modalStyles.stepContent}>
              <Text style={modalStyles.stepTitle}>Selecciona el horario</Text>
              
              <View style={modalStyles.timeLegend}>
                <View style={modalStyles.legendItem}>
                  <View style={[modalStyles.legendDot, { backgroundColor: Colors.primary }]} />
                  <Text style={modalStyles.legendText}>Mañana (AM)</Text>
                </View>
                <View style={modalStyles.legendItem}>
                  <View style={[modalStyles.legendDot, { backgroundColor: '#F4845F' }]} />
                  <Text style={modalStyles.legendText}>Tarde (PM)</Text>
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={true} style={modalStyles.timeScroll}>
                <View style={modalStyles.timeGrid}>
                  {TIME_SLOTS.map((time) => {
                    const hour = parseInt(time.split(':')[0]);
                    const isMorning = hour < 12;
                    
                    return (
                      <TouchableOpacity
                        key={time}
                        style={[
                          modalStyles.timeSlot,
                          selectedTime === time && modalStyles.timeSlotSelected,
                          !isMorning && !selectedTime && modalStyles.timeSlotAfternoon,
                        ]}
                        onPress={() => setSelectedTime(time)}
                        activeOpacity={0.7}
                      >
                        <View style={modalStyles.timeSlotContent}>
                          <Ionicons 
                            name={isMorning ? "sunny-outline" : "moon-outline"} 
                            size={wp(22)} 
                            color={selectedTime === time ? Colors.white : (isMorning ? Colors.primary : '#F4845F')} 
                          />
                          <Text style={[
                            modalStyles.timeSlotText,
                            selectedTime === time && modalStyles.timeSlotTextSelected
                          ]}>
                            {time}
                          </Text>
                          <Text style={[
                            modalStyles.timeSlotPeriod,
                            selectedTime === time && modalStyles.timeSlotTextSelected
                          ]}>
                            {isMorning ? 'AM' : 'PM'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              <Text style={[modalStyles.stepTitle, { marginTop: Spacing.xl }]}>Notas adicionales</Text>
              <TextInput
                style={modalStyles.notesInput}
                placeholder="Observaciones, alergias, etc. (opcional)"
                placeholderTextColor={Colors.placeholder}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              
              <View style={{ height: hp(20) }} />
            </View>
          )}
        </KeyboardAvoidingView>

        <View style={modalStyles.footer}>
          {step > 1 && (
            <TouchableOpacity style={modalStyles.secondaryBtn} onPress={() => setStep(step - 1)}>
              <Text style={modalStyles.secondaryBtnText}>Atrás</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[modalStyles.primaryBtn, step > 1 && { flex: 1 }]} 
            onPress={step === 4 ? handleSave : () => setStep(step + 1)}
          >
            <Text style={modalStyles.primaryBtnText}>
              {step === 4 ? 'Crear cita' : 'Continuar'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function CitasScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(2);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState(APPOINTMENTS);

  const filteredAppointments = appointments.filter(apt => {
    if (selectedFilter === 'all') return true;
    return apt.status === selectedFilter;
  });

  const handleCreateAppointment = (data: any) => {
    const newAppointment = {
      id: Date.now().toString(),
      time: data.time,
      petName: data.pet.name,
      ownerName: data.client.name,
      service: data.service.name,
      status: 'pending',
    };
    setAppointments(prev => [...prev, newAppointment]);
    Alert.alert('Éxito', `Cita creada para ${data.pet.name} a las ${data.time}`);
  };

  const handleStatusChange = (aptId: string, newStatus: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === aptId ? { ...apt, status: newStatus } : apt
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={wp(22)} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Citas</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={wp(22)} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {DAYS.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dateCard, selectedDate === index && styles.dateCardSelected]}
              onPress={() => setSelectedDate(index)}
            >
              <Text style={[styles.dateDay, selectedDate === index && styles.dateTextSelected]}>{day}</Text>
              <Text style={[styles.dateNumber, selectedDate === index && styles.dateTextSelected]}>{DATES[index]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {[
            { id: 'all', label: 'Todas' },
            { id: 'pending', label: 'Pendientes' },
            { id: 'confirmed', label: 'Confirmadas' },
            { id: 'arrived', label: 'Llegaron' },
            { id: 'completed', label: 'Completadas' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterChip, selectedFilter === filter.id && styles.filterChipActive]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[styles.filterChipText, selectedFilter === filter.id && styles.filterChipTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.summaryText}>
        {filteredAppointments.length} cita{filteredAppointments.length !== 1 ? 's' : ''} para hoy
      </Text>

      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scroll}>
        {filteredAppointments.map((apt) => {
          const statusStyle = STATUS_COLORS[apt.status];
          return (
            <View key={apt.id} style={styles.appointmentCard}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{apt.time}</Text>
                <View style={[styles.statusDot, { backgroundColor: statusStyle.text }]} />
              </View>

              <View style={styles.appointmentContent}>
                <View style={styles.appointmentHeader}>
                  <View>
                    <Text style={styles.petName}>{apt.petName}</Text>
                    <Text style={styles.ownerName}>{apt.ownerName}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentFooter}>
                  <View style={styles.serviceTag}>
                    <MaterialCommunityIcons name="scissors" size={wp(14)} color={Colors.textLight} />
                    <Text style={styles.serviceText}>{apt.service}</Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Ionicons name="chatbubble-outline" size={wp(18)} color={Colors.primary} />
                    </TouchableOpacity>
                    {apt.status !== 'completed' && (
                      <TouchableOpacity 
                        style={[styles.actionBtn, styles.primaryAction]}
                        onPress={() => handleStatusChange(apt.id, apt.status === 'arrived' ? 'completed' : 'arrived')}
                      >
                        <Ionicons name="checkmark" size={wp(18)} color={Colors.white} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {filteredAppointments.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={wp(56)} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Sin citas</Text>
            <Text style={styles.emptySubtitle}>No hay citas para este filtro</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.emptyBtnText}>Crear nueva cita</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: hp(24) }} />
      </ScrollView>

      <CreateAppointmentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleCreateAppointment}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: wp(40), height: wp(40), borderRadius: wp(20),
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textDark },
  addBtn: {
    width: wp(40), height: wp(40), borderRadius: wp(20),
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },

  calendarStrip: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  dateCard: {
    width: wp(50), paddingVertical: hp(10), marginRight: Spacing.sm,
    backgroundColor: Colors.white, borderRadius: Radius.lg, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.borderLight,
  },
  dateCardSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateDay: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textLight, marginBottom: hp(4) },
  dateNumber: { fontSize: wp(18), fontWeight: '700', color: Colors.textDark },
  dateTextSelected: { color: Colors.white },

  filterRow: { marginBottom: Spacing.md },
  filterScroll: { paddingHorizontal: Spacing.lg },
  filterChip: {
    paddingHorizontal: wp(16), paddingVertical: hp(8), marginRight: Spacing.sm,
    borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: FontSize.xs, color: Colors.textMedium, fontWeight: '600' },
  filterChipTextActive: { color: Colors.white },

  summaryText: {
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.md,
    fontSize: FontSize.sm, color: Colors.textLight, fontWeight: '600',
  },

  scroll: { paddingHorizontal: Spacing.lg },

  appointmentCard: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  timeContainer: { alignItems: 'center', gap: hp(4) },
  timeText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark },
  statusDot: { width: wp(8), height: wp(8), borderRadius: wp(4) },

  appointmentContent: { flex: 1 },
  appointmentHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: hp(8),
  },
  petName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, marginBottom: hp(2) },
  ownerName: { fontSize: FontSize.xs, color: Colors.textMedium },
  statusBadge: { paddingHorizontal: wp(8), paddingVertical: hp(4), borderRadius: Radius.full },
  statusBadgeText: { fontSize: wp(10), fontWeight: '700' },

  appointmentFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  serviceTag: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
  serviceText: { fontSize: FontSize.xs, color: Colors.textMedium },
  actionButtons: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: {
    width: wp(36), height: wp(36), borderRadius: wp(18),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  primaryAction: { backgroundColor: Colors.primary },

  emptyState: { alignItems: 'center', paddingTop: hp(40) },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textDark, marginTop: Spacing.md, marginBottom: Spacing.sm },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textMedium, marginBottom: Spacing.lg },
  emptyBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl, paddingVertical: hp(14),
  },
  emptyBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '600' },
});

const modalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: wp(40), height: wp(40), borderRadius: wp(20),
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textDark },
  placeholder: { width: wp(40) },

  stepIndicator: {
    flexDirection: 'row', justifyContent: 'center', gap: wp(8),
    paddingVertical: Spacing.md,
  },
  stepDot: {
    width: wp(8), height: wp(8), borderRadius: wp(4),
    backgroundColor: Colors.borderLight,
  },
  stepDotActive: { backgroundColor: Colors.primary, width: wp(24) },

  content: { flex: 1 },
  stepContent: { flex: 1, paddingHorizontal: Spacing.lg },

  stepTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textDark, marginBottom: Spacing.sm },
  stepSubtitle: { fontSize: FontSize.sm, color: Colors.textMedium, marginBottom: Spacing.lg },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md, height: hp(46), gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textDark },

  clientCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md,
  },
  clientCardSelected: { borderWidth: 2, borderColor: Colors.primary },
  clientAvatar: {
    width: wp(50), height: wp(50), borderRadius: wp(25),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  clientAvatarText: { fontSize: wp(18), fontWeight: '700', color: Colors.primary },
  clientInfo: { flex: 1 },
  clientName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, marginBottom: hp(2) },
  clientPets: { fontSize: FontSize.xs, color: Colors.textMedium },

  petCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md,
  },
  petCardSelected: { borderWidth: 2, borderColor: Colors.primary },
  petAvatar: {
    width: wp(50), height: wp(50), borderRadius: wp(25),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  petInfo: { flex: 1 },
  petName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, marginBottom: hp(2) },
  petBreed: { fontSize: FontSize.xs, color: Colors.textMedium },

  serviceCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md,
  },
  serviceCardSelected: { borderWidth: 2, borderColor: Colors.primary },
  serviceIcon: {
    width: wp(44), height: wp(44), borderRadius: wp(12),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, marginBottom: hp(2) },
  serviceMeta: { fontSize: FontSize.xs, color: Colors.textMedium },

  timeLegend: {
    flexDirection: 'row', justifyContent: 'center', gap: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row', alignItems: 'center', gap: wp(6),
  },
  legendDot: {
    width: wp(10), height: wp(10), borderRadius: wp(5),
  },
  legendText: {
    fontSize: FontSize.xs, color: Colors.textMedium, fontWeight: '500',
  },

  timeScroll: {
    maxHeight: hp(300),
    marginBottom: Spacing.md,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(12),
  },
  timeSlot: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: wp(4),
    shadowOffset: { width: 0, height: hp(1) },
    elevation: 1,
  },
  timeSlotAfternoon: {
    borderColor: '#FFF0EB',
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(3) },
    elevation: 3,
  },
  timeSlotContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(18),
    paddingHorizontal: Spacing.sm,
  },
  timeSlotText: {
    fontSize: wp(20),
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: hp(6),
  },
  timeSlotPeriod: {
    fontSize: wp(12),
    color: Colors.textLight,
    marginTop: hp(2),
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: Colors.white,
  },

  notesInput: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    fontSize: FontSize.sm, color: Colors.textDark,
    minHeight: hp(80), textAlignVertical: 'top',
  },

  footer: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? hp(30) : Spacing.lg,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  secondaryBtn: {
    paddingVertical: hp(12), paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full, borderWidth: 1.5,
    borderColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: FontSize.md, color: Colors.textMedium, fontWeight: '600' },
  primaryBtn: {
    flex: 1, paddingVertical: hp(12), borderRadius: Radius.full,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnText: { fontSize: FontSize.md, color: Colors.white, fontWeight: '600' },
});