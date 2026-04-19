import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const WEEKLY_DATA = [
  { label: 'S1', value: 320000, display: '$320k' },
  { label: 'S2', value: 480000, display: '$480k' },
  { label: 'S3', value: 570824, display: '$571k' },
  { label: 'S4', value: 390000, display: '$390k' },
];

const TRANSACTIONS = [
  { id: '1', client: 'Alejandro G.', service: 'Paseo', date: 'Hoy, 14:30', gross: 12500, net: 10625, status: 'completed' },
  { id: '2', client: 'Mariana S.', service: 'Peluquería', date: 'Ayer, 09:15', gross: 35000, net: 29750, status: 'completed' },
  { id: '3', client: 'Carlos R.', service: 'Adiestramiento', date: '18 Oct', gross: 22000, net: 18700, status: 'pending' },
  { id: '4', client: 'Laura M.', service: 'Vacunación', date: '17 Oct', gross: 15000, net: 12750, status: 'completed' },
  { id: '5', client: 'Pedro S.', service: 'Consulta', date: '16 Oct', gross: 30000, net: 25500, status: 'completed' },
];

function BarChart({ data, activeIdx, onPress }: { data: typeof WEEKLY_DATA; activeIdx: number; onPress: (i: number) => void }) {
  const maxVal = Math.max(...data.map((d) => d.value));
  const chartH = hp(100);
  const barW = wp(28);

  return (
    <View style={{ height: chartH + hp(36), paddingHorizontal: wp(8) }}>
      {[1, 0.5, 0].map((ratio, i) => (
        <View
          key={i}
          style={{
            position: 'absolute', top: chartH * (1 - ratio),
            left: 0, right: 0, height: 1, backgroundColor: '#EEF2F4',
          }}
        />
      ))}

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: chartH, justifyContent: 'space-around' }}>
        {data.map((item, i) => {
          const isActive = i === activeIdx;
          const barH = Math.max((item.value / maxVal) * chartH * 0.9, hp(8));

          return (
            <TouchableOpacity
              key={item.label}
              style={{ alignItems: 'center', gap: hp(6) }}
              onPress={() => onPress(i)}
              activeOpacity={0.8}
            >
              {isActive && (
                <View style={{ backgroundColor: Colors.primary, borderRadius: Radius.sm, paddingHorizontal: wp(6), paddingVertical: hp(2) }}>
                  <Text style={{ fontSize: wp(9), color: Colors.white, fontWeight: '700' }}>{item.display}</Text>
                </View>
              )}
              <View
                style={{
                  width: barW, height: barH, borderRadius: wp(8),
                  backgroundColor: isActive ? Colors.primary : '#DDE8E6',
                }}
              />
              <Text style={{ fontSize: wp(11), color: isActive ? Colors.primary : Colors.textLight, fontWeight: isActive ? '700' : '400' }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function FinanzasScreen() {
  const router = useRouter();
  const [activeWeek, setActiveWeek] = useState(2);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const totalGross = TRANSACTIONS.reduce((sum, t) => sum + t.gross, 0);
  const totalNet = TRANSACTIONS.reduce((sum, t) => sum + t.net, 0);
  const commission = totalGross - totalNet;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={wp(22)} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reporte de Finanzas</Text>
        <TouchableOpacity style={styles.downloadBtn}>
          <Ionicons name="download-outline" size={wp(22)} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scroll}>
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[styles.periodBtn, selectedPeriod === period && styles.periodBtnActive]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
                {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Año'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Ingresos Netos</Text>
          <Text style={styles.heroAmount}>${totalNet.toLocaleString('es-CO')}</Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroRow}>
            <Text style={styles.heroRowLabel}>Ingresos Brutos</Text>
            <Text style={styles.heroRowValue}>${totalGross.toLocaleString('es-CO')}</Text>
          </View>
          <View style={styles.heroRow}>
            <Text style={styles.heroRowLabel}>Comisiones (15%)</Text>
            <Text style={[styles.heroRowValue, { color: '#FFB3A7' }]}>-${commission.toLocaleString('es-CO')}</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>INGRESOS POR SEMANA</Text>
          <BarChart data={WEEKLY_DATA} activeIdx={activeWeek} onPress={setActiveWeek} />
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={wp(20)} color={Colors.primary} />
            <Text style={styles.statValue}>+12.5%</Text>
            <Text style={styles.statLabel}>vs mes anterior</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={wp(20)} color={Colors.primary} />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>citas este mes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash" size={wp(20)} color={Colors.primary} />
            <Text style={styles.statValue}>$18.5k</Text>
            <Text style={styles.statLabel}>promedio/cita</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Historial de Transacciones</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {TRANSACTIONS.map((tx) => (
          <View key={tx.id} style={styles.txCard}>
            <View style={styles.txIcon}>
              <MaterialCommunityIcons name="paw" size={wp(20)} color={Colors.primary} />
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txClient}>{tx.client}</Text>
              <Text style={styles.txMeta}>{tx.service} · {tx.date}</Text>
            </View>
            <View style={styles.txAmount}>
              <Text style={styles.txNet}>${tx.net.toLocaleString('es-CO')}</Text>
              <Text style={styles.txGross}>${tx.gross.toLocaleString('es-CO')}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.withdrawBtn}>
          <Ionicons name="cash-outline" size={wp(20)} color={Colors.white} />
          <Text style={styles.withdrawText}>Solicitar retiro</Text>
        </TouchableOpacity>

        <View style={{ height: hp(24) }} />
      </ScrollView>
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
  headerTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textDark },
  downloadBtn: {
    width: wp(40), height: wp(40), borderRadius: wp(20),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },

  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: hp(20) },

  periodSelector: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: Radius.full, padding: wp(4), marginBottom: Spacing.lg,
  },
  periodBtn: { flex: 1, paddingVertical: hp(10), alignItems: 'center', borderRadius: Radius.full },
  periodBtnActive: { backgroundColor: Colors.primary },
  periodText: { fontSize: FontSize.sm, color: Colors.textMedium, fontWeight: '600' },
  periodTextActive: { color: Colors.white },

  heroCard: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl,
    padding: Spacing.lg, marginBottom: Spacing.lg,
  },
  heroLabel: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginBottom: hp(4) },
  heroAmount: { fontSize: wp(38), fontWeight: '800', color: Colors.white, marginBottom: Spacing.md },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: Spacing.md },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(4) },
  heroRowLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)' },
  heroRowValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white },

  chartCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.md, marginBottom: Spacing.lg,
  },
  chartTitle: {
    fontSize: wp(10), fontWeight: '700', color: Colors.textLight,
    letterSpacing: 1, textAlign: 'center', marginBottom: Spacing.md,
  },

  statsGrid: {
    flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center',
  },
  statValue: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textDark, marginTop: hp(4), marginBottom: hp(2) },
  statLabel: { fontSize: FontSize.xs, color: Colors.textLight },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textDark },
  sectionLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  txCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md,
  },
  txIcon: {
    width: wp(44), height: wp(44), borderRadius: wp(12),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  txInfo: { flex: 1 },
  txClient: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark, marginBottom: hp(2) },
  txMeta: { fontSize: FontSize.xs, color: Colors.textMedium },
  txAmount: { alignItems: 'flex-end' },
  txNet: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  txGross: { fontSize: FontSize.xs, color: Colors.textLight, textDecorationLine: 'line-through' },

  withdrawBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: hp(14), marginTop: Spacing.lg, gap: Spacing.sm,
  },
  withdrawText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },
});