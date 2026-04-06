/**
 * app/pro-tabs/clientes.tsx
 * Lista de clientes. Sin emojis ni dependencias externas.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

const CLIENTS = [
  { id: '1', owner: 'Carlos García',   pet: 'Max',    breed: 'Golden Retriever', visits: 8,  last: 'Hoy',    rating: 5.0 },
  { id: '2', owner: 'Ana Pérez',        pet: 'Luna',   breed: 'Siamés',           visits: 5,  last: 'Ayer',   rating: 4.8 },
  { id: '3', owner: 'Luis Martínez',    pet: 'Rocky',  breed: 'Maltés',           visits: 12, last: '8 Oct',  rating: 5.0 },
  { id: '4', owner: 'Marta Rodríguez',  pet: 'Toby',   breed: 'Beagle',           visits: 3,  last: '5 Oct',  rating: 4.5 },
  { id: '5', owner: 'Pedro Sánchez',    pet: 'Mia',    breed: 'Poodle',           visits: 7,  last: '3 Oct',  rating: 4.9 },
  { id: '6', owner: 'Julia Vargas',     pet: 'Thor',   breed: 'Labrador',         visits: 2,  last: '1 Oct',  rating: 4.7 },
  { id: '7', owner: 'Roberto Díaz',     pet: 'Coco',   breed: 'Pomerania',        visits: 15, last: '28 Sep', rating: 5.0 },
];

function InitialsAvatar({ name, size = 50 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#EDF2F4', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Text style={{ fontSize: size * 0.34, fontWeight: '700', color: Colors.textMedium }}>{initials}</Text>
    </View>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(3) }}>
      <Ionicons name="star" size={wp(11)} color="#F4A536" />
      <Text style={{ fontSize: FontSize.xs, fontWeight: '700', color: Colors.textDark }}>
        {value.toFixed(1)}
      </Text>
    </View>
  );
}

export default function ClientesScreen() {
  const [query, setQuery] = useState('');

  const filtered = CLIENTS.filter(
    (c) =>
      c.owner.toLowerCase().includes(query.toLowerCase()) ||
      c.pet.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Clientes</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{CLIENTS.length} clientes</Text>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filtered.map((client) => {
          const petInitials = client.pet.slice(0, 2).toUpperCase();
          return (
            <TouchableOpacity key={client.id} style={styles.clientCard} activeOpacity={0.8}>
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

                <Text style={styles.metaText}>
                  {client.visits} visitas  ·  Últ: {client.last}
                </Text>
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

  scroll: { paddingHorizontal: Spacing.lg },
  clientCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, gap: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 1,
  },
  clientInfo:    { flex: 1 },
  clientTopRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(4) },
  ownerName:     { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark },
  petRow:        { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: hp(4) },
  petBadge:      { width: wp(20), height: wp(20), borderRadius: wp(5), backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  petBadgeText:  { fontSize: wp(8), fontWeight: '800', color: Colors.primary },
  petText:       { fontSize: FontSize.xs, color: Colors.textMedium },
  metaText:      { fontSize: wp(10), color: Colors.textLight },

  emptyState:    { alignItems: 'center', paddingTop: hp(60), gap: Spacing.md },
  emptyIconBg:   { width: wp(64), height: wp(64), borderRadius: wp(32), backgroundColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  emptyTitle:    { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textDark },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textMedium },
});