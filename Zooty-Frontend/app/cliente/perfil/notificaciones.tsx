import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

type NotifType = 'cita' | 'promo' | 'recordatorio' | 'sistema';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
}

const NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'cita',        title: 'Cita confirmada',      body: 'Tu cita con Dra. Ana Martínez el 6 Oct a las 12:00 PM fue confirmada.',  time: 'Hace 5 min',   read: false, icon: 'OK' },
  { id: '2', type: 'recordatorio',title: 'Recordatorio de cita', body: 'Mañana tienes cita con Dr. Carlos Ruiz a las 09:00 AM. ¡No lo olvides!',  time: 'Hace 1 hora',  read: false, icon: 'AV' },
  { id: '3', type: 'promo',       title: '20% de descuento',     body: 'Spa Canino Burbujas tiene una oferta especial solo por hoy. ¡Aprovéchala!', time: 'Hace 2 horas', read: false, icon: 'PR' },
  { id: '4', type: 'cita',        title: 'Cita completada',      body: 'Rocky tuvo su paseo con Carlos Paseos. ¡Deja una reseña!',                  time: 'Ayer',         read: true,  icon: 'CI' },
  { id: '5', type: 'sistema',     title: 'Bienvenido a Zooty',   body: 'Gracias por unirte. Explora los mejores profesionales cerca de ti.',        time: 'Hace 3 días',  read: true,  icon: 'SYS' },
];

const TYPE_COLORS: Record<NotifType, string> = {
  cita:         Colors.primary,
  promo:        '#F4845F',
  recordatorio: '#F59E0B',
  sistema:      Colors.textMedium,
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Notificaciones</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Leer todo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Banner */}
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadBannerText}>
            {unreadCount} notificacion{unreadCount > 1 ? 'es' : ''} sin leer
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {notifs.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
            activeOpacity={0.8}
            onPress={() => markRead(notif.id)}
          >
            {!notif.read && (
              <View style={[styles.unreadDot, { backgroundColor: TYPE_COLORS[notif.type] }]} />
            )}

            <View style={[styles.notifIconBg, { backgroundColor: `${TYPE_COLORS[notif.type]}18` }]}>
              <Text style={styles.notifIcon}>{notif.icon}</Text>
            </View>

            <View style={styles.notifContent}>
              <View style={styles.notifTopRow}>
                <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]}>
                  {notif.title}
                </Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
              <Text style={styles.notifBody} numberOfLines={2}>
                {notif.body}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {notifs.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>N/A</Text>
            <Text style={styles.emptyTitle}>Sin notificaciones</Text>
            <Text style={styles.emptySubtitle}>Te avisaremos cuando haya novedades</Text>
          </View>
        )}

        <View style={{ height: hp(24) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.md,
  },

  backBtn: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: wp(6),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 2,
  },

  backIcon: {
    color: Colors.primary,
    fontSize: wp(26),
    fontWeight: '300',
    lineHeight: hp(30),
  },

  pageTitle: {
    flex: 1,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textDark,
  },

  markAllText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },

  unreadBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: hp(8),
  },

  unreadBannerText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },

  scroll: {
    paddingHorizontal: Spacing.lg,
  },

  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(2) },
    elevation: 1,
    gap: Spacing.sm,
    position: 'relative',
  },

  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },

  unreadDot: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
  },

  notifIconBg: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(14),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  notifIcon: {
    fontSize: wp(10),
    fontWeight: '700',
    color: Colors.primary,
  },

  notifContent: {
    flex: 1,
  },

  notifTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(4),
  },

  notifTitle: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.textDark,
    flex: 1,
  },

  notifTitleUnread: {
    fontWeight: '700',
  },

  notifTime: {
    fontSize: wp(10),
    color: Colors.textLight,
    marginLeft: Spacing.sm,
  },

  notifBody: {
    fontSize: FontSize.xs,
    color: Colors.textMedium,
    lineHeight: hp(18),
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: hp(80),
  },

  emptyIcon: {
    fontSize: wp(20),
    marginBottom: Spacing.md,
    color: Colors.textLight,
  },

  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: Spacing.sm,
  },

  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
  },
});