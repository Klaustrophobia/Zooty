import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

const { width } = Dimensions.get('window');

// ─── Datos mock ──────────────────────────────────────────
const UPCOMING_APPOINTMENTS = [
  {
    id: '1',
    petName: 'Max',
    service: 'Baño & Corte',
    breed: 'Golden Retriever',
    time: '10:30',
    status: 'arrival',
  },
  {
    id: '2',
    petName: 'Luna',
    service: 'Vacunación',
    breed: 'Siamés',
    time: '11:45',
    status: 'arrival',
  },
  {
    id: '3',
    petName: 'Oliver',
    service: 'Consulta General',
    breed: 'Maltés',
    time: '13:30',
    status: 'arrival',
  },
];

// ─── Componente Avatar de mascota ─────────────────────────
function PetAvatar({ initials }: { initials: string }) {
  return (
    <View style={styles.petAvatar}>
      <Text style={styles.petAvatarText}>{initials}</Text>
    </View>
  );
}

// ─── Tarjeta de cita próxima ──────────────────────────────
function AppointmentCard({ item }: { item: typeof UPCOMING_APPOINTMENTS[0] }) {
  const initials = item.petName.slice(0, 2).toUpperCase();
  return (
    <View style={styles.appointmentCard}>
      <PetAvatar initials={initials} />
      <View style={styles.appointmentInfo}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.petName}>{item.petName}</Text>
          <Text style={styles.appointmentTime}>{item.time}</Text>
        </View>
        <Text style={styles.serviceDetail}>
          {item.service} · {item.breed}
        </Text>
        <View style={styles.actionButtons}>
          <View style={styles.arrivalBadge}>
            <Text style={styles.arrivalText}>ARRIVAL</Text>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <Text style={styles.infoText}>INFO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────
export default function ProInicioScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Z</Text>
          </View>
          <Text style={styles.brandName}>Zooty</Text>
        </View>
        <View style={styles.headerRight}>
           <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('../perfil/notificacionesProfesionales')}
          >
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>AV</Text>
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Saludo */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeGreeting}>Buenos días,</Text>
          <Text style={styles.welcomeName}>Dr. Alejandro V.</Text>
        </View>

        {/* Tarjetas de estadísticas */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={[styles.statIcon, styles.statIconPrimary]}>
              <Text style={styles.statIconText}>C</Text>
            </View>
            <Text style={styles.statLabel}>CITAS HOY</Text>
            <Text style={styles.statValue}>08</Text>
          </View>

          <View style={[styles.statCard, styles.statCardSecondary]}>
            <View style={[styles.statIcon, styles.statIconSecondary]}>
              <Text style={styles.statIconText}>$</Text>
            </View>
            <Text style={styles.statLabel}>GANANCIA HOY</Text>
            <Text style={styles.statValue}>$345</Text>
          </View>
        </View>

        {/* Resumen de Finanzas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resumen de Finanzas</Text>
          <View style={styles.monthBadge}>
            <Text style={styles.monthBadgeText}>Octubre</Text>
          </View>
        </View>

        <View style={styles.financeCard}>
          <View style={styles.financeRow}>
            <Text style={styles.financeLabel}>Total del mes</Text>
            <Text style={styles.financeValue}>$2,450.00</Text>
          </View>
          <View style={styles.financeRow}>
            <Text style={styles.financeLabel}>Comisiones Zooty (10%)</Text>
            <Text style={[styles.financeValue, styles.financeValueNegative]}>-$245.00</Text>
          </View>

          <View style={styles.financeDivider} />

          <View style={styles.financeNetRow}>
            <Text style={styles.financeNetLabel}>Ingreso neto</Text>
            <Text style={styles.financeNetValue}>$2,205.00</Text>
          </View>

          <TouchableOpacity
            style={styles.financeLink}
            onPress={() => router.push('/pro-tabs/finanzas' as any)}
          >
            <Text style={styles.financeLinkText}>Ver reporte detallado →</Text>
          </TouchableOpacity>
        </View>

        {/* Próximas Citas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas Citas</Text>
          <TouchableOpacity onPress={() => router.push('/pro-tabs/calendario' as any)}>
            <Text style={styles.sectionLink}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {UPCOMING_APPOINTMENTS.map((appointment) => (
          <AppointmentCard key={appointment.id} item={appointment} />
        ))}

        <View style={{ height: hp(24) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },

  scrollContent: { 
    paddingHorizontal: Spacing.lg, 
    paddingBottom: hp(24) 
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Spacing.sm 
  },
  logo: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { 
    color: Colors.primary, 
    fontWeight: '800', 
    fontSize: wp(16) 
  },
  brandName: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Spacing.sm 
  },
  notificationButton: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: wp(6),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 2,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: hp(4),
    right: wp(4),
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  notificationBadgeText: { 
    color: Colors.white, 
    fontSize: wp(8), 
    fontWeight: '700' 
  },
  avatar: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    position: 'relative',
  },
  avatarText: { 
    fontSize: wp(18), 
    fontWeight: '600', 
    color: Colors.primary 
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: hp(0),
    right: wp(0),
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#34D399',
    borderWidth: 2,
    borderColor: Colors.white,
  },

  /* Welcome section */
  welcomeSection: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  welcomeGreeting: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    marginBottom: hp(2),
  },
  welcomeName: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textDark,
    letterSpacing: -0.3,
  },

  /* Stats grid */
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 1,
  },
  statCardPrimary: {
    backgroundColor: '#E8F7F5',
  },
  statCardSecondary: {
    backgroundColor: '#FFF4EE',
  },
  statIcon: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(10),
  },
  statIconPrimary: {
    backgroundColor: Colors.primary,
  },
  statIconSecondary: {
    backgroundColor: '#F4845F',
  },
  statIconText: { 
    fontSize: wp(22), 
    fontWeight: '600', 
    color: Colors.white 
  },
  statLabel: {
    fontSize: wp(11),
    fontWeight: '700',
    color: Colors.textLight,
    letterSpacing: 0.5,
    marginBottom: hp(4),
  },
  statValue: {
    fontSize: wp(28),
    fontWeight: '800',
    color: Colors.textDark,
    letterSpacing: -0.5,
  },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: { 
    fontSize: FontSize.lg, 
    fontWeight: '700', 
    color: Colors.textDark 
  },
  sectionLink: { 
    fontSize: FontSize.sm, 
    color: Colors.primary, 
    fontWeight: '600' 
  },

  /* Month badge */
  monthBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: wp(10),
    paddingVertical: hp(4),
  },
  monthBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
  },

  /* Finance card */
  financeCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 2,
  },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  financeLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
  },
  financeValue: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textDark,
  },
  financeValueNegative: {
    color: Colors.error,
  },
  financeDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  financeNetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  financeNetLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
  },
  financeNetValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  financeLink: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  financeLinkText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },

  /* Appointment card */
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 2,
    gap: Spacing.md,
  },
  petAvatar: {
    width: wp(56),
    height: wp(56),
    borderRadius: wp(16),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  petAvatarText: {
    fontSize: wp(24),
    fontWeight: '600',
    color: Colors.primary,
  },
  appointmentInfo: { 
    flex: 1 
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  petName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
    flex: 1,
  },
  appointmentTime: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  serviceDetail: {
    fontSize: FontSize.xs,
    color: Colors.textMedium,
    marginBottom: hp(8),
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  arrivalBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: wp(10),
    paddingVertical: hp(5),
  },
  arrivalText: {
    fontSize: wp(9),
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  infoButton: {
    backgroundColor: '#F0F4F6',
    borderRadius: Radius.full,
    paddingHorizontal: wp(10),
    paddingVertical: hp(5),
  },
  infoText: {
    fontSize: wp(9),
    fontWeight: '700',
    color: Colors.textMedium,
    letterSpacing: 0.5,
  },
});