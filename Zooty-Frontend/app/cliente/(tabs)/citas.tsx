import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Alert, Modal,
  Animated, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';

type TabType = 'proximas' | 'pasadas' | 'canceladas';

interface Appointment {
  id: string;
  pro: string;
  service: string;
  pet: string;
  date: string;
  time: string;
  status: string;
  price: number;
}

const INITIAL_APPOINTMENTS: Record<TabType, Appointment[]> = {
  proximas: [
    { id: '1', pro: 'Dra. Ana Martínez',  service: 'Peluquería Canina Premium', pet: 'Max', date: '6 Oct', time: '12:00 PM', status: 'confirmada', price: 47.50 },
    { id: '2', pro: 'Dr. Carlos Ruiz',    service: 'Consulta General',           pet: 'Luna', date: '10 Oct', time: '09:00 AM', status: 'pendiente',  price: 30.00 },
  ],
  pasadas: [
    { id: '3', pro: 'Carlos Paseos',      service: 'Paseo Grupal 1h',           pet: 'Rocky', date: '1 Oct', time: '07:00 AM', status: 'completada', price: 15.00 },
    { id: '4', pro: 'Spa Canino Burbujas',service: 'Baño y secado',             pet: 'Max',   date: '28 Sep', time: '03:00 PM', status: 'completada', price: 25.00 },
  ],
  canceladas: [
    { id: '5', pro: 'Guardería PetHome',  service: 'Guardería fin de semana',   pet: 'Luna', date: '20 Sep', time: '08:00 AM', status: 'cancelada',  price: 60.00 },
  ],
};

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  confirmada: { bg: '#E8F7F5', text: Colors.primary,   label: 'Confirmada' },
  pendiente:  { bg: '#FFF8E1', text: '#F59E0B',         label: 'Pendiente'  },
  completada: { bg: '#F0F0F0', text: Colors.textMedium, label: 'Completada' },
  cancelada:  { bg: '#FFE5E5', text: Colors.error,      label: 'Cancelada'  },
};

const getProfessionalIcon = (proName: string) => {
  if (proName.includes('Veterinario') || proName.includes('Dr.')) return 'medical-bag';
  if (proName.includes('Paseos')) return 'walk';
  if (proName.includes('Spa') || proName.includes('Peluquería')) return 'scissors';
  if (proName.includes('Guardería')) return 'home';
  return 'paw';
};

export default function CitasScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [tab, setTab] = useState<TabType>('proximas');
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  
  // Estados para el modal de eliminación
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  
  // Estados para mensajes de éxito
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Referencia para controlar si ya se procesó el parámetro
  const processedRef = useRef(false);

  useEffect(() => {
    // Solo procesar una vez
    if (processedRef.current) return;
    
    // Manejar actualización de cita reagendada
    if (params.updatedAppointment) {
      try {
        const updatedApt = JSON.parse(params.updatedAppointment as string);
        
        setAppointments(prev => {
          const newAppointments = { ...prev };
          
          // Eliminar la cita antigua de todas las listas
          Object.keys(newAppointments).forEach((key) => {
            newAppointments[key as TabType] = newAppointments[key as TabType].filter(
              a => a.id !== updatedApt.id
            );
          });
          
          // Agregar la cita actualizada a próximas
          newAppointments.proximas = [updatedApt, ...newAppointments.proximas];
          
          return newAppointments;
        });
        
        // Cambiar a la pestaña de próximas
        setTab('proximas');
        
        // Mostrar mensaje de éxito
        setSuccessMessage('¡Cita reagendada exitosamente!');
        setShowSuccess(true);
        
        // Marcar como procesado
        processedRef.current = true;
        
        // Animación de entrada
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 40
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
          })
        ]).start();
        
        // Ocultar después de 4 segundos
        const timer = setTimeout(() => {
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: -100,
              duration: 300,
              useNativeDriver: true
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true
            })
          ]).start(() => setShowSuccess(false));
        }, 4000);
        
        // Limpiar los parámetros de la URL sin causar re-render
        router.replace('/cliente/(tabs)/citas');
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error parsing updated appointment:', error);
      }
    }
    
    // Mostrar mensaje de éxito general
    if (params.showSuccessMessage === 'true' && !processedRef.current) {
      let message = 'Operación completada exitosamente';
      
      if (params.successType === 'reschedule') {
        message = '¡Cita reagendada exitosamente!';
      } else if (params.successType === 'cancel') {
        message = 'Cita cancelada exitosamente';
      }
      
      setSuccessMessage(message);
      setShowSuccess(true);
      
      processedRef.current = true;
      
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 40
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
      
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          })
        ]).start(() => setShowSuccess(false));
      }, 4000);
      
      // Limpiar los parámetros de la URL
      router.replace('/cliente/(tabs)/citas');
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDeletePress = (apt: Appointment) => {
    setAppointmentToDelete(apt);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (!appointmentToDelete) return;
    
    // Actualizar el estado moviendo la cita a canceladas
    setAppointments(prev => {
      const newAppointments = { ...prev };
      
      // Eliminar de todas las listas
      Object.keys(newAppointments).forEach((key) => {
        newAppointments[key as TabType] = newAppointments[key as TabType].filter(
          a => a.id !== appointmentToDelete.id
        );
      });
      
      // Agregar a canceladas con estado actualizado
      const cancelledAppointment = {
        ...appointmentToDelete,
        status: 'cancelada'
      };
      newAppointments.canceladas = [cancelledAppointment, ...newAppointments.canceladas];
      
      return newAppointments;
    });
    
    setDeleteModalVisible(false);
    
    // Mostrar mensaje de éxito
    setSuccessMessage('Cita cancelada exitosamente');
    setShowSuccess(true);
    
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
    
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(() => setShowSuccess(false));
    }, 3000);
    
    setAppointmentToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setAppointmentToDelete(null);
  };

  const handleReschedule = (apt: Appointment) => {
    router.push({
      pathname: '/cliente/citas/reagendar',
      params: {
        id: apt.id,
        pro: apt.pro,
        service: apt.service,
        pet: apt.pet,
        originalDate: apt.date,
        originalTime: apt.time,
        price: apt.price.toString(),
      }
    });
  };

  const handleBookAgain = (apt: Appointment) => {
    router.push('/cliente/citas/agendar');
  };

  const currentAppointments = appointments[tab];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Mensaje de éxito animado */}
      {showSuccess && (
        <Animated.View 
          style={[
            styles.successMessage,
            { 
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <View style={styles.successContent}>
            <Ionicons name="checkmark-circle" size={wp(24)} color="#4CAF50" />
            <Text style={styles.successText}>{successMessage}</Text>
            <TouchableOpacity 
              onPress={() => {
                Animated.parallel([
                  Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true
                  }),
                  Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                  })
                ]).start(() => setShowSuccess(false));
              }}
            >
              <Ionicons name="close" size={wp(20)} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Mis Citas</Text>
        <TouchableOpacity
          style={styles.newCitaBtn}
          onPress={() => router.push('/cliente/citas/agendar')}
        >
          <Ionicons name="add" size={wp(24)} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {(['proximas', 'pasadas', 'canceladas'] as TabType[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabBtnText, tab === t && styles.tabBtnTextActive]}>
              {t === 'proximas' ? 'Próximas' : t === 'pasadas' ? 'Pasadas' : 'Canceladas'}
            </Text>
            {tab === t && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {currentAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={wp(56)} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Sin citas</Text>
            <Text style={styles.emptySubtitle}>No tienes citas en esta sección</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/cliente/citas/agendar')}
            >
              <Text style={styles.emptyBtnText}>Agendar una cita</Text>
            </TouchableOpacity>
          </View>
        ) : (
          currentAppointments.map((apt) => {
            const statusStyle = STATUS_COLORS[apt.status];
            return (
              <TouchableOpacity 
                key={apt.id} 
                style={styles.citaCard} 
                activeOpacity={0.8}
              >
                <View style={[styles.citaStripe, { backgroundColor: statusStyle.text }]} />

                <View style={styles.citaContent}>
                  <View style={styles.citaTop}>
                    <View style={styles.proAvatar}>
                      <MaterialCommunityIcons 
                        name={getProfessionalIcon(apt.pro)} 
                        size={wp(22)} 
                        color={Colors.primary} 
                      />
                    </View>
                    <View style={styles.citaInfo}>
                      <Text style={styles.citaProName}>{apt.pro}</Text>
                      <Text style={styles.citaService}>{apt.service}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {statusStyle.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.citaDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar-outline" size={wp(14)} color={Colors.textMedium} />
                      <Text style={styles.detailText}>{apt.date}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={wp(14)} color={Colors.textMedium} />
                      <Text style={styles.detailText}>{apt.time}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons name="paw" size={wp(14)} color={Colors.textMedium} />
                      <Text style={styles.detailText}>{apt.pet}</Text>
                    </View>
                    <Text style={styles.citaPrice}>${apt.price.toFixed(2)}</Text>
                  </View>

                  {tab === 'proximas' && (
                    <View style={styles.citaActions}>
                      <TouchableOpacity 
                        style={styles.cancelBtn}
                        onPress={() => handleDeletePress(apt)}
                      >
                        <Ionicons name="close-outline" size={wp(16)} color={Colors.textMedium} />
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.rescheduleBtn}
                        onPress={() => handleReschedule(apt)}
                      >
                        <Ionicons name="calendar-outline" size={wp(16)} color={Colors.white} />
                        <Text style={styles.rescheduleBtnText}>Reagendar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {tab === 'pasadas' && (
                    <View style={styles.citaActions}>
                      <TouchableOpacity 
                        style={styles.bookAgainBtn}
                        onPress={() => handleBookAgain(apt)}
                      >
                        <Ionicons name="repeat-outline" size={wp(16)} color={Colors.primary} />
                        <Text style={styles.bookAgainBtnText}>Reservar de nuevo</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {tab === 'canceladas' && (
                    <View style={styles.citaActions}>
                      <TouchableOpacity 
                        style={styles.deleteBtn}
                        onPress={() => {
                          Alert.alert(
                            'Eliminar definitivamente',
                            '¿Estás seguro de eliminar esta cita del historial?',
                            [
                              { text: 'Cancelar', style: 'cancel' },
                              { 
                                text: 'Eliminar', 
                                style: 'destructive',
                                onPress: () => {
                                  setAppointments(prev => {
                                    const newAppointments = { ...prev };
                                    newAppointments.canceladas = newAppointments.canceladas.filter(
                                      a => a.id !== apt.id
                                    );
                                    return newAppointments;
                                  });
                                  
                                  setSuccessMessage('Cita eliminada permanentemente');
                                  setShowSuccess(true);
                                  
                                  Animated.parallel([
                                    Animated.spring(slideAnim, {
                                      toValue: 0,
                                      useNativeDriver: true,
                                    }),
                                    Animated.timing(fadeAnim, {
                                      toValue: 1,
                                      duration: 300,
                                      useNativeDriver: true
                                    })
                                  ]).start();
                                  
                                  setTimeout(() => {
                                    Animated.parallel([
                                      Animated.timing(slideAnim, {
                                        toValue: -100,
                                        duration: 300,
                                        useNativeDriver: true
                                      }),
                                      Animated.timing(fadeAnim, {
                                        toValue: 0,
                                        duration: 300,
                                        useNativeDriver: true
                                      })
                                    ]).start(() => setShowSuccess(false));
                                  }, 3000);
                                }
                              }
                            ]
                          );
                        }}
                      >
                        <Ionicons name="trash-outline" size={wp(16)} color={Colors.error} />
                        <Text style={styles.deleteBtnText}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: hp(16) }} />
      </ScrollView>

      {/* Modal de confirmación para cancelar cita */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="warning-outline" size={wp(48)} color={Colors.error} />
            </View>
            
            <Text style={styles.modalTitle}>¿Cancelar esta cita?</Text>
            
            {appointmentToDelete && (
              <View style={styles.modalAppointmentInfo}>
                <Text style={styles.modalProName}>{appointmentToDelete.pro}</Text>
                <Text style={styles.modalService}>{appointmentToDelete.service}</Text>
                <View style={styles.modalDateTime}>
                  <Ionicons name="calendar-outline" size={wp(14)} color={Colors.textMedium} />
                  <Text style={styles.modalDateTimeText}>
                    {appointmentToDelete.date} • {appointmentToDelete.time}
                  </Text>
                </View>
              </View>
            )}
            
            <Text style={styles.modalDescription}>
              Al cancelar, la cita se moverá a la sección de canceladas. 
              ¿Deseas continuar?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelBtn}
                onPress={handleCancelDelete}
              >
                <Text style={styles.modalCancelBtnText}>No, mantener</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmBtn}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.modalConfirmBtnText}>Sí, cancelar cita</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  
  successMessage: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(60) : hp(20),
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1000,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: wp(12),
    shadowOffset: { width: 0, height: hp(4) },
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  successText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textDark,
    fontWeight: '500',
  },
  
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, 
    paddingTop: Spacing.md, 
    paddingBottom: Spacing.sm,
  },
  pageTitle: { 
    fontSize: FontSize.xxxl, 
    fontWeight: '700', 
    color: Colors.textDark 
  },
  newCitaBtn: {
    width: wp(40), 
    height: wp(40), 
    borderRadius: wp(20),
    backgroundColor: Colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: Colors.primary, 
    shadowOpacity: 0.3, 
    shadowRadius: wp(8),
    shadowOffset: { width: 0, height: hp(3) }, 
    elevation: 4,
  },
  
  tabsRow: {
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.borderLight,
    marginHorizontal: Spacing.lg,
  },
  tabBtn: {
    flex: 1, 
    paddingVertical: hp(12), 
    alignItems: 'center', 
    position: 'relative',
  },
  tabBtnText: { 
    fontSize: FontSize.sm, 
    color: Colors.textLight, 
    fontWeight: '500' 
  },
  tabBtnTextActive: { 
    color: Colors.primary, 
    fontWeight: '700' 
  },
  tabIndicator: {
    position: 'absolute', 
    bottom: 0, 
    left: '10%', 
    right: '10%',
    height: hp(3), 
    backgroundColor: Colors.primary, 
    borderRadius: hp(2),
  },
  
  scroll: { 
    paddingHorizontal: Spacing.lg, 
    paddingTop: Spacing.md 
  },
  
  citaCard: {
    flexDirection: 'row', 
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, 
    marginBottom: Spacing.md, 
    overflow: 'hidden',
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: wp(10),
    shadowOffset: { width: 0, height: hp(2) }, 
    elevation: 2,
  },
  citaStripe: { 
    width: wp(4) 
  },
  citaContent: { 
    flex: 1, 
    padding: Spacing.md 
  },
  citaTop: {
    flexDirection: 'row', 
    alignItems: 'flex-start',
    gap: Spacing.sm, 
    marginBottom: Spacing.md,
  },
  proAvatar: {
    width: wp(44), 
    height: wp(44), 
    borderRadius: wp(12),
    backgroundColor: Colors.primaryLight, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  citaInfo: { 
    flex: 1 
  },
  citaProName: { 
    fontSize: FontSize.sm, 
    fontWeight: '700', 
    color: Colors.textDark, 
    marginBottom: hp(2) 
  },
  citaService: { 
    fontSize: FontSize.xs, 
    color: Colors.textMedium 
  },
  statusBadge: { 
    paddingHorizontal: wp(8), 
    paddingVertical: hp(4), 
    borderRadius: Radius.full 
  },
  statusText: { 
    fontSize: wp(10), 
    fontWeight: '700' 
  },
  
  citaDetails: {
    flexDirection: 'row', 
    alignItems: 'center',
    flexWrap: 'wrap', 
    gap: Spacing.sm, 
    marginBottom: Spacing.sm,
  },
  detailItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: wp(4) 
  },
  detailText: { 
    fontSize: FontSize.xs, 
    color: Colors.textMedium 
  },
  citaPrice: { 
    marginLeft: 'auto', 
    fontSize: FontSize.sm, 
    fontWeight: '700', 
    color: Colors.primary 
  },
  
  citaActions: { 
    flexDirection: 'row', 
    gap: Spacing.sm, 
    marginTop: Spacing.sm 
  },
  cancelBtn: {
    flex: 1, 
    height: hp(36), 
    borderRadius: Radius.full,
    borderWidth: 1.5, 
    borderColor: Colors.borderLight,
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'row',
    gap: wp(4),
  },
  cancelBtnText: { 
    fontSize: FontSize.xs, 
    color: Colors.textMedium, 
    fontWeight: '600' 
  },
  rescheduleBtn: {
    flex: 1, 
    height: hp(36), 
    borderRadius: Radius.full,
    backgroundColor: Colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'row',
    gap: wp(4),
  },
  rescheduleBtnText: { 
    fontSize: FontSize.xs, 
    color: Colors.white, 
    fontWeight: '700' 
  },
  bookAgainBtn: {
    flex: 1, 
    height: hp(36), 
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight, 
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'row',
    gap: wp(4),
  },
  bookAgainBtnText: { 
    fontSize: FontSize.xs, 
    color: Colors.primary, 
    fontWeight: '700' 
  },
  deleteBtn: {
    flex: 1, 
    height: hp(36), 
    borderRadius: Radius.full,
    borderWidth: 1.5, 
    borderColor: Colors.error,
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'row',
    gap: wp(4),
  },
  deleteBtnText: { 
    fontSize: FontSize.xs, 
    color: Colors.error, 
    fontWeight: '600' 
  },
  
  emptyState: { 
    alignItems: 'center', 
    paddingTop: hp(64) 
  },
  emptyTitle: { 
    fontSize: FontSize.xl, 
    fontWeight: '700', 
    color: Colors.textDark, 
    marginBottom: Spacing.sm 
  },
  emptySubtitle: { 
    fontSize: FontSize.sm, 
    color: Colors.textMedium, 
    marginBottom: Spacing.xl 
  },
  emptyBtn: {
    backgroundColor: Colors.primary, 
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl, 
    paddingVertical: hp(14),
  },
  emptyBtnText: { 
    color: Colors.white, 
    fontSize: FontSize.md, 
    fontWeight: '600' 
  },
  
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
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalAppointmentInfo: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  modalProName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: hp(2),
  },
  modalService: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    marginBottom: hp(6),
  },
  modalDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  modalDateTimeText: {
    fontSize: FontSize.sm,
    color: Colors.textDark,
  },
  modalDescription: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: hp(20),
    marginBottom: Spacing.xl,
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
    backgroundColor: Colors.error,
    alignItems: 'center',
  },
  modalConfirmBtnText: {
    fontSize: FontSize.md,
    color: Colors.white,
    fontWeight: '600',
  },
});