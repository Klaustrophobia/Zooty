import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Alert, Platform,
  TextInput, Modal, KeyboardAvoidingView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { wp, hp } from '@/constants/Responsive';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '@/components/PrimaryButton';
import StepBar from '@/components/StepBar';

type PaymentMethod = 'card' | 'cash' | 'transfer';

export default function PagoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  
  // Estados para el formulario de tarjeta
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  
  const serviceName = params.serviceName as string || 'Consulta Veterinaria';
  const servicePrice = params.servicePrice as string || '45.00';
  const serviceFee = '2.50';
  const total = (parseFloat(servicePrice) + parseFloat(serviceFee)).toFixed(2);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiry = (text: string) => {
    // Eliminar todo excepto números
    let cleaned = text.replace(/\D/g, '');
    
    // Limitar a 4 dígitos (MMAA)
    cleaned = cleaned.substring(0, 4);
    
    // Formatear como MM/AA
    if (cleaned.length > 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    
    return cleaned;
  };

  const validateCardForm = () => {
    if (cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Error', 'Ingresa un número de tarjeta válido');
      return false;
    }
    if (!cardHolder.trim()) {
      Alert.alert('Error', 'Ingresa el nombre del titular');
      return false;
    }
    
    const expiryClean = expiry.replace(/\D/g, '');
    if (expiryClean.length !== 4) {
      Alert.alert('Error', 'Ingresa una fecha de expiración válida (MM/AA)');
      return false;
    }
    
    const month = parseInt(expiryClean.substring(0, 2));
    if (month < 1 || month > 12) {
      Alert.alert('Error', 'El mes debe estar entre 01 y 12');
      return false;
    }
    
    if (cvv.length < 3) {
      Alert.alert('Error', 'Ingresa un CVV válido');
      return false;
    }
    return true;
  };

  const handleCardPayment = () => {
    if (!validateCardForm()) return;
    
    setShowCardForm(false);
    processPayment();
  };

  const processPayment = async () => {
    setLoading(true);
    
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    
    router.push({
      pathname: '/cliente/citas/confirmacion',
      params: {
        ...params,
        method: selectedMethod,
        total: total,
        cardLast4: selectedMethod === 'card' ? cardNumber.replace(/\s/g, '').slice(-4) : undefined,
      }
    });
  };

  const handlePayment = async () => {
    if (selectedMethod === 'card') {
      setShowCardForm(true);
    } else {
      processPayment();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView 
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={wp(22)} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Método de pago</Text>
          <View style={styles.placeholder} />
        </View>

        <StepBar total={3} current={2} />

        {/* Resumen del servicio */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de tu cita</Text>
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Servicio</Text>
            <Text style={styles.summaryValue}>{serviceName}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Profesional</Text>
            <Text style={styles.summaryValue}>Clinivet Dr. García</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fecha y hora</Text>
            <Text style={styles.summaryValue}>
              {params.date ? new Date(params.date as string).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              }) : ''} • {params.time}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mascota</Text>
            <Text style={styles.summaryValue}>
              {params.pet === '1' ? 'Luna' : params.pet === '2' ? 'Max' : 'Mia'}
            </Text>
          </View>
        </View>

        {/* Métodos de pago */}
        <Text style={styles.sectionTitle}>Elige cómo pagar</Text>
        
        {/* Tarjeta */}
        <TouchableOpacity
          style={[
            styles.paymentCard,
            selectedMethod === 'card' && styles.paymentCardSelected
          ]}
          onPress={() => setSelectedMethod('card')}
        >
          <View style={styles.paymentIcon}>
            <Ionicons 
              name="card-outline" 
              size={wp(24)} 
              color={selectedMethod === 'card' ? Colors.primary : Colors.textLight} 
            />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Tarjeta de crédito o débito</Text>
            <Text style={styles.paymentDesc}>Paga de forma segura con tu tarjeta</Text>
          </View>
          <View style={[
            styles.radio,
            selectedMethod === 'card' && styles.radioSelected
          ]}>
            {selectedMethod === 'card' && (
              <View style={styles.radioInner} />
            )}
          </View>
        </TouchableOpacity>

        {/* Efectivo */}
        <TouchableOpacity
          style={[
            styles.paymentCard,
            selectedMethod === 'cash' && styles.paymentCardSelected
          ]}
          onPress={() => setSelectedMethod('cash')}
        >
          <View style={styles.paymentIcon}>
            <Ionicons 
              name="cash-outline" 
              size={wp(24)} 
              color={selectedMethod === 'cash' ? Colors.primary : Colors.textLight} 
            />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Efectivo</Text>
            <Text style={styles.paymentDesc}>Paga en persona el día de tu cita</Text>
          </View>
          <View style={[
            styles.radio,
            selectedMethod === 'cash' && styles.radioSelected
          ]}>
            {selectedMethod === 'cash' && (
              <View style={styles.radioInner} />
            )}
          </View>
        </TouchableOpacity>

        {/* Transferencia */}
        <TouchableOpacity
          style={[
            styles.paymentCard,
            selectedMethod === 'transfer' && styles.paymentCardSelected
          ]}
          onPress={() => setSelectedMethod('transfer')}
        >
          <View style={styles.paymentIcon}>
            <Ionicons 
              name="swap-horizontal-outline" 
              size={wp(24)} 
              color={selectedMethod === 'transfer' ? Colors.primary : Colors.textLight} 
            />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Transferencia bancaria</Text>
            <Text style={styles.paymentDesc}>Recibirás los datos para realizar la transferencia</Text>
          </View>
          <View style={[
            styles.radio,
            selectedMethod === 'transfer' && styles.radioSelected
          ]}>
            {selectedMethod === 'transfer' && (
              <View style={styles.radioInner} />
            )}
          </View>
        </TouchableOpacity>

        {/* Desglose de precios */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Servicio</Text>
            <Text style={styles.priceValue}>${servicePrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tarifa de servicio</Text>
            <Text style={styles.priceValue}>${serviceFee}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total}</Text>
          </View>
        </View>

        <Text style={styles.secureText}>
          <Ionicons name="lock-closed" size={wp(12)} color={Colors.textLight} />
          {' '}Pago seguro encriptado • Tus datos están protegidos
        </Text>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Botón pagar */}
      <View style={styles.bottomBar}>
        <PrimaryButton 
          label={loading ? "Procesando..." : `Pagar $${total}`} 
          onPress={handlePayment}
          disabled={loading}
        />
      </View>

      {/* Modal de formulario de tarjeta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCardForm}
        onRequestClose={() => setShowCardForm(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar tarjeta</Text>
              <TouchableOpacity 
                onPress={() => setShowCardForm(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={wp(24)} color={Colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                {/* Número de tarjeta */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Número de tarjeta</Text>
                  <View style={styles.cardInputWrapper}>
                    <TextInput
                      style={styles.cardInput}
                      placeholder="0000 0000 0000 0000"
                      placeholderTextColor={Colors.placeholder}
                      value={cardNumber}
                      onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                      keyboardType="numeric"
                      maxLength={19}
                    />
                    <View style={styles.cardIcons}>
                      <Ionicons name="card" size={wp(18)} color={Colors.textLight} />
                    </View>
                  </View>
                </View>

                {/* Nombre del titular */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nombre del titular</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Como aparece en la tarjeta"
                    placeholderTextColor={Colors.placeholder}
                    value={cardHolder}
                    onChangeText={setCardHolder}
                    autoCapitalize="words"
                  />
                </View>

                {/* Fecha de expiración y CVV */}
                <View style={styles.rowInputs}>
                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>Fecha de expiración</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/AA"
                      placeholderTextColor={Colors.placeholder}
                      value={expiry}
                      onChangeText={(text) => setExpiry(formatExpiry(text))}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>

                  <View style={styles.halfInput}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <View style={styles.cvvWrapper}>
                      <TextInput
                        style={styles.cvvInput}
                        placeholder="•••"
                        placeholderTextColor={Colors.placeholder}
                        value={cvv}
                        onChangeText={(text) => setCvv(text.replace(/\D/g, '').substring(0, 4))}
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                      />
                      <TouchableOpacity 
                        style={styles.cvvInfoBtn}
                        onPress={() => Alert.alert('CVV', 'El código de seguridad de 3 o 4 dígitos que aparece en el reverso de tu tarjeta.')}
                      >
                        <Ionicons name="information-circle-outline" size={wp(20)} color={Colors.textLight} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Guardar tarjeta */}
                <TouchableOpacity 
                  style={styles.saveCardRow}
                  onPress={() => setSaveCard(!saveCard)}
                >
                  <View style={[
                    styles.checkbox,
                    saveCard && styles.checkboxChecked
                  ]}>
                    {saveCard && (
                      <Ionicons name="checkmark" size={wp(14)} color={Colors.white} />
                    )}
                  </View>
                  <Text style={styles.saveCardText}>
                    Guardar tarjeta para futuros pagos
                  </Text>
                </TouchableOpacity>

                {/* Información de seguridad */}
                <View style={styles.securityInfo}>
                  <Ionicons name="shield-checkmark" size={wp(18)} color="#4CAF50" />
                  <Text style={styles.securityText}>
                    Tus datos están encriptados y seguros. No almacenamos información sensible sin tu permiso.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalButtonCancel}
                onPress={() => setShowCardForm(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonSave}
                onPress={handleCardPayment}
              >
                <Text style={styles.modalButtonSaveText}>Pagar ${total}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: hp(20) },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 0 : Spacing.md,
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textDark,
  },
  placeholder: { width: wp(40) },
  
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  summaryTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(8),
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  summaryValue: {
    fontSize: FontSize.sm,
    color: Colors.textDark,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: Spacing.md,
  },
  
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: Spacing.md,
  },
  
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  paymentCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FAF8',
  },
  paymentIcon: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  paymentInfo: { flex: 1 },
  paymentTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: hp(2),
  },
  paymentDesc: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  radio: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: Colors.primary,
  },
  
  priceCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(8),
  },
  priceLabel: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  priceValue: {
    fontSize: FontSize.sm,
    color: Colors.textDark,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
  },
  totalValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  
  secureText: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  
  spacer: { height: hp(20) },
  
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? hp(30) : Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textDark,
  },
  modalCloseBtn: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  modalBody: {
    padding: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: hp(6),
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? hp(14) : hp(10),
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  cardInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
  },
  cardInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? hp(14) : hp(10),
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  cardIcons: {
    paddingLeft: Spacing.xs,
  },
  
  // Campos en fila
  rowInputs: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  
  // CVV
  cvvWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
  },
  cvvInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? hp(14) : hp(10),
    fontSize: FontSize.md,
    color: Colors.textDark,
  },
  cvvInfoBtn: {
    paddingLeft: Spacing.xs,
  },
  
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  checkbox: {
    width: wp(22),
    height: wp(22),
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  saveCardText: {
    fontSize: FontSize.sm,
    color: Colors.textMedium,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FAF8',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  securityText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textMedium,
    lineHeight: hp(16),
  },
  modalFooter: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  modalButtonCancelText: {
    fontSize: FontSize.md,
    color: Colors.textMedium,
    fontWeight: '600',
  },
  modalButtonSave: {
    flex: 1,
    paddingVertical: hp(12),
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalButtonSaveText: {
    fontSize: FontSize.md,
    color: Colors.white,
    fontWeight: '600',
  },
});