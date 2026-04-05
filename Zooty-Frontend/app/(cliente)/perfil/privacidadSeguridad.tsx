import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

export default function SecurityScreen() {
  const router = useRouter();

  const Item = ({ label }: { label: string }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Regresar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Privacidad y seguridad</Text>

        <View style={styles.card}>
          <Item label="Cambiar contraseña" />
          <Item label="Autenticación en dos pasos" />
          <Item label="Sesiones activas" />
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
  },

  item: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },

  itemText: {
    fontSize: FontSize.sm,
    color: Colors.textDark,
  },
});