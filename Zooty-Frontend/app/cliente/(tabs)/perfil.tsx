import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

const MENU_SECTIONS = [
  {
    title: 'Cuenta',
    items: [
      { icon: 'person-outline', iconSet: 'Ionicons', label: 'Información personal', route: '/perfil/informacionPersonal' },
      { icon: 'notifications-outline', iconSet: 'Ionicons', label: 'Notificaciones', route: '/perfil/notificaciones' },
      { icon: 'lock-closed-outline', iconSet: 'Ionicons', label: 'Privacidad y seguridad', route: '/perfil/privacidadSeguridad' },
      { icon: 'card-outline', iconSet: 'Ionicons', label: 'Métodos de pago', route: '/perfil/metodosPago' },
    ],
  },
  {
    title: 'Historial',
    items: [
      { icon: 'calendar-outline', iconSet: 'Ionicons', label: 'Historial de citas', route: '/perfil/historial-citas' },
      { icon: 'star-outline', iconSet: 'Ionicons', label: 'Mis reseñas', route: '/perfil/resenas' },
      { icon: 'heart-outline', iconSet: 'Ionicons', label: 'Favoritos', route: '/perfil/favoritos' },
    ],
  },
  {
    title: 'Soporte',
    items: [
      { icon: 'help-circle-outline', iconSet: 'Ionicons', label: 'Ayuda y soporte', route: '/perfil/ayuda' },
      { icon: 'document-text-outline', iconSet: 'Ionicons', label: 'Términos y condiciones', route: '/perfil/terminos' },
      { icon: 'star', iconSet: 'Feather', label: 'Calificar la app', route: '/perfil/calificar' },
    ],
  },
];

const getIcon = (iconName: string, iconSet: string, size: number, color: string) => {
  if (iconSet === 'Ionicons') {
    return <Ionicons name={iconName as any} size={size} color={color} />;
  } else if (iconSet === 'Feather') {
    return <Feather name={iconName as any} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
};

export default function PerfilScreen() {
  const router = useRouter();
  const [notifEnabled, setNotifEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Perfil</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={wp(22)} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Avatar + info usuario */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={wp(36)} color={Colors.primary} />
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={wp(12)} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Juan García</Text>
            <Text style={styles.userEmail}>juan@correo.com</Text>
            <View style={styles.memberBadge}>
              <Ionicons name="star" size={wp(10)} color="#F59E0B" />
              <Text style={styles.memberText}>Miembro desde 2023</Text>
            </View>
          </View>
        </View>

        {/* Stats rápidos */}
        <View style={styles.statsRow}>
          {[
            { label: 'Citas',      value: '12' },
            { label: 'Mascotas',   value: '3' },
            { label: 'Reseñas',    value: '8' },
          ].map(({ label, value }) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Toggle rápido notificaciones */}
        <View style={styles.quickToggle}>
          <View style={styles.quickToggleLeft}>
            <Ionicons name="notifications-outline" size={wp(20)} color={Colors.textDark} />
            <Text style={styles.quickToggleLabel}>Notificaciones push</Text>
          </View>
          <Switch
            value={notifEnabled}
            onValueChange={setNotifEnabled}
            trackColor={{ false: Colors.stepPending, true: Colors.primary }}
            thumbColor={Colors.white}
            ios_backgroundColor={Colors.stepPending}
          />
        </View>

        {/* Menú de secciones */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.menuItem,
                    idx < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuItemIconBg}>
                      {getIcon(item.icon, item.iconSet, wp(18), Colors.primary)}
                    </View>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(18)} color={Colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Cerrar sesión */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace('/login')}
        >
          <Ionicons name="log-out-outline" size={wp(18)} color={Colors.error} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Zooty v1.0.0</Text>
        <View style={{ height: hp(24) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  pageTitle:   { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textDark },
  settingsBtn: { width: wp(40), height: wp(40), alignItems: 'center', justifyContent: 'center' },

  /* Profile card */
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: wp(12),
    shadowOffset: { width: 0, height: hp(3) }, elevation: 3, gap: Spacing.md,
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: wp(72), height: wp(72), borderRadius: wp(36),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.primary,
  },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: wp(24), height: wp(24), borderRadius: wp(12),
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  userInfo:       { flex: 1 },
  userName:       { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textDark, marginBottom: hp(2) },
  userEmail:      { fontSize: FontSize.xs, color: Colors.textMedium, marginBottom: hp(8) },
  memberBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFBEA', borderRadius: Radius.full,
    paddingHorizontal: wp(8), paddingVertical: hp(3), gap: wp(3), alignSelf: 'flex-start',
  },
  memberText: { fontSize: wp(10), color: '#F59E0B', fontWeight: '600' },

  /* Stats */
  statsRow: {
    flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(6),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 1,
  },
  statValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, marginBottom: hp(2) },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMedium },

  /* Quick toggle */
  quickToggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(6),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 1,
  },
  quickToggleLeft:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  quickToggleLabel: { fontSize: FontSize.md, fontWeight: '500', color: Colors.textDark },

  /* Menu */
  menuSection:      { marginBottom: Spacing.md },
  menuSectionTitle: {
    fontSize: FontSize.xs, fontWeight: '700', color: Colors.textLight,
    letterSpacing: 0.5, marginBottom: Spacing.sm, marginLeft: Spacing.xs,
  },
  menuCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: wp(6),
    shadowOffset: { width: 0, height: hp(2) }, elevation: 1,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
  },
  menuItemBorder:   { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuItemLeft:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  menuItemIconBg: {
    width: wp(36), height: wp(36), borderRadius: wp(10),
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  menuItemLabel:   { fontSize: FontSize.md, color: Colors.textDark, fontWeight: '500' },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFE5E5', borderRadius: Radius.lg,
    paddingVertical: Spacing.md, gap: Spacing.sm, marginBottom: Spacing.sm,
  },
  logoutText: { fontSize: FontSize.md, color: Colors.error, fontWeight: '700' },
  version:    { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textLight },
});