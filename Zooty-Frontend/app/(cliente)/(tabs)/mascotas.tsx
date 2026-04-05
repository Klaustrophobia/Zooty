import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Modal,
  TextInput, Alert, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const PETS = [
  { id: '1', name: 'Luna',  species: 'Perro',  breed: 'Labrador Retriever', age: '3 años',  weight: '28 kg', color: '#E8F7F5', nextVaccine: '15 Nov 2024', lastVisit: '2 Sep 2024' },
  { id: '2', name: 'Max',   species: 'Gato',   breed: 'Persa',              age: '5 años',  weight: '4.2 kg', color: '#FFF4EE', nextVaccine: '3 Dic 2024',  lastVisit: '1 Oct 2024' },
  { id: '3', name: 'Rocky', species: 'Perro',  breed: 'Golden Retriever',   age: '2 años',  weight: '31 kg', color: '#E8F7F5', nextVaccine: '20 Ene 2025', lastVisit: '28 Ago 2024' },
];

interface PetDetailProps {
  pet: typeof PETS[0];
  onClose: () => void;
}

function PetDetail({ pet, onClose }: PetDetailProps) {
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={dStyles.safe}>
        <View style={dStyles.header}>
          <TouchableOpacity onPress={onClose} style={dStyles.backBtn}>
            <Ionicons name="chevron-back" size={wp(24)} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={dStyles.headerTitle}>{pet.name}</Text>
          <TouchableOpacity style={dStyles.editBtn}>
            <Text style={dStyles.editText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={dStyles.scroll} showsVerticalScrollIndicator={false}>
          <View style={[dStyles.hero, { backgroundColor: pet.color }]}>
            <MaterialCommunityIcons name="paw" size={wp(72)} color={Colors.primary} />
            <Text style={dStyles.heroName}>{pet.name}</Text>
            <Text style={dStyles.heroBreed}>{pet.breed}</Text>
          </View>

          <View style={dStyles.statsRow}>
            {[
              { label: 'Especie', value: pet.species },
              { label: 'Edad',    value: pet.age },
              { label: 'Peso',    value: pet.weight },
            ].map(({ label, value }) => (
              <View key={label} style={dStyles.statCard}>
                <Text style={dStyles.statValue}>{value}</Text>
                <Text style={dStyles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={dStyles.section}>
            <Text style={dStyles.sectionTitle}>Salud</Text>
            <View style={dStyles.healthRow}>
              <View style={dStyles.healthItem}>
                <Ionicons name="medical-outline" size={wp(24)} color={Colors.primary} />
                <Text style={dStyles.healthLabel}>Próxima vacuna</Text>
                <Text style={dStyles.healthValue}>{pet.nextVaccine}</Text>
              </View>
              <View style={dStyles.healthItem}>
                <Ionicons name="calendar-outline" size={wp(24)} color={Colors.primary} />
                <Text style={dStyles.healthLabel}>Última visita</Text>
                <Text style={dStyles.healthValue}>{pet.lastVisit}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={dStyles.ctaBtn}>
            <Text style={dStyles.ctaText}>Agendar cita para {pet.name}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// Modal para agregar nueva mascota - IDÉNTICO AL DE HOME
function AddPetModal({ visible, onClose, onAddPet }: { visible: boolean; onClose: () => void; onAddPet: (pet: any) => void }) {
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState('Perro');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');

  const handleAddPet = () => {
    if (!newPetName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre de tu mascota');
      return;
    }

    const newPet = {
      id: Date.now().toString(),
      name: newPetName,
      species: newPetType,
      breed: newPetBreed || 'No especificada',
      age: newPetAge || 'No especificada',
      weight: 'No especificado',
      color: newPetType === 'Perro' ? '#E8F7F5' : '#FFF4EE',
      nextVaccine: 'Por definir',
      lastVisit: 'Sin visitas',
    };

    onAddPet(newPet);
    setNewPetName('');
    setNewPetType('Perro');
    setNewPetAge('');
    setNewPetBreed('');
    onClose();
    Alert.alert('Éxito', `${newPetName} ha sido agregado a tus mascotas`);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={modalStyles.modalContainer}
            >
              <View style={modalStyles.modalContent}>
                <View style={modalStyles.modalHeader}>
                  <Text style={modalStyles.modalTitle}>Nueva mascota</Text>
                  <TouchableOpacity 
                    onPress={onClose}
                    style={modalStyles.modalCloseBtn}
                  >
                    <Text style={modalStyles.modalClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={modalStyles.modalScroll}
                >
                  <View style={modalStyles.modalBody}>
                    <View style={modalStyles.inputGroup}>
                      <Text style={modalStyles.inputLabel}>Nombre *</Text>
                      <TextInput
                        style={modalStyles.input}
                        placeholder="Ej: Luna, Max, Rocky"
                        placeholderTextColor={Colors.placeholder}
                        value={newPetName}
                        onChangeText={setNewPetName}
                        autoFocus={true}
                      />
                    </View>

                    <View style={modalStyles.inputGroup}>
                      <Text style={modalStyles.inputLabel}>Tipo</Text>
                      <View style={modalStyles.typeButtons}>
                        {['Perro', 'Gato', 'Otro'].map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              modalStyles.typeButton,
                              newPetType === type && modalStyles.typeButtonActive
                            ]}
                            onPress={() => setNewPetType(type)}
                          >
                            <Text style={[
                              modalStyles.typeButtonText,
                              newPetType === type && modalStyles.typeButtonTextActive
                            ]}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={modalStyles.inputGroup}>
                      <Text style={modalStyles.inputLabel}>Raza (opcional)</Text>
                      <TextInput
                        style={modalStyles.input}
                        placeholder="Ej: Labrador, Persa"
                        placeholderTextColor={Colors.placeholder}
                        value={newPetBreed}
                        onChangeText={setNewPetBreed}
                      />
                    </View>

                    <View style={modalStyles.inputGroup}>
                      <Text style={modalStyles.inputLabel}>Edad (opcional)</Text>
                      <TextInput
                        style={modalStyles.input}
                        placeholder="Ej: 2 años, 3 meses"
                        placeholderTextColor={Colors.placeholder}
                        value={newPetAge}
                        onChangeText={setNewPetAge}
                      />
                    </View>
                  </View>
                </ScrollView>

                <View style={modalStyles.modalFooter}>
                  <TouchableOpacity 
                    style={modalStyles.modalButtonCancel}
                    onPress={onClose}
                  >
                    <Text style={modalStyles.modalButtonCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={modalStyles.modalButtonSave}
                    onPress={handleAddPet}
                  >
                    <Text style={modalStyles.modalButtonSaveText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default function MascotasScreen() {
  const [selected, setSelected] = useState<typeof PETS[0] | null>(null);
  const [pets, setPets] = useState(PETS);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddPet = (newPet: any) => {
    setPets([...pets, newPet]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Mis Mascotas</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={wp(24)} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {pets.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            style={styles.petCard}
            activeOpacity={0.8}
            onPress={() => setSelected(pet)}
          >
            <View style={[styles.petAvatarBg, { backgroundColor: pet.color }]}>
              <MaterialCommunityIcons name="paw" size={wp(30)} color={Colors.primary} />
            </View>
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{pet.breed}</Text>
              <View style={styles.petMeta}>
                <Text style={styles.petMetaText}>{pet.age}</Text>
                <Text style={styles.petMetaDot}>·</Text>
                <Text style={styles.petMetaText}>{pet.weight}</Text>
              </View>
            </View>
            <View style={styles.petActions}>
              <View style={styles.vaccinePill}>
                <Ionicons name="medical-outline" size={wp(10)} color="#F59E0B" />
                <Text style={styles.vaccineText}>Vacuna próxima</Text>
              </View>
              <Ionicons name="chevron-forward" size={wp(20)} color={Colors.textLight} />
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addCard} onPress={() => setModalVisible(true)}>
          <View style={styles.addCardIcon}>
            <Ionicons name="add" size={wp(28)} color={Colors.primary} />
          </View>
          <Text style={styles.addCardTitle}>Añadir mascota</Text>
          <Text style={styles.addCardSub}>Registra a tu compañero peludo</Text>
        </TouchableOpacity>
      </ScrollView>

      {selected && <PetDetail pet={selected} onClose={() => setSelected(null)} />}
      
      <AddPetModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onAddPet={handleAddPet}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  pageTitle: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark },
  addBtn: {
    width: wp(40), height: wp(40), borderRadius: wp(20),
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(3) }, elevation: 4,
  },
  scroll:     { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  petCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 2, gap: Spacing.md,
  },
  petAvatarBg: {
    width: wp(60), height: wp(60), borderRadius: wp(18),
    alignItems: 'center', justifyContent: 'center',
  },
  petInfo:    { flex: 1 },
  petName:    { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, marginBottom: hp(2) },
  petBreed:   { fontSize: FontSize.xs, color: Colors.textMedium, marginBottom: hp(4) },
  petMeta:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  petMetaText:{ fontSize: FontSize.xs, color: Colors.textLight },
  petMetaDot: { color: Colors.textLight },
  petActions: { alignItems: 'flex-end', gap: Spacing.sm },
  vaccinePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF8E1', borderRadius: Radius.full,
    paddingHorizontal: wp(8), paddingVertical: hp(4), gap: wp(3),
  },
  vaccineText: { fontSize: wp(9), color: '#F59E0B', fontWeight: '700' },
  addCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.xl, alignItems: 'center',
    borderWidth: 2, borderColor: Colors.borderLight, borderStyle: 'dashed',
    marginBottom: Spacing.md,
  },
  addCardIcon: {
    width: wp(56), height: wp(56), borderRadius: wp(28),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  addCardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, marginBottom: hp(4) },
  addCardSub:   { fontSize: FontSize.sm, color: Colors.textMedium },
});

const dStyles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: wp(36), height: wp(36), borderRadius: wp(18),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textDark },
  editBtn:     { paddingHorizontal: Spacing.sm },
  editText:    { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
  scroll:      { paddingBottom: Spacing.xxl },
  hero: {
    alignItems: 'center', paddingVertical: hp(40),
    marginBottom: Spacing.lg,
  },
  heroName:    { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textDark, marginBottom: hp(4) },
  heroBreed:   { fontSize: FontSize.md, color: Colors.textMedium },
  statsRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg,
    gap: Spacing.md, marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1, backgroundColor: Colors.background, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center',
  },
  statValue: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, marginBottom: hp(2) },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMedium },
  section:   { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textDark, marginBottom: Spacing.md },
  healthRow: { flexDirection: 'row', gap: Spacing.md },
  healthItem: {
    flex: 1, backgroundColor: Colors.background, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', gap: hp(4),
  },
  healthLabel: { fontSize: FontSize.xs, color: Colors.textMedium, textAlign: 'center' },
  healthValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark },
  ctaBtn: {
    marginHorizontal: Spacing.lg, height: hp(54), backgroundColor: Colors.primary,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  ctaText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '600' },
});

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width - Spacing.xl * 2,
    maxWidth: wp(400),
    maxHeight: height * 0.7,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textDark,
  },
  modalCloseBtn: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  modalClose: {
    fontSize: wp(18),
    color: Colors.textMedium,
    fontWeight: '400',
  },
  modalScroll: {
    flexGrow: 1,
  },
  modalBody: {
    padding: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: hp(6),
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? hp(14) : hp(10),
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: hp(10),
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: Colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  modalButtonCancelText: {
    fontSize: FontSize.md,
    color: Colors.textMedium,
    fontWeight: '600',
  },
  modalButtonSave: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalButtonSaveText: {
    fontSize: FontSize.md,
    color: Colors.white,
    fontWeight: '600',
  },
});