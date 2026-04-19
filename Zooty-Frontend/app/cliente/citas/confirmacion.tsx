import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Animated, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '@/components/PrimaryButton';

export default function ConfirmacionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 40,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const methodLabels: Record<string, string> = {
    card: 'Tarjeta',
    cash: 'Efectivo',
    transfer: 'Transferencia',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Icono de éxito animado */}
        <Animated.View 
          style={[
            styles.successIconContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }
          ]}
        >
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={wp(50)} color={Colors.white} />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
          }}
        >
          <Text style={styles.title}>¡Cita confirmada!</Text>
          <Text style={styles.subtitle}>
            Tu reserva ha sido procesada exitosamente
          </Text>
        </Animated.View>

        {/* Detalles de la cita */}
        <Animated.View 
          style={[
            styles.detailsCard,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
            }
          ]}
        >
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={wp(20)} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Profesional</Text>
              <Text style={styles.detailValue}>Clinivet Dr. García</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={wp(20)} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Fecha y hora</Text>
              <Text style={styles.detailValue}>
                {params.date ? new Date(params.date as string).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'Fecha no disponible'} • {params.time || '--:--'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="paw-outline" size={wp(20)} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Mascota</Text>
              <Text style={styles.detailValue}>
                {params.pet === '1' ? 'Luna' : params.pet === '2' ? 'Max' : 'Mia'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={wp(20)} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Método de pago</Text>
              <Text style={styles.detailValue}>
                {methodLabels[params.method as string] || 'Tarjeta'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={wp(20)} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Total pagado</Text>
              <Text style={[styles.detailValue, styles.priceValue]}>
                ${params.total || '0.00'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Mensaje de confirmación */}
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
          }}
        >
          <View style={styles.infoBox}>
            <Ionicons name="mail-outline" size={wp(20)} color={Colors.textLight} />
            <Text style={styles.infoText}>
              Hemos enviado los detalles de tu cita a tu correo electrónico
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Botones */}
      <View style={styles.bottomBar}>
        <PrimaryButton 
          label="Ver mis citas" 
          onPress={() => router.replace('/cliente/(tabs)/citas')}
        />
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.replace('/cliente/(tabs)/home')}
        >
          <Text style={styles.homeButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: hp(60),
  },
  
  successIconContainer: {
    marginBottom: hp(24),
  },
  successCircle: {
    width: wp(100),
    height: wp(100),
    borderRadius: wp(50),
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
    shadowRadius: wp(16),
    shadowOffset: { width: 0, height: hp(4) },
    elevation: 8,
  },
  
  title: {
    fontSize: wp(28),
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: hp(8),
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textMedium,
    textAlign: 'center',
    marginBottom: hp(32),
  },
  
  detailsCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: hp(20),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(16),
    gap: Spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginBottom: hp(2),
  },
  detailValue: {
    fontSize: FontSize.md,
    color: Colors.textDark,
    fontWeight: '500',
  },
  priceValue: {
    color: Colors.primary,
    fontWeight: '700',
  },
  
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FAF8',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    lineHeight: hp(20),
  },
  
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? hp(30) : Spacing.lg,
  },
  homeButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  homeButtonText: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: '600',
  },
});