import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

const UPCOMING_APPOINTMENTS = [
  { id: '1', petName: 'Max', service: 'Baño & Corte', breed: 'Golden Retriever', time: '10:30', status: 'arrival' },
  { id: '2', petName: 'Luna', service: 'Vacunación', breed: 'Siamés', time: '11:45', status: 'arrival' },
  { id: '3', petName: 'Oliver', service: 'Consulta General', breed: 'Maltés', time: '13:30', status: 'arrival' },
];

const TODAY_SUMMARY = {
  appointments: 8,
  completed: 5,
  pending: 3,
  earnings: 345,
};

function PetAvatar({ initials }: { initials: string }) {
  return (
    <View style={styles.petAvatar}>
      <Text style={styles.petAvatarText}>{initials}</Text>
    </View>
  );
}

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
        <Text style={styles.serviceDetail}>{item.service} · {item.breed}</Text>
        <View style={styles.actionButtons}>
          <View style={styles.arrivalBadge}>
            <Text style={styles.arrivalText}>LLEGADA</Text>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <Text style={styles.infoText}>DETALLES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ProInicioScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Z</Text>
          </View>
          <Text style={styles.brandName}>Zooty</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={wp(20)} color={Colors.textDark} />
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

      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeGreeting}>Buenos días,</Text>
          <Text style={styles.welcomeName}>Dr. Alejandro V.</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={[styles.statIcon, styles.statIconPrimary]}>
              <Ionicons name="calendar" size={wp(22)} color={Colors.white} />
            </View>
            <Text style={styles.statLabel}>CITAS HOY</Text>
            <Text style={styles.statValue}>{TODAY_SUMMARY.appointments}</Text>
          </View>

          <View style={[styles.statCard, styles.statCardSecondary]}>
            <View style={[styles.statIcon, styles.statIconSecondary]}>
              <Ionicons name="cash" size={wp(22)} color={Colors.white} />
            </View>
            <Text style={styles.statLabel}>GANANCIA HOY</Text>
            <Text style={styles.statValue}>${TODAY_SUMMARY.earnings}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Progreso del día</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(TODAY_SUMMARY.completed / TODAY_SUMMARY.appointments) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {TODAY_SUMMARY.completed} de {TODAY_SUMMARY.appointments} citas completadas
          </Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionBtn}
            onPress={() => router.push('/profesional/citas/citas')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="calendar-outline" size={wp(24)} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Ver todas{'\n'}las citas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionBtn}
            onPress={() => router.push('/profesional/finanzas/reporte')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="bar-chart-outline" size={wp(24)} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Reporte de{'\n'}finanzas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionBtn}
            onPress={() => router.push('/profesional/clientes')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="people-outline" size={wp(24)} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Mis{'\n'}clientes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas Citas</Text>
          <TouchableOpacity onPress={() => router.push('/profesional/citas/citas')}>
            <Text style={styles.sectionLink}>Ver todas →</Text>
          </TouchableOpacity>
        </View>

        {UPCOMING_APPOINTMENTS.map((appointment) => (
          <AppointmentCard key={appointment.id} item={appointment} />
        ))}

        <TouchableOpacity 
          style={styles.viewAllBtn}
          onPress={() => router.push('/profesional/citas/citas')}
        >
          <Text style={styles.viewAllText}>Ver calendario completo</Text>
          <Ionicons name="chevron-forward" size={wp(16)} color={Colors.primary} />
        </TouchableOpacity>

        <View style={{ height: hp(24) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: hp(24) },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  logo: {
    width: wp(32), height: wp(32), borderRadius: wp(16),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  logoText: { color: Colors.primary, fontWeight: '800', fontSize: wp(16) },
  brandName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, letterSpacing: -0.3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  notificationButton: {
    width: wp(40), height: wp(40), borderRadius: wp(20),
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute', top: hp(4), right: wp(4),
    width: wp(16), height: wp(16), borderRadius: wp(8),
    backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.white,
  },
  notificationBadgeText: { color: Colors.white, fontSize: wp(8), fontWeight: '700' },
  avatar: {
    width: wp(40), height: wp(40), borderRadius: wp(20),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primary, position: 'relative',
  },
  avatarText: { fontSize: wp(18), fontWeight: '600', color: Colors.primary },
  onlineIndicator: {
    position: 'absolute', bottom: hp(0), right: wp(0),
    width: wp(12), height: wp(12), borderRadius: wp(6),
    backgroundColor: '#34D399', borderWidth: 2, borderColor: Colors.white,
  },

  welcomeSection: { marginTop: Spacing.sm, marginBottom: Spacing.lg },
  welcomeGreeting: { fontSize: FontSize.sm, color: Colors.textMedium, marginBottom: hp(2) },
  welcomeName: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textDark, letterSpacing: -0.3 },

  statsGrid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  statCard: {
    flex: 1, borderRadius: Radius.lg, padding: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 1,
  },
  statCardPrimary: { backgroundColor: '#E8F7F5' },
  statCardSecondary: { backgroundColor: '#FFF4EE' },
  statIcon: {
    width: wp(44), height: wp(44), borderRadius: wp(14),
    alignItems: 'center', justifyContent: 'center', marginBottom: hp(10),
  },
  statIconPrimary: { backgroundColor: Colors.primary },
  statIconSecondary: { backgroundColor: '#F4845F' },
  statLabel: {
    fontSize: wp(11), fontWeight: '700', color: Colors.textLight,
    letterSpacing: 0.5, marginBottom: hp(4),
  },
  statValue: { fontSize: wp(28), fontWeight: '800', color: Colors.textDark, letterSpacing: -0.5 },

  progressSection: { marginBottom: Spacing.lg },
  progressTitle: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textDark, marginBottom: hp(6) },
  progressBar: {
    height: hp(8), backgroundColor: Colors.borderLight,
    borderRadius: Radius.full, overflow: 'hidden', marginBottom: hp(6),
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: Radius.full },
  progressText: { fontSize: FontSize.xs, color: Colors.textMedium },

  quickActions: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.md, marginBottom: Spacing.lg,
  },
  quickActionBtn: { alignItems: 'center', gap: hp(4) },
  quickActionIcon: {
    width: wp(48), height: wp(48), borderRadius: wp(24),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  quickActionText: { fontSize: FontSize.xs, color: Colors.textDark, textAlign: 'center', fontWeight: '500' },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textDark },
  sectionLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  appointmentCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md,
    marginBottom: Spacing.md, gap: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 2,
  },
  petAvatar: {
    width: wp(56), height: wp(56), borderRadius: wp(16),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  petAvatarText: { fontSize: wp(24), fontWeight: '600', color: Colors.primary },
  appointmentInfo: { flex: 1 },
  appointmentHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  petName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textDark, flex: 1 },
  appointmentTime: { fontSize: FontSize.sm, color: Colors.textMedium, fontWeight: '500' },
  serviceDetail: { fontSize: FontSize.xs, color: Colors.textMedium, marginBottom: hp(8) },
  actionButtons: { flexDirection: 'row', gap: Spacing.sm },
  arrivalBadge: {
    backgroundColor: Colors.primaryLight, borderRadius: Radius.full,
    paddingHorizontal: wp(10), paddingVertical: hp(5),
  },
  arrivalText: { fontSize: wp(9), fontWeight: '800', color: Colors.primary, letterSpacing: 0.5 },
  infoButton: {
    backgroundColor: '#F0F4F6', borderRadius: Radius.full,
    paddingHorizontal: wp(10), paddingVertical: hp(5),
  },
  infoText: { fontSize: wp(9), fontWeight: '700', color: Colors.textMedium, letterSpacing: 0.5 },

  viewAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.xs, paddingVertical: Spacing.md,
  },
  viewAllText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
});