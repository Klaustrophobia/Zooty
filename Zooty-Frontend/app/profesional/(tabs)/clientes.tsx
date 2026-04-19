import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, SafeAreaView, Modal,
  KeyboardAvoidingView, Platform, Pressable, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

type Client = {
  id: string;
  owner: string;
  pet: string;
  breed: string;
  visits: number;
  last: string;
  rating: number;
  petAge?: string;
  petWeight?: string;
  petSpecies?: string;
  phone?: string;
  email?: string;
  notes?: string;
};

const INITIAL_CLIENTS: Client[] = [
  { id: '1', owner: 'Carlos García',   pet: 'Max',   breed: 'Golden Retriever', visits: 8,  last: 'Hoy',    rating: 5.0, petAge: '4 años', petWeight: '30 kg', petSpecies: 'Perro', phone: '+34 612 345 678', email: 'carlos@email.com',  notes: 'Alergia al pollo' },
  { id: '2', owner: 'Ana Pérez',        pet: 'Luna',  breed: 'Siamés',           visits: 5,  last: 'Ayer',   rating: 4.8, petAge: '3 años', petWeight: '4 kg',  petSpecies: 'Gato',  phone: '+34 623 456 789', email: 'ana@email.com',     notes: '' },
  { id: '3', owner: 'Luis Martínez',    pet: 'Rocky', breed: 'Maltés',           visits: 12, last: '8 Oct',  rating: 5.0, petAge: '6 años', petWeight: '5 kg',  petSpecies: 'Perro', phone: '+34 634 567 890', email: 'luis@email.com',    notes: 'Prefiere horario de mañana' },
  { id: '4', owner: 'Marta Rodríguez',  pet: 'Toby',  breed: 'Beagle',           visits: 3,  last: '5 Oct',  rating: 4.5, petAge: '1 año',  petWeight: '12 kg', petSpecies: 'Perro', phone: '+34 645 678 901', email: 'marta@email.com',   notes: '' },
  { id: '5', owner: 'Pedro Sánchez',    pet: 'Mia',   breed: 'Poodle',           visits: 7,  last: '3 Oct',  rating: 4.9, petAge: '2 años', petWeight: '6 kg',  petSpecies: 'Perro', phone: '+34 656 789 012', email: 'pedro@email.com',   notes: '' },
  { id: '6', owner: 'Julia Vargas',     pet: 'Thor',  breed: 'Labrador',         visits: 2,  last: '1 Oct',  rating: 4.7, petAge: '5 años', petWeight: '28 kg', petSpecies: 'Perro', phone: '+34 667 890 123', email: 'julia@email.com',   notes: '' },
  { id: '7', owner: 'Roberto Díaz',     pet: 'Coco',  breed: 'Pomerania',        visits: 15, last: '28 Sep', rating: 5.0, petAge: '7 años', petWeight: '3 kg',  petSpecies: 'Perro', phone: '+34 678 901 234', email: 'roberto@email.com', notes: '' },
];

function InitialsAvatar({ name, size = 50, bg = '#EDF2F4', color = Colors.textMedium }: { name: string; size?: number; bg?: string; color?: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Text style={{ fontSize: size * 0.34, fontWeight: '700', color }}>{initials}</Text>
    </View>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(3) }}>
      <Ionicons name="star" size={wp(11)} color="#F4A536" />
      <Text style={{ fontSize: FontSize.xs, fontWeight: '700', color: Colors.textDark }}>{value.toFixed(1)}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={detailStyles.infoRow}>
      <Ionicons name={icon as any} size={wp(16)} color={Colors.primary} />
      <View style={detailStyles.infoTexts}>
        <Text style={detailStyles.infoLabel}>{label}</Text>
        <Text style={detailStyles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );
}

function EditModal({ visible, client, onClose, onSave }: { visible: boolean; client: Client | null; onClose: () => void; onSave: (c: Client) => void }) {
  const [owner, setOwner]         = useState('');
  const [phone, setPhone]         = useState('');
  const [email, setEmail]         = useState('');
  const [pet, setPet]             = useState('');
  const [species, setSpecies]     = useState('Perro');
  const [breed, setBreed]         = useState('');
  const [petAge, setPetAge]       = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [notes, setNotes]         = useState('');

  React.useEffect(() => {
    if (client) {
      setOwner(client.owner);
      setPhone(client.phone ?? '');
      setEmail(client.email ?? '');
      setPet(client.pet);
      setSpecies(client.petSpecies ?? 'Perro');
      setBreed(client.breed);
      setPetAge(client.petAge ?? '');
      setPetWeight(client.petWeight ?? '');
      setNotes(client.notes ?? '');
    }
  }, [client]);

  const handleSave = () => {
    if (!owner.trim() || !pet.trim()) return;
    onSave({ ...client!, owner, phone, email, pet, petSpecies: species, breed, petAge, petWeight, notes });
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={editStyles.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={editStyles.kav}>
          <Pressable style={editStyles.sheet} onPress={Keyboard.dismiss}>
            <View style={editStyles.sheetHeader}>
              <Text style={editStyles.sheetTitle}>Editar cliente</Text>
              <TouchableOpacity onPress={onClose} style={editStyles.closeBtn}>
                <Ionicons name="close" size={wp(18)} color={Colors.textMedium} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={editStyles.body}>
              <Text style={editStyles.groupLabel}>DATOS DEL DUEÑO</Text>

              <View style={editStyles.inputGroup}>
                <Text style={editStyles.inputLabel}>Nombre completo *</Text>
                <TextInput style={editStyles.input} value={owner} onChangeText={setOwner} placeholder="Nombre del dueño" placeholderTextColor={Colors.placeholder} />
              </View>
              <View style={editStyles.inputGroup}>
                <Text style={editStyles.inputLabel}>Teléfono</Text>
                <TextInput style={editStyles.input} value={phone} onChangeText={setPhone} placeholder="+34 600 000 000" placeholderTextColor={Colors.placeholder} keyboardType="phone-pad" />
              </View>
              <View style={editStyles.inputGroup}>
                <Text style={editStyles.inputLabel}>Correo</Text>
                <TextInput style={editStyles.input} value={email} onChangeText={setEmail} placeholder="correo@ejemplo.com" placeholderTextColor={Colors.placeholder} keyboardType="email-address" autoCapitalize="none" />
              </View>

              <View style={editStyles.divider} />
              <Text style={editStyles.groupLabel}>DATOS DE LA MASCOTA</Text>

              <View style={editStyles.inputGroup}>
                <Text style={editStyles.inputLabel}>Nombre de la mascota *</Text>
                <TextInput style={editStyles.input} value={pet} onChangeText={setPet} placeholder="Nombre" placeholderTextColor={Colors.placeholder} />
              </View>

              <View style={editStyles.inputGroup}>
                <Text style={editStyles.inputLabel}>Especie</Text>
                <View style={editStyles.typeRow}>
                  {['Perro', 'Gato', 'Otro'].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[editStyles.typeBtn, species === t && editStyles.typeBtnActive]}
                      onPress={() => setSpecies(t)}
                    >
                      <Text style={[editStyles.typeBtnText, species === t && editStyles.typeBtnTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={editStyles.inputGroup}>
                <Text style={editStyles.inputLabel}>Raza</Text>
                <TextInput style={editStyles.input} value={breed} onChangeText={setBreed} placeholder="Ej: Labrador, Persa" placeholderTextColor={Colors.placeholder} />
              </View>
              <View style={editStyles.twoCol}>
                <View style={[editStyles.inputGroup, { flex: 1 }]}>
                  <Text style={editStyles.inputLabel}>Edad</Text>
                  <TextInput style={editStyles.input} value={petAge} onChangeText={setPetAge} placeholder="Ej: 3 años" placeholderTextColor={Colors.placeholder} />
                </View>
                <View style={[editStyles.inputGroup, { flex: 1 }]}>
                  <Text style={editStyles.inputLabel}>Peso</Text>
                  <TextInput style={editStyles.input} value={petWeight} onChangeText={setPetWeight} placeholder="Ej: 28 kg" placeholderTextColor={Colors.placeholder} />
                </View>
              </View>

              <View style={editStyles.divider} />
              <Text style={editStyles.groupLabel}>NOTAS</Text>
              <View style={editStyles.inputGroup}>
                <TextInput
                  style={[editStyles.input, editStyles.textarea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Observaciones, alergias, indicaciones especiales..."
                  placeholderTextColor={Colors.placeholder}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={editStyles.footer}>
              <TouchableOpacity style={editStyles.cancelBtn} onPress={onClose}>
                <Text style={editStyles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={editStyles.saveBtn} onPress={handleSave}>
                <Text style={editStyles.saveText}>Guardar cambios</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function DetailModal({ client, onClose, onEdit }: { client: Client; onClose: () => void; onEdit: () => void }) {
  const petInitials = client.pet.slice(0, 2).toUpperCase();

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible onRequestClose={onClose}>
      <SafeAreaView style={detailStyles.safe}>
        <View style={detailStyles.header}>
          <TouchableOpacity onPress={onClose} style={detailStyles.backBtn}>
            <Ionicons name="chevron-back" size={wp(22)} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={detailStyles.headerTitle}>Ficha del cliente</Text>
          <TouchableOpacity onPress={onEdit} style={detailStyles.editBtn}>
            <Text style={detailStyles.editText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={detailStyles.scroll}>
          <View style={detailStyles.heroCard}>
            <InitialsAvatar name={client.owner} size={wp(72)} bg={Colors.primaryLight} color={Colors.primary} />
            <Text style={detailStyles.heroName}>{client.owner}</Text>
            <View style={detailStyles.ratingRow}>
              <Ionicons name="star" size={wp(14)} color="#F4A536" />
              <Text style={detailStyles.ratingText}>{client.rating.toFixed(1)}</Text>
            </View>
            <View style={detailStyles.statsRow}>
              <View style={detailStyles.statItem}>
                <Text style={detailStyles.statValue}>{client.visits}</Text>
                <Text style={detailStyles.statLabel}>Visitas</Text>
              </View>
              <View style={detailStyles.statDivider} />
              <View style={detailStyles.statItem}>
                <Text style={detailStyles.statValue}>{client.last}</Text>
                <Text style={detailStyles.statLabel}>Última visita</Text>
              </View>
            </View>
          </View>

          <Text style={detailStyles.sectionTitle}>Contacto</Text>
          <View style={detailStyles.card}>
            <InfoRow icon="call-outline" label="Teléfono" value={client.phone ?? ''} />
            <View style={detailStyles.cardDivider} />
            <InfoRow icon="mail-outline" label="Correo"   value={client.email ?? ''} />
          </View>

          <Text style={detailStyles.sectionTitle}>Mascota</Text>
          <View style={detailStyles.card}>
            <View style={detailStyles.petHeroRow}>
              <View style={detailStyles.petBadgeLg}>
                <Text style={detailStyles.petBadgeLgText}>{petInitials}</Text>
              </View>
              <View>
                <Text style={detailStyles.petName}>{client.pet}</Text>
                <Text style={detailStyles.petBreed}>{client.breed}</Text>
              </View>
            </View>
            <View style={detailStyles.cardDivider} />
            <InfoRow icon="paw-outline"      label="Especie" value={client.petSpecies ?? ''} />
            <View style={detailStyles.cardDivider} />
            <InfoRow icon="calendar-outline" label="Edad"    value={client.petAge ?? ''} />
            <View style={detailStyles.cardDivider} />
            <InfoRow icon="scale-outline"    label="Peso"    value={client.petWeight ?? ''} />
          </View>

          {!!client.notes && (
            <>
              <Text style={detailStyles.sectionTitle}>Notas</Text>
              <View style={detailStyles.card}>
                <Text style={detailStyles.notesText}>{client.notes}</Text>
              </View>
            </>
          )}

          <View style={{ height: hp(32) }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function ClientesScreen() {
  const [query, setQuery]                   = useState('');
  const [clients, setClients]               = useState<Client[]>(INITIAL_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editVisible, setEditVisible]       = useState(false);

  const filtered = clients.filter(
    (c) =>
      c.owner.toLowerCase().includes(query.toLowerCase()) ||
      c.pet.toLowerCase().includes(query.toLowerCase())
  );

  const handleSaveEdit = (updated: Client) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedClient(updated);
    setEditVisible(false);
  };

  const handleEditFromDetail = () => {
    setEditVisible(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Clientes</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{clients.length} clientes</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={wp(16)} color={Colors.placeholder} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cliente o mascota..."
            placeholderTextColor={Colors.placeholder}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close" size={wp(14)} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scroll}>
        {filtered.map((client) => {
          const petInitials = client.pet.slice(0, 2).toUpperCase();
          return (
            <TouchableOpacity
              key={client.id}
              style={styles.clientCard}
              activeOpacity={0.8}
              onPress={() => setSelectedClient(client)}
            >
              <InitialsAvatar name={client.owner} size={wp(50)} />
              <View style={styles.clientInfo}>
                <View style={styles.clientTopRow}>
                  <Text style={styles.ownerName}>{client.owner}</Text>
                  <StarRating value={client.rating} />
                </View>
                <View style={styles.petRow}>
                  <View style={styles.petBadge}>
                    <Text style={styles.petBadgeText}>{petInitials}</Text>
                  </View>
                  <Text style={styles.petText}>{client.pet}  ·  {client.breed}</Text>
                </View>
                <Text style={styles.metaText}>{client.visits} visitas  ·  Últ: {client.last}</Text>
              </View>
              <Ionicons name="chevron-forward" size={wp(16)} color={Colors.textLight} />
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="search" size={wp(28)} color={Colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptySubtitle}>No hay clientes con ese nombre</Text>
          </View>
        )}

        <View style={{ height: hp(24) }} />
      </ScrollView>

      {selectedClient && !editVisible && (
        <DetailModal
          client={clients.find(c => c.id === selectedClient.id) ?? selectedClient}
          onClose={() => setSelectedClient(null)}
          onEdit={handleEditFromDetail}
        />
      )}

      <EditModal
        visible={editVisible}
        client={selectedClient}
        onClose={() => setEditVisible(false)}
        onSave={handleSaveEdit}
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
  pageTitle:  { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark, letterSpacing: -0.5 },
  countBadge: { backgroundColor: Colors.primaryLight, borderRadius: Radius.full, paddingHorizontal: wp(12), paddingVertical: hp(5) },
  countText:  { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },

  searchRow: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md, height: hp(46), gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textDark },

  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: hp(20) },
  clientCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, gap: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 1,
  },
  clientInfo:   { flex: 1 },
  clientTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(4) },
  ownerName:    { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark },
  petRow:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: hp(4) },
  petBadge:     { width: wp(20), height: wp(20), borderRadius: wp(5), backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  petBadgeText: { fontSize: wp(8), fontWeight: '800', color: Colors.primary },
  petText:      { fontSize: FontSize.xs, color: Colors.textMedium },
  metaText:     { fontSize: wp(10), color: Colors.textLight },

  emptyState:    { alignItems: 'center', paddingTop: hp(60), gap: Spacing.md },
  emptyIconBg:   { width: wp(64), height: wp(64), borderRadius: wp(32), backgroundColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  emptyTitle:    { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textDark },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textMedium },
});

const detailStyles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  backBtn:     { width: wp(36), height: wp(36), borderRadius: wp(18), backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textDark },
  editBtn:     { paddingHorizontal: Spacing.sm },
  editText:    { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '700' },

  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: hp(20) },

  heroCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.lg,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 2,
  },
  heroName:   { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textDark, marginTop: Spacing.md, marginBottom: hp(4) },
  ratingRow:  { flexDirection: 'row', alignItems: 'center', gap: wp(4), marginBottom: Spacing.md },
  ratingText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark },
  statsRow:   { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.sm },
  statItem:   { alignItems: 'center', gap: hp(2) },
  statValue:  { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textDark },
  statLabel:  { fontSize: FontSize.xs, color: Colors.textMedium },
  statDivider:{ width: 1, backgroundColor: Colors.borderLight, height: hp(32) },

  sectionTitle: { fontSize: wp(10), fontWeight: '700', color: Colors.textLight, letterSpacing: 0.8, marginBottom: Spacing.sm, marginTop: Spacing.sm },

  card: {
    backgroundColor: Colors.white, borderRadius: Radius.lg, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(1) }, elevation: 1,
    overflow: 'hidden',
  },
  cardDivider: { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: Spacing.md },

  infoRow:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  infoTexts: { flex: 1 },
  infoLabel: { fontSize: wp(10), color: Colors.textLight, fontWeight: '600', marginBottom: hp(2) },
  infoValue: { fontSize: FontSize.sm, color: Colors.textDark, fontWeight: '600' },

  petHeroRow:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  petBadgeLg:    { width: wp(48), height: wp(48), borderRadius: wp(12), backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  petBadgeLgText:{ fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  petName:       { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, marginBottom: hp(2) },
  petBreed:      { fontSize: FontSize.xs, color: Colors.textMedium },

  notesText: { fontSize: FontSize.sm, color: Colors.textDark, lineHeight: hp(22), padding: Spacing.md },
});

const editStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  kav:     { width: '100%' },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: hp(620),
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  sheetTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textDark },
  closeBtn:   { width: wp(32), height: wp(32), borderRadius: wp(16), backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },

  body: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg },

  groupLabel: { fontSize: wp(10), fontWeight: '700', color: Colors.textLight, letterSpacing: 0.8, marginBottom: Spacing.sm, marginTop: Spacing.xs },
  divider:    { height: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.md },

  inputGroup: { marginBottom: Spacing.sm },
  inputLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textDark, marginBottom: hp(5) },
  input: {
    backgroundColor: Colors.background, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? hp(13) : hp(9),
    fontSize: FontSize.sm, color: Colors.textDark,
  },
  textarea: { height: hp(80), textAlignVertical: 'top', paddingTop: hp(10) },

  twoCol: { flexDirection: 'row', gap: Spacing.sm },

  typeRow:           { flexDirection: 'row', gap: Spacing.sm },
  typeBtn:           { flex: 1, paddingVertical: hp(10), borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.borderLight, alignItems: 'center', backgroundColor: Colors.white },
  typeBtnActive:     { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeBtnText:       { fontSize: FontSize.xs, color: Colors.textMedium, fontWeight: '600' },
  typeBtnTextActive: { color: Colors.white },

  footer: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  cancelBtn: { flex: 1, height: hp(48), borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  cancelText:{ fontSize: FontSize.sm, color: Colors.textMedium, fontWeight: '600' },
  saveBtn:   { flex: 2, height: hp(48), borderRadius: Radius.full, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  saveText:  { fontSize: FontSize.sm, color: Colors.white, fontWeight: '700' },
});