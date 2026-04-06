import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

export default function PersonalInfoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Regresar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Información personal</Text>

        <View style={styles.card}>
          <View style={styles.item}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>Juan Pérez</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>Correo</Text>
            <Text style={styles.value}>juan@email.com</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.value}>+504 9999-9999</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg },

  back: {
    color: Colors.primary,
    marginBottom: Spacing.md,
    fontSize: FontSize.sm,
  },

  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
    color: Colors.textDark,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },

  item: {
    marginBottom: Spacing.md,
  },

  label: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },

  value: {
    fontSize: FontSize.md,
    color: Colors.textDark,
    fontWeight: '600',
  },
});