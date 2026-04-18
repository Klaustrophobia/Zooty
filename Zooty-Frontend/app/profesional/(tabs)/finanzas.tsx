import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Dimensions,
  Modal, Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
import PrimaryButton from '@/components/PrimaryButton';

const SCREEN_W = Dimensions.get('window').width;

const WEEKLY = [
  { label: 'S1', value: 320000, display: '$320k' },
  { label: 'S2', value: 480000, display: '$480k' },
  { label: 'S3', value: 570824, display: '$571k' },
  { label: 'S4', value: 390000, display: '$390k' },
];

const TRANSACTIONS = [
  { id: '1', name: 'Alejandro G.', date: 'Hoy, 14:30',  service: 'Paseo',          gross: 12500, net: 10625 },
  { id: '2', name: 'Mariana S.',   date: 'Ayer, 09:15', service: 'Peluquería',      gross: 35000, net: 29750 },
  { id: '3', name: 'Carlos R.',    date: '18 Oct',       service: 'Adiestramiento', gross: 22000, net: 18700 },
];

function BarChart({ data, activeIdx, onPress }: {
  data: typeof WEEKLY;
  activeIdx: number;
  onPress: (i: number) => void;
}) {
  const maxVal = Math.max(...data.map((d) => d.value));
  const chartH = hp(100);
  const barW = wp(28);

  return (
    <View style={{ height: chartH + hp(36), paddingHorizontal: wp(8) }}>
      {[1, 0.5, 0].map((ratio, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: chartH * (1 - ratio),
            left: 0, right: 0, height: 1,
            backgroundColor: '#EEF2F4',
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
                  <Text style={{ fontSize: wp(9), color: Colors.white, fontWeight: '700' }}>
                    {item.display}
                  </Text>
                </View>
              )}
              <View
                style={{
                  width: barW,
                  height: barH,
                  borderRadius: wp(8),
                  backgroundColor: isActive ? Colors.primary : '#DDE8E6',
                }}
              />
              <Text style={{ fontSize: wp(11), color: isActive ? Colors.primary : Colors.textLight, fontWeight: isActive ? '700' : '400', marginTop: hp(4) }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function InitialsAvatar({ name, size = 48, bg = '#EDF2F4', color = Colors.textMedium }: {
  name: string; size?: number; bg?: string; color?: string;
}) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Text style={{ fontSize: size * 0.34, fontWeight: '700', color }}>{initials}</Text>
    </View>
  );
}

export default function FinanzasScreen() {
  const [activeWeek, setActiveWeek] = useState(2);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleWithdraw = async () => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setWithdrawModalVisible(false);
    setWithdrawSuccess(true);
  };

  const closeSuccessModal = () => {
    setWithdrawSuccess(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Mis Finanzas</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Text style={styles.heroLabel}>Ingresos Netos del Mes</Text>
            <View style={styles.heroIconBtn}>
              <MaterialCommunityIcons name="chart-bar" size={wp(16)} color={Colors.white} />
            </View>
          </View>

          <Text style={styles.heroAmount}>$485.200</Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroBreakdown}>
            <View style={styles.heroBreakdownRow}>
              <Text style={styles.heroBreakdownLabel}>Ingresos Brutos</Text>
              <Text style={styles.heroBreakdownVal}>$570.824</Text>
            </View>
            <View style={styles.heroBreakdownRow}>
              <Text style={styles.heroBreakdownLabel}>Comisiones Zooty (15%)</Text>
              <Text style={[styles.heroBreakdownVal, { color: '#FFB3A7' }]}>$85.624</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>INGRESOS POR SEMANA</Text>
          <BarChart data={WEEKLY} activeIdx={activeWeek} onPress={setActiveWeek} />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Transacciones Recientes</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        {TRANSACTIONS.map((tx) => (
          <View key={tx.id} style={styles.txCard}>
            <InitialsAvatar name={tx.name} size={wp(48)} />
            <View style={styles.txInfo}>
              <Text style={styles.txName}>{tx.name}</Text>
              <Text style={styles.txMeta}>{tx.date}  ·  {tx.service}</Text>
              <Text style={styles.txGross}>${tx.gross.toLocaleString('es-CO')}</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={styles.txNet}>${tx.net.toLocaleString('es-CO')}</Text>
              <View style={styles.netTag}>
                <Text style={styles.netTagText}>neto</Text>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.withdrawRow}
          onPress={() => setWithdrawModalVisible(true)}
        >
          <View style={styles.withdrawLeft}>
            <View style={styles.withdrawIconBg}>
              <Ionicons name="cash-outline" size={wp(18)} color={Colors.primary} />
            </View>
            <Text style={styles.withdrawText}>Solicitar retiro</Text>
          </View>
          <Ionicons name="chevron-forward" size={wp(16)} color={Colors.textLight} />
        </TouchableOpacity>

        <View style={{ height: hp(24) }} />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={withdrawModalVisible}
        onRequestClose={() => setWithdrawModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="cash-outline" size={wp(48)} color={Colors.primary} />
            </View>
            
            <Text style={styles.modalTitle}>Solicitar retiro</Text>
            
            <View style={styles.modalAmountContainer}>
              <Text style={styles.modalAmountLabel}>Saldo disponible</Text>
              <Text style={styles.modalAmount}>$485.200</Text>
            </View>
            
            <Text style={styles.modalDescription}>
              ¿Deseas solicitar el retiro de tu saldo disponible?
            </Text>
            
            <View style={styles.modalInfo}>
              <Ionicons name="time-outline" size={wp(18)} color={Colors.textLight} />
              <Text style={styles.modalInfoText}>
                El pago se procesará en las próximas 24-48 horas hábiles
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelBtn}
                onPress={() => setWithdrawModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalConfirmBtn, loading && styles.modalConfirmBtnLoading]}
                onPress={handleWithdraw}
                disabled={loading}
              >
                <Text style={styles.modalConfirmBtnText}>
                  {loading ? 'Procesando...' : 'Confirmar retiro'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={withdrawSuccess}
        onRequestClose={closeSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIcon, styles.successIcon]}>
              <Ionicons name="checkmark-circle" size={wp(56)} color="#4CAF50" />
            </View>
            
            <Text style={styles.modalTitle}>¡Retiro solicitado!</Text>
            
            <Text style={styles.modalDescription}>
              Tu solicitud de retiro por <Text style={styles.successAmount}>$485.200</Text> ha sido procesada exitosamente.
            </Text>
            
            <View style={styles.successInfo}>
              <Ionicons name="checkmark-circle" size={wp(18)} color="#4CAF50" />
              <Text style={styles.successInfoText}>
                Recibirás el pago en tu cuenta bancaria en las próximas 24-48 horas hábiles
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalConfirmBtn}
                onPress={closeSuccessModal}
              >
                <Text style={styles.modalConfirmBtnText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  pageTitle: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark, letterSpacing: -0.5 },
  scroll: { paddingHorizontal: Spacing.lg },

  heroCard: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: wp(16),
    shadowOffset: { width: 0, height: hp(6) }, elevation: 8,
  },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(6) },
  heroLabel: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  heroIconBtn: { width: wp(32), height: wp(32), borderRadius: wp(10), backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  heroAmount: { fontSize: wp(38), fontWeight: '800', color: Colors.white, letterSpacing: -1, marginBottom: Spacing.md },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: Spacing.md },
  heroBreakdown: { gap: hp(8) },
  heroBreakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  heroBreakdownLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.75)' },
  heroBreakdownVal: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.white },

  chartCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 2,
  },
  chartTitle: {
    fontSize: wp(10), fontWeight: '700', color: Colors.textLight,
    letterSpacing: 1, textAlign: 'center', marginBottom: Spacing.md,
  },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textDark },
  sectionLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  txCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, gap: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(6),
    shadowOffset: { width: 0, height: hp(1) }, elevation: 1,
  },
  txInfo: { flex: 1 },
  txName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textDark, marginBottom: hp(2) },
  txMeta: { fontSize: FontSize.xs, color: Colors.textMedium, marginBottom: hp(3) },
  txGross: { fontSize: FontSize.xs, color: Colors.textLight },
  txRight: { alignItems: 'flex-end', gap: hp(4) },
  txNet: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  netTag: { backgroundColor: Colors.primaryLight, borderRadius: Radius.full, paddingHorizontal: wp(6), paddingVertical: hp(2) },
  netTagText: { fontSize: wp(9), color: Colors.primary, fontWeight: '700' },

  withdrawRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(6),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 1,
  },
  withdrawLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  withdrawIconBg: { width: wp(38), height: wp(38), borderRadius: wp(10), backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  withdrawText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textDark },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: wp(400),
  },
  modalIcon: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  successIcon: {
    marginBottom: Spacing.sm,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalAmountContainer: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  modalAmountLabel: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginBottom: hp(4),
  },
  modalAmount: {
    fontSize: wp(32),
    fontWeight: '800',
    color: Colors.primary,
  },
  modalDescription: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: hp(20),
    marginBottom: Spacing.md,
  },
  successAmount: {
    fontWeight: '700',
    color: Colors.primary,
  },
  modalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FAF8',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  modalInfoText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textMedium,
  },
  successInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  successInfoText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: '#2E7D32',
    lineHeight: hp(20),
  },
  modalActions: {
    gap: Spacing.sm,
  },
  modalCancelBtn: {
    paddingVertical: hp(12),
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: FontSize.md,
    color: Colors.textMedium,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    paddingVertical: hp(12),
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalConfirmBtnLoading: {
    opacity: 0.7,
  },
  modalConfirmBtnText: {
    fontSize: FontSize.md,
    color: Colors.white,
    fontWeight: '600',
  },
});