import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

// ─── Datos mock ──────────────────────────────────────────
const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Nueva cita agendada',
    message: 'Carlos G. agendó una cita para Max (Golden Retriever) el día de hoy a las 15:00',
    time: 'Hace 5 minutos',
    read: false,
    type: 'cita',
  },
  {
    id: '2',
    title: 'Recordatorio de cita',
    message: 'Tienes una cita con Ana P. y Luna en 30 minutos',
    time: 'Hace 25 minutos',
    read: false,
    type: 'recordatorio',
  },
  {
    id: '3',
    title: 'Pago recibido',
    message: 'Has recibido un pago de $35.000 por el servicio de Baño & Corte',
    time: 'Hace 2 horas',
    read: true,
    type: 'pago',
  },
  {
    id: '4',
    title: 'Nueva reseña',
    message: 'Luis M. dejó una reseña de 5 estrellas para tu servicio',
    time: 'Ayer, 18:30',
    read: true,
    type: 'reseña',
  },
  {
    id: '5',
    title: 'Cancelación de cita',
    message: 'Marta R. canceló la cita de Toby para el día de mañana',
    time: 'Ayer, 10:15',
    read: true,
    type: 'cancelacion',
  },
];

function getIcon(type: string) {
  switch (type) {
    case 'cita':
      return <Ionicons name="calendar" size={wp(20)} color={Colors.primary} />;
    case 'recordatorio':
      return <Ionicons name="timer" size={wp(20)} color={Colors.secondary} />;
    case 'pago':
      return <Ionicons name="cash" size={wp(20)} color="#34D399" />;
    case 'reseña':
      return <Ionicons name="star" size={wp(20)} color="#F4A536" />;
    case 'cancelacion':
      return <Ionicons name="close-circle" size={wp(20)} color={Colors.error} />;
    default:
      return <Ionicons name="notifications" size={wp(20)} color={Colors.textMedium} />;
  }
}

function NotificationCard({ item, onPress }: { item: typeof NOTIFICATIONS[0]; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.notificationCardUnread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, !item.read && styles.iconContainerUnread]}>
        {getIcon(item.type)}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, !item.read && styles.titleUnread]}>
            {item.title}
          </Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      <Ionicons name="chevron-forward" size={wp(16)} color={Colors.textLight} />
    </TouchableOpacity>
  );
}

export default function NotificacionesProfesionalesScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('todas');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'no-leidas') return !n.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={wp(24)} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Notificaciones</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Marcar todo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'todas' && styles.filterChipActive]}
          onPress={() => setActiveFilter('todas')}
        >
          <Text style={[styles.filterText, activeFilter === 'todas' && styles.filterTextActive]}>
            Todas
          </Text>
          {activeFilter === 'todas' && <View style={styles.filterDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'no-leidas' && styles.filterChipActive]}
          onPress={() => setActiveFilter('no-leidas')}
        >
          <Text style={[styles.filterText, activeFilter === 'no-leidas' && styles.filterTextActive]}>
            No leídas
          </Text>
          {unreadCount > 0 && activeFilter !== 'no-leidas' && (
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>{unreadCount}</Text>
            </View>
          )}
          {activeFilter === 'no-leidas' && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="notifications-off" size={wp(32)} color={Colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No hay notificaciones</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'no-leidas'
                ? 'No tienes notificaciones sin leer'
                : 'Todas tus notificaciones aparecerán aquí'}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              item={notification}
              onPress={() => markAsRead(notification.id)}
            />
          ))
        )}

        <View style={{ height: hp(24) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: Colors.textDark,
    letterSpacing: -0.5,
  },
  markAllText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },

  /* Filtros */
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    gap: wp(6),
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: wp(4),
    shadowOffset: { width: 0, height: hp(1) },
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryLight,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  filterDot: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    backgroundColor: Colors.primary,
  },
  filterCount: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
    minWidth: wp(18),
    alignItems: 'center',
  },
  filterCountText: {
    fontSize: wp(8),
    color: Colors.white,
    fontWeight: '700',
  },

  scroll: { paddingHorizontal: Spacing.lg },

  /* Notification card */
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 1,
  },
  notificationCardUnread: {
    backgroundColor: '#F8FAFE',
  },
  iconContainer: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(22),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconContainerUnread: {
    backgroundColor: Colors.primaryLight,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(4),
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textMedium,
    flex: 1,
  },
  titleUnread: {
    color: Colors.textDark,
    fontWeight: '700',
  },
  unreadDot: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: Colors.primary,
    marginLeft: Spacing.xs,
  },
  message: {
    fontSize: FontSize.xs,
    color: Colors.textMedium,
    marginBottom: hp(4),
    lineHeight: hp(16),
  },
  time: {
    fontSize: wp(9),
    color: Colors.textLight,
  },

  /* Empty state */
  emptyState: {
    alignItems: 'center',
    paddingTop: hp(80),
    gap: Spacing.md,
  },
  emptyIconBg: {
    width: wp(80),
    height: wp(80),
    borderRadius: wp(40),
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textDark,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});