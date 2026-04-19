import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

const FILTER_CHIPS = ['Tipo de servicio', 'Precio', 'Calificación'];

const PROFESSIONALS = [
  { id: '1', name: 'Dr. Carlos Ruiz',       specialty: 'Veterinario',              distance: '1.2 km de ti', rating: 4.8, price: 25,  online: true  },
  { id: '2', name: 'Elena Martínez',         specialty: 'Paseadora y Entrenadora',  distance: '0.5 km de ti', rating: 4.9, price: 15,  online: true  },
  { id: '3', name: 'Roberto Gómez',          specialty: 'Peluquería Canina',        distance: '2.8 km de ti', rating: 4.7, price: 20,  online: false },
  { id: '4', name: 'Clínica VetLife',        specialty: 'Urgencias 24h',            distance: '3.1 km de ti', rating: 4.5, price: 40,  online: true  },
];

const CATEGORIES = ['Veterinario', 'Peluquería', 'Paseador', 'Entrenamiento', 'Guardería', 'Tienda'];

function FilterModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>(['Veterinario']);
  const toggle = (c: string) =>
    setSelected((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={fStyles.safe}>
        <View style={fStyles.header}>
          <Text style={fStyles.title}>Filtrar por</Text>
          <TouchableOpacity onPress={onClose} style={fStyles.closeBtn}>
            <Ionicons name="close" size={wp(18)} color={Colors.textMedium} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={fStyles.scroll} showsVerticalScrollIndicator={false}>
          {/* Categoría */}
          <Text style={fStyles.sectionLabel}>CATEGORÍA</Text>
          <View style={fStyles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[fStyles.categoryItem, selected.includes(cat) && fStyles.categoryItemOn]}
                onPress={() => toggle(cat)}
              >
                <View style={[fStyles.checkbox, selected.includes(cat) && fStyles.checkboxOn]}>
                  {selected.includes(cat) && <Ionicons name="checkmark" size={wp(12)} color={Colors.white} />}
                </View>
                <Text style={[fStyles.categoryText, selected.includes(cat) && fStyles.categoryTextOn]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rango de precio */}
          <View style={fStyles.sectionRow}>
            <Text style={fStyles.sectionLabel}>RANGO DE PRECIO</Text>
            <Text style={fStyles.sectionValue}>$20 - $150+</Text>
          </View>
          {/* Slider visual */}
          <View style={fStyles.sliderTrack}>
            <View style={fStyles.sliderFill} />
            <View style={[fStyles.sliderThumb, { left: '10%' }]} />
            <View style={[fStyles.sliderThumb, { left: '80%' }]} />
          </View>
          <View style={fStyles.sliderLabels}>
            <Text style={fStyles.sliderLabel}>Mín: $0</Text>
            <Text style={fStyles.sliderLabel}>Máx: $500</Text>
          </View>

          {/* Calificación mínima */}
          <View style={fStyles.sectionRow}>
            <Text style={fStyles.sectionLabel}>CALIFICACIÓN MÍNIMA</Text>
            <Text style={fStyles.sectionValue}>4.0+</Text>
          </View>
          <View style={fStyles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons 
                key={i} 
                name={i <= 4 ? "star" : "star-outline"} 
                size={wp(24)} 
                color={i <= 4 ? "#F4A536" : Colors.borderLight} 
              />
            ))}
          </View>

          {/* Distancia máxima */}
          <View style={fStyles.sectionRow}>
            <Text style={fStyles.sectionLabel}>DISTANCIA MÁXIMA</Text>
            <Text style={fStyles.sectionValue}>12 km</Text>
          </View>
          <View style={fStyles.sliderTrack}>
            <View style={[fStyles.sliderFill, { width: '60%' }]} />
            <View style={[fStyles.sliderThumb, { left: '60%' }]} />
          </View>
        </ScrollView>

        {/* Acciones */}
        <View style={fStyles.footer}>
          <TouchableOpacity style={fStyles.applyBtn} onPress={onClose}>
            <Text style={fStyles.applyText}>Aplicar filtros →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={fStyles.clearBtn} onPress={() => setSelected([])}>
            <Text style={fStyles.clearText}>Limpiar todo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function BuscarScreen() {
  const router = useRouter();
  const [query, setQuery]           = useState('');
  const [activeChip, setActiveChip] = useState('Tipo de servicio');
  const [showFilter, setShowFilter] = useState(false);

  const filtered = PROFESSIONALS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.specialty.toLowerCase().includes(query.toLowerCase())
  );

  const getProfessionalIcon = (specialty: string) => {
    if (specialty.includes('Veterinario')) return 'medical-bag';
    if (specialty.includes('Paseadora')) return 'walk';
    if (specialty.includes('Peluquería')) return 'content-cut';
    return 'paw';
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Explorar</Text>
      </View>

      {/* Buscador */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={wp(18)} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="¿Qué servicio buscas?"
            placeholderTextColor={Colors.placeholder}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {/* Chips de filtro */}
      <View style={styles.chipsRow}>
        {FILTER_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip}
            style={[styles.chip, activeChip === chip && styles.chipActive]}
            onPress={() => {
              setActiveChip(chip);
              if (chip === 'Tipo de servicio') setShowFilter(true);
            }}
          >
            <Text style={[styles.chipText, activeChip === chip && styles.chipTextActive]}>
              {chip}{chip === 'Tipo de servicio' ? ' ˅' : ''}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Filtro avanzado */}
        <TouchableOpacity style={styles.filterIconBtn} onPress={() => setShowFilter(true)}>
          <Ionicons name="options-outline" size={wp(18)} color={Colors.textMedium} />
        </TouchableOpacity>
      </View>

      {/* Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>PROFESIONALES CERCANOS ({filtered.length * 10 + 2})</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filtered.map((pro) => (
          <TouchableOpacity
            key={pro.id}
            style={styles.proCard}
            activeOpacity={0.8}
            onPress={() => router.push(`/citas/agendar?pro=${pro.id}` as any)}
          >
            <View style={styles.proAvatarWrapper}>
              <View style={styles.proAvatar}>
                <MaterialCommunityIcons 
                  name={getProfessionalIcon(pro.specialty)} 
                  size={wp(28)} 
                  color={Colors.primary} 
                />
              </View>
              {pro.online && <View style={styles.onlineDot} />}
            </View>

            <View style={styles.proInfo}>
              <View style={styles.proNameRow}>
                <Text style={styles.proName}>{pro.name}</Text>
                <View style={styles.ratingPill}>
                  <Ionicons name="star" size={wp(11)} color="#F4A536" />
                  <Text style={styles.ratingVal}>{pro.rating}</Text>
                </View>
              </View>
              <Text style={styles.proSpecialty}>{pro.specialty}</Text>
              <View style={styles.proFooter}>
                <View style={styles.distanceRow}>
                  <Ionicons name="location-outline" size={wp(12)} color={Colors.textMedium} />
                  <Text style={styles.distText}>{pro.distance}</Text>
                </View>
                <Text style={styles.proPrice}>Desde <Text style={styles.proPriceVal}>${pro.price}</Text></Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: hp(16) }} />
      </ScrollView>

      {/* Botón flotante Ver mapa */}
      <TouchableOpacity style={styles.mapFab}>
        <Ionicons name="map-outline" size={wp(18)} color={Colors.white} />
        <Text style={styles.mapFabText}>Ver mapa</Text>
      </TouchableOpacity>

      <FilterModal visible={showFilter} onClose={() => setShowFilter(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.background },
  header:    { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  pageTitle: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark },
  searchRow: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md, height: hp(48), gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textDark },
  chipsRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg,
    gap: Spacing.sm, marginBottom: Spacing.sm, alignItems: 'center',
  },
  chip: {
    paddingHorizontal: wp(14), paddingVertical: hp(8),
    borderRadius: Radius.full, borderWidth: 1.5,
    borderColor: Colors.borderLight, backgroundColor: Colors.white,
  },
  chipActive:     { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText:       { fontSize: FontSize.xs, color: Colors.textMedium, fontWeight: '600' },
  chipTextActive: { color: Colors.white },
  filterIconBtn: {
    width: wp(36), height: wp(36), borderRadius: wp(18),
    backgroundColor: Colors.white, borderWidth: 1.5,
    borderColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center',
  },
  countRow:   { paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  countText:  { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textLight, letterSpacing: 0.5 },
  scroll:     { paddingHorizontal: Spacing.lg },
  proCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 2, gap: Spacing.md,
  },
  proAvatarWrapper: { position: 'relative' },
  proAvatar: {
    width: wp(60), height: wp(60), borderRadius: wp(16),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute', bottom: hp(2), right: wp(2),
    width: wp(12), height: wp(12), borderRadius: wp(6),
    backgroundColor: '#4CAF50', borderWidth: 2, borderColor: Colors.white,
  },
  proInfo:      { flex: 1 },
  proNameRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: hp(2) },
  proName:      { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, flex: 1 },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFBEA', borderRadius: Radius.full,
    paddingHorizontal: wp(6), paddingVertical: hp(2), gap: wp(2),
  },
  ratingVal:    { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textDark },
  proSpecialty: { fontSize: FontSize.xs, color: Colors.textMedium, marginBottom: hp(6) },
  proFooter:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  distanceRow:  { flexDirection: 'row', alignItems: 'center', gap: wp(2) },
  distText:     { fontSize: FontSize.xs, color: Colors.textMedium },
  proPrice:     { fontSize: FontSize.xs, color: Colors.textMedium },
  proPriceVal:  { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },
  mapFab: {
    position: 'absolute', bottom: hp(24), alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.textDark, borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg, paddingVertical: hp(12), gap: Spacing.sm,
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: wp(12),
    shadowOffset: { width: 0, height: hp(4) }, elevation: 8,
  },
  mapFabText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: '700' },
});

// ─── Estilos del Modal de Filtros ────────────────────────
const fStyles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  title:    { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textDark },
  closeBtn: {
    width: wp(32), height: wp(32), borderRadius: wp(16),
    backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
  },
  scroll:        { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.md,
  },
  sectionLabel:  { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textLight, letterSpacing: 0.5 },
  sectionValue:  { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  categoryItem: {
    flexDirection: 'row', alignItems: 'center',
    width: '47%', paddingVertical: hp(12), paddingHorizontal: Spacing.md,
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.borderLight,
    backgroundColor: Colors.white, gap: Spacing.sm,
  },
  categoryItemOn: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  checkbox: {
    width: wp(20), height: wp(20), borderRadius: wp(4),
    borderWidth: 2, borderColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn:    { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryText:  { fontSize: FontSize.sm, color: Colors.textMedium, fontWeight: '500' },
  categoryTextOn:{ color: Colors.primary, fontWeight: '700' },
  sliderTrack: {
    width: '100%', height: hp(6), backgroundColor: Colors.borderLight,
    borderRadius: hp(3), position: 'relative', marginBottom: Spacing.sm,
  },
  sliderFill: {
    position: 'absolute', left: '10%', right: '20%',
    height: '100%', backgroundColor: Colors.primary, borderRadius: hp(3),
  },
  sliderThumb: {
    position: 'absolute', top: -hp(7),
    width: wp(20), height: wp(20), borderRadius: wp(10),
    backgroundColor: Colors.white, borderWidth: 2.5, borderColor: Colors.primary,
    shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: wp(4),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 3,
  },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabel:  { fontSize: FontSize.xs, color: Colors.textLight },
  starsRow:     { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  footer: {
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    alignItems: 'center',
  },
  applyBtn: {
    width: '100%', height: hp(54), backgroundColor: Colors.primary,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  applyText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '600' },
  clearBtn:  { paddingVertical: Spacing.sm },
  clearText: { fontSize: FontSize.sm, color: Colors.textMedium, fontWeight: '500' },
});